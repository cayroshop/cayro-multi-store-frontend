import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config/env'
import { getAccessToken } from '@/lib/access-token'
import { useAuthStore } from '@/stores/auth-store'
import { getStoredRefreshToken } from '@/stores/auth-store'
import type { LoginResponse } from '@/types/api'

const baseURL = env.VITE_API_BASE_URL ?? '/api/v1'

/**
 * Single axios instance for the ERP API. Access JWT is kept in memory; refresh token is in sessionStorage.
 * `withCredentials: true` keeps the door open for future HttpOnly cookies.
 */
export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const raw = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let refreshPromise: Promise<LoginResponse | null> | null = null

function applySession(data: LoginResponse) {
  useAuthStore.getState().setSession(data.accessToken, data.refreshToken, data.user)
}

async function doRefresh(): Promise<LoginResponse | null> {
  const refresh = getStoredRefreshToken()
  if (!refresh) return null
  try {
    const { data } = await raw.post<LoginResponse>('/auth/refresh', { refreshToken: refresh })
    applySession(data)
    return data
  } catch {
    useAuthStore.getState().clear()
    return null
  }
}

apiClient.interceptors.request.use((config) => {
  const t = getAccessToken()
  if (t) {
    config.headers.Authorization = `Bearer ${t}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    if (!isAxiosError(error) || !error.config) {
      return Promise.reject(error)
    }
    const status = error.response?.status
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (status !== 401 || original._retry) {
      return Promise.reject(error)
    }
    if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/login')) {
      return Promise.reject(error)
    }

    original._retry = true

    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null
      })
    }
    const refreshed = await refreshPromise
    if (!refreshed?.accessToken) {
      return Promise.reject(error)
    }

    original.headers.Authorization = `Bearer ${refreshed.accessToken}`
    return apiClient(original)
  },
)

export async function bootstrapSession(): Promise<boolean> {
  useAuthStore.getState().hydrateFromStorage()
  const rt = getStoredRefreshToken()
  if (!rt) return false
  try {
    const { data } = await raw.post<LoginResponse>('/auth/refresh', { refreshToken: rt })
    applySession(data)
    return true
  } catch {
    useAuthStore.getState().clear()
    return false
  }
}

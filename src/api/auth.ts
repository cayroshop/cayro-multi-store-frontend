import { apiClient } from '@/lib/api-client'
import { getStoredRefreshToken, useAuthStore } from '@/stores/auth-store'
import type { LoginResponse, MenuPayload, UserProfile } from '@/types/api'

export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function logoutRequest() {
  const refresh = useAuthStore.getState().refreshToken ?? getStoredRefreshToken()
  if (refresh) {
    await apiClient.post('/auth/logout', { refreshToken: refresh }).catch(() => undefined)
  }
  useAuthStore.getState().clear()
}

export async function fetchMenu(): Promise<MenuPayload> {
  const { data } = await apiClient.get<MenuPayload>('/auth/me/menu')
  return data
}

export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/auth/me')
  return data
}

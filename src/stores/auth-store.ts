import { create } from 'zustand'

import { setAccessToken } from '@/lib/access-token'
import type { UserProfile } from '@/types/api'

const REFRESH_KEY = 'cayro_refresh_token'

function readRefresh(): string | null {
  try {
    return sessionStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

function writeRefresh(token: string | null) {
  try {
    if (token) sessionStorage.setItem(REFRESH_KEY, token)
    else sessionStorage.removeItem(REFRESH_KEY)
  } catch {
    /* ignore */
  }
}

type AuthState = {
  user: UserProfile | null
  accessToken: string | null
  refreshToken: string | null
  setSession: (accessToken: string, refreshToken: string, user: UserProfile) => void
  patchUser: (user: UserProfile) => void
  setAccess: (token: string | null) => void
  setRefresh: (token: string | null) => void
  clear: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setSession: (accessToken, refreshToken, user) => {
    setAccessToken(accessToken)
    writeRefresh(refreshToken)
    set({ accessToken, refreshToken, user })
  },

  patchUser: (user) => set({ user }),

  setAccess: (token) => {
    setAccessToken(token)
    set({ accessToken: token })
  },

  setRefresh: (token) => {
    writeRefresh(token)
    set({ refreshToken: token })
  },

  clear: () => {
    setAccessToken(null)
    writeRefresh(null)
    set({ user: null, accessToken: null, refreshToken: null })
  },

  hydrateFromStorage: () => {
    const refreshToken = readRefresh()
    set({ refreshToken })
  },
}))

export function getStoredRefreshToken(): string | null {
  return readRefresh()
}

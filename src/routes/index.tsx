import { Navigate, createFileRoute } from '@tanstack/react-router'

import { bootstrapSession } from '@/lib/api-client'
import { getStoredRefreshToken, useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    useAuthStore.getState().hydrateFromStorage()
    if (!useAuthStore.getState().accessToken && getStoredRefreshToken()) {
      await bootstrapSession()
    }
  },
  component: IndexGate,
})

function IndexGate() {
  const token = useAuthStore((s) => s.accessToken)
  const scope = useAuthStore((s) => s.user?.scope)

  if (!token) {
    return <Navigate to="/login" />
  }
  if (scope === 'HQ') {
    return <Navigate to="/hq/dashboard" />
  }
  return <Navigate to="/store/dashboard" />
}

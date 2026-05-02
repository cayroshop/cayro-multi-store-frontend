import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ErpShell } from '@/components/layout/erp-shell'
import { bootstrapSession } from '@/lib/api-client'
import { getStoredRefreshToken, useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/store')({
  beforeLoad: async () => {
    useAuthStore.getState().hydrateFromStorage()
    if (!useAuthStore.getState().accessToken && getStoredRefreshToken()) {
      await bootstrapSession()
    }
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: '/login' })
    }
    if (useAuthStore.getState().user?.scope !== 'STORE') {
      throw redirect({ to: '/hq/dashboard' })
    }
  },
  component: StoreLayout,
})

function StoreLayout() {
  return (
    <ErpShell audience="STORE">
      <Outlet />
    </ErpShell>
  )
}

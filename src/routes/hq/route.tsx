import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { FullPageLoader } from '@/components/layout/full-page-loader'
import { ErpShell } from '@/components/layout/erp-shell'
import { bootstrapSession } from '@/lib/api-client'
import { getStoredRefreshToken, useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/hq')({
  pendingComponent: FullPageLoader,
  pendingMs: 0,
  beforeLoad: async () => {
    useAuthStore.getState().hydrateFromStorage()
    if (!useAuthStore.getState().accessToken && getStoredRefreshToken()) {
      await bootstrapSession()
    }
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: '/login' })
    }
    if (useAuthStore.getState().user?.scope !== 'HQ') {
      throw redirect({ to: '/store/dashboard' })
    }
  },
  component: HqLayout,
})

function HqLayout() {
  return (
    <ErpShell audience="HQ">
      <Outlet />
    </ErpShell>
  )
}

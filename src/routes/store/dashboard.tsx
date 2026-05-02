import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/store/dashboard')({
  component: StoreDashboardPage,
})

function StoreDashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Store operations</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {user?.store?.name ?? 'Store'} ({user?.store?.code ?? '—'})
        </p>
      </div>
      <Card className="border-border/60 bg-card/50 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Today</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          POS, orders, and inventory modules will surface here as backend endpoints go live. Use the
          sidebar for navigation allowed for your role.
        </CardContent>
      </Card>
    </div>
  )
}

import { Link, createFileRoute } from '@tanstack/react-router'
import { BarChart3, Building2, Package, Shield, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/hq/dashboard')({
  component: HqDashboardPage,
})

function HqDashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {user?.name ?? 'User'} · {user?.email}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/hq/stores" className="group block">
          <Card className="border-border/60 bg-card/50 h-full shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stores</CardTitle>
              <Building2 className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Browse locations & GST details</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/hq/users/staff" className="group block">
          <Card className="border-border/60 bg-card/50 h-full shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Team & access</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/hq/users/admins" className="group block">
          <Card className="border-border/60 bg-card/50 h-full shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Roles</CardTitle>
              <Shield className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">CASL templates</p>
            </CardContent>
          </Card>
        </Link>
        <div className="block opacity-90">
          <Card className="border-border/60 bg-card/50 h-full shadow-sm backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <Package className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Waiting on Orders API</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/60 bg-muted/20 text-muted-foreground border-dashed shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <BarChart3 className="size-4" />
            Operational KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Inventory, POS, and fulfilment tiles will bind to aggregations as inventory / orders
          modules ship on the backend. For now, use the shortcuts above for admin data.
        </CardContent>
      </Card>
    </div>
  )
}

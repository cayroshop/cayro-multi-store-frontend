import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { getUser } from '@/api/users'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/hq/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  const { userId } = Route.useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/hq/users" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
          <ArrowLeft className="mr-2 inline size-4" /> Users
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="text-muted-foreground size-8 animate-spin" />
        </div>
      ) : null}
      {error ? <p className="text-destructive text-sm">{getApiErrorMessage(error)}</p> : null}

      {data ? (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{data.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{data.email}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>{data.scope}</Badge>
              <Badge variant="outline">{data.status}</Badge>
              {data.hqRole ? <Badge variant="secondary">{data.hqRole}</Badge> : null}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-6">
            <DetailRow label="Phone" value={data.phone ?? '—'} />
            <DetailRow
              label="Store"
              value={data.store ? `${data.store.name} (${data.store.code})` : '—'}
            />
            <DetailRow label="Role" value={data.role ? data.role.name : '—'} />
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Store access
              </p>
              <ul className="text-sm">
                {Array.isArray(data.storeAccess) && data.storeAccess.length
                  ? data.storeAccess.map(
                      (a: { store: { id: string; code: string; name: string } }) => (
                        <li key={a.store.id}>
                          {a.store.name} ({a.store.code})
                        </li>
                      ),
                    )
                  : '—'}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

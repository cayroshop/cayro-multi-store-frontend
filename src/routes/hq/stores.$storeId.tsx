import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { getStore } from '@/api/stores'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/hq/stores/$storeId')({
  component: StoreDetailPage,
})

function StoreDetailPage() {
  const { storeId } = Route.useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => getStore(storeId),
  })

  return (
    <div className="space-y-6">
      <Link to="/hq/stores" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
        <ArrowLeft className="mr-2 inline size-4" /> Stores
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="text-muted-foreground size-8 animate-spin" />
        </div>
      ) : null}
      {error ? <p className="text-destructive text-sm">{getApiErrorMessage(error)}</p> : null}

      {data ? (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold">{data.name}</CardTitle>
                <p className="text-muted-foreground font-mono text-sm">{data.code}</p>
              </div>
              <Badge variant="secondary">{data.type}</Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <Field label="GSTIN" value={data.gstin} mono />
            <Field label="Timezone" value={data.timezone} />
            <Field label="Address" value={data.address} className="sm:col-span-2" />
            <Field label="City" value={data.city} />
            <Field label="State" value={`${data.state} (${data.stateCode})`} />
            <Field label="Pincode" value={data.pincode} mono />
            <Field label="Phone" value={data.phone ?? '—'} />
            <Field label="Email" value={data.email ?? '—'} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  mono,
  className,
}: {
  label: string
  value: string
  mono?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{label}</p>
      <p className={`mt-1 font-medium ${mono ? 'font-mono text-sm' : ''}`}>{value}</p>
    </div>
  )
}

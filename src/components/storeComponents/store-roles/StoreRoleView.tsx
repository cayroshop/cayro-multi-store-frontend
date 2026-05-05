import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Building2, Shield, Pencil, CheckCircle2, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { getStoreRoleById } from '@/api/store/storeRoles'

const ACTION_STYLES: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  read: 'bg-blue-100 text-blue-700 border border-blue-200',
  update: 'bg-amber-100 text-amber-700 border border-amber-200',
  delete: 'bg-red-100 text-red-700 border border-red-200',
  manage: 'bg-violet-100 text-violet-700 border border-violet-200',
}

const TEMPLATE_STYLES: Record<string, string> = {
  STORE_MANAGER: 'bg-violet-100 text-violet-700 border-violet-200',
  ORDER_EXECUTIVE: 'bg-blue-100 text-blue-700 border-blue-200',
  PURCHASE_EXECUTIVE: 'bg-amber-100 text-amber-700 border-amber-200',
  INVENTORY_EXECUTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CASHIER: 'bg-pink-100 text-pink-700 border-pink-200',
  VIEWER_AUDITOR: 'bg-slate-100 text-slate-600 border-slate-200',
}

function ViewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-24" />
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Separator />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StoreRoleView({ id }: { id: string }) {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['storeRole', id],
    queryFn: () => getStoreRoleById(id),
  })

  if (isLoading) return <ViewSkeleton />
  if (!data)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Shield className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium">Role not found</p>
        <p className="text-sm text-muted-foreground mt-1">This role may have been deleted.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: '/store/settings/roles' })}
        >
          Back to Roles
        </Button>
      </div>
    )

  const templateClass =
    TEMPLATE_STYLES[data.template] ?? 'bg-muted text-muted-foreground border-border'

  // Group abilities by subject
  const groupedAbilities = data.abilities.reduce(
    (acc, ability) => {
      if (!acc[ability.subject]) acc[ability.subject] = []
      acc[ability.subject].push(ability)
      return acc
    },
    {} as Record<string, typeof data.abilities>,
  )

  return (
    <div className="space-y-6 pb-10 ">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/store/settings/roles' })}
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate({ to: '/store/settings/roles', search: { edit: id } })}
          className="gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Role
        </Button>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        {/* Role Header */}
        <CardHeader className="bg-muted/30 border-b pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight truncate">{data.name}</h1>
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${templateClass}`}
                >
                  {data.template.replace(/_/g, ' ')}
                </span>
              </div>
              {data.description && (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Store Info */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/40 border border-border/50">
            <div className="p-2 rounded-md bg-background border border-border/60 mt-0.5">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Store
              </p>
              <p className="font-semibold text-sm">{data.store.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Code: {data.store.code}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Created', value: data.createdAt },
              { label: 'Last Updated', value: data.updatedAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium mt-0.5">
                    {new Date(value).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <h3 className="font-semibold">Permissions</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {data.abilities.length} total
              </Badge>
            </div>

            {data.abilities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-lg">
                <Shield className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No permissions assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedAbilities).map(([subject, abilities]) => (
                  <div key={subject} className="rounded-lg border border-border/60 overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted/40 border-b border-border/60">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {subject}
                      </p>
                    </div>
                    <div className="divide-y divide-border/40">
                      {abilities.map((ability) => {
                        const actionClass =
                          ACTION_STYLES[ability.action] ??
                          'bg-muted text-muted-foreground border border-border'
                        return (
                          <div
                            key={ability.id}
                            className="flex items-center justify-between px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize ${actionClass}`}
                              >
                                {ability.action}
                              </span>
                              {ability.conditions?.storeId && (
                                <span className="text-xs text-muted-foreground">
                                  Store restricted
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {ability.inverted ? (
                                <>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  <span className="text-xs font-medium text-destructive">
                                    Denied
                                  </span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  <span className="text-xs font-medium text-emerald-600">
                                    Allowed
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

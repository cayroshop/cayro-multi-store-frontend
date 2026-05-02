import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { getRole } from '@/api/roles'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/hq/roles/$roleId')({
  component: RoleDetailPage,
})

function RoleDetailPage() {
  const { roleId } = Route.useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
  })

  return (
    <div className="space-y-6">
      <Link to="/hq/roles" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
        <ArrowLeft className="mr-2 inline size-4" /> Roles
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
            <CardTitle className="text-2xl font-semibold">{data.name}</CardTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">{data.template}</Badge>
              {data.store ? (
                <Badge variant="outline">
                  {data.store.name} ({data.store.code})
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-6">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Abilities
            </p>
            <ul className="flex flex-wrap gap-2">
              {data.abilities?.map((a) => (
                <li key={a.id}>
                  <Badge variant="outline" className="font-normal">
                    {a.action} · {a.subject}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

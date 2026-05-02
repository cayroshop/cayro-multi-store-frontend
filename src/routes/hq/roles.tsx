import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

import { listRoles } from '@/api/roles'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/hq/roles')({
  component: RolesPage,
})

function RolesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: listRoles,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Roles</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Read-only directory —{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">GET /roles</code>
        </p>
      </div>

      <Card className="border-border/60 overflow-hidden shadow-sm">
        <CardHeader className="border-border/60 border-b py-4">
          <CardTitle className="text-base font-medium">Role templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <p className="text-destructive p-6 text-sm">{getApiErrorMessage(error)}</p>
          ) : null}
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Abilities</TableHead>
                  <TableHead className="text-right">Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : null}
                {data?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.template}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.store ? `${r.store.name} (${r.store.code})` : '—'}
                    </TableCell>
                    <TableCell>{r.abilities?.length ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        to="/hq/roles/$roleId"
                        params={{ roleId: r.id }}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

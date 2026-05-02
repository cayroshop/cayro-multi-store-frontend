import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { listUsers } from '@/api/users'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

export const Route = createFileRoute('/hq/users')({
  component: UsersPage,
})

function UsersPage() {
  const [emailFilter, setEmailFilter] = useState('')

  const queryParams = useMemo(
    () => ({
      limit: 100,
      ...(emailFilter.trim() ? { email: emailFilter.trim() } : {}),
    }),
    [emailFilter],
  )

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => listUsers(queryParams),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Directory synced with{' '}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">GET /users</code>
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Filter by email…"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="h-10"
          />
          <Button type="button" variant="secondary" className="shrink-0" onClick={() => refetch()}>
            Search
          </Button>
        </div>
      </div>

      <Card className="border-border/60 overflow-hidden shadow-sm">
        <CardHeader className="border-border/60 border-b py-4">
          <CardTitle className="text-base font-medium">Team members</CardTitle>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Status</TableHead>
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
                {data?.items.map((u) => (
                  <TableRow key={u.id} className="group">
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.scope}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to="/hq/users/$userId"
                        params={{ userId: u.id }}
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
          <div className="border-border flex items-center justify-between border-t p-4">
            <p className="text-muted-foreground text-xs">
              {data?.items.length ?? 0} rows
              {data?.nextCursor ? ' · more available via API cursor (pagination UI later)' : ''}
              {isFetching ? ' · refreshing…' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

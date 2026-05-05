import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Column } from '@/components/commonUI/data-table'
import { deleteUser, listUsers } from '@/api/users'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { DataTable } from '@/components/commonUI/data-table'
import type { UserListItem } from '@/types/api'
import { TablePagination } from '@/components/commonUI/table-pagination'
import { CommonStatus } from '@/components/commonUI/CommonStatus'
import { DeleteButton } from '@/components/commonUI/delete-button'

export const Route = createFileRoute('/hq/users')({
  component: UsersPage,
})

function UsersPage() {
  const [emailFilter, setEmailFilter] = useState('')
  const [limit, setLimit] = useState(10)
  const [cursor, setCursor] = useState<string | undefined>()
  const [cursorStack, setCursorStack] = useState<string[]>([])

  const queryParams = useMemo(
    () => ({
      limit: 100,
      ...(emailFilter.trim() ? { email: emailFilter.trim() } : {}),
    }),
    [emailFilter],
  )

  const handleNext = () => {
    if (data?.nextCursor) {
      setCursorStack((prev) => [...prev, cursor || ''])
      setCursor(data.nextCursor)
    }
  }

  const handlePrevious = () => {
    setCursorStack((prev) => {
      const newStack = [...prev]
      const prevCursor = newStack.pop()
      setCursor(prevCursor || undefined)
      return newStack
    })
  }

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => listUsers(queryParams),
  })
  const columns: Column<UserListItem>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
      className: 'text-muted-foreground max-w-50 truncate',
    },
    {
      header: 'Scope',
      accessor: 'scope',
      render: (value) => <Badge variant="secondary">{value as string}</Badge>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <CommonStatus value={value as string} />,
    },
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
        </div>

        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Filter by email…"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="h-10"
          />
          <Button
            type="button"
            variant="default"
            className="h-10 shrink-0"
            onClick={() => refetch()}
          >
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

          <DataTable
            data={data?.items}
            columns={columns}
            isLoading={isLoading}
            loadingComponent={
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            }
            emptyText="No users found"
            action={(u) => (
              <div className="flex justify-end items-center gap-2">
                {/* View */}
                <Link
                  to="/hq/users/$userId"
                  params={{ userId: u.id }}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                >
                  View
                </Link>

                {/* Delete */}
                <DeleteButton onDelete={() => deleteUser(u.id)} queryKeyToInvalidate={['users']} />
              </div>
            )}
          />

          <div className="border-border flex items-center justify-between border-t p-4">
            <p className="text-muted-foreground text-xs">
              {data?.items.length ?? 0} rows
              {data?.nextCursor ? ' · more available via API cursor (pagination UI later)' : ''}
              {isFetching ? ' · refreshing…' : ''}
            </p>
          </div>

          <TablePagination
            limit={limit}
            onLimitChange={(val) => {
              setLimit(val)
              setCursor(undefined)
              setCursorStack([])
            }}
            hasNextPage={!!data?.nextCursor}
            onNext={handleNext}
            onPrevious={cursorStack.length ? handlePrevious : undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}

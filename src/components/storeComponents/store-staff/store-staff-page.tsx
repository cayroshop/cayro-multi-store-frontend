import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableCell, TableRow } from '@/components/ui/table'

import { DataTable, type Column } from '@/components/commonUI/data-table'
import { TablePagination } from '@/components/commonUI/table-pagination'
import DeleteConfirmDialog from '@/components/commonUI/DeleteConfirmDialog'

import { deleteStoreUser, listStoreUsers, type StoreUser } from '@/api/store/storeUser'
import { getApiErrorMessage } from '@/lib/errors'
import { CommonButton } from '@/components/commonUI/commonButton'
import { CommonStatus } from '@/components/commonUI/CommonStatus'

export default function StoreStaffPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [limit, setLimit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<StoreUser | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['storeUsers'],
    queryFn: () => listStoreUsers(limit),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStoreUser,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['storeUsers'] })
      const prev = queryClient.getQueryData<StoreUser[]>(['storeUsers'])
      queryClient.setQueryData<StoreUser[]>(['storeUsers'], (old = []) =>
        old.filter((user) => user.id !== id),
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['storeUsers'], ctx?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['storeUsers'] })
      setDeleteTarget(null)
    },
  })

  const columns: Column<StoreUser>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (value) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase">
            {String(value)
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <span className="font-semibold text-foreground">{String(value)}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      className: 'text-muted-foreground text-sm',
    },
    {
      header: 'Phone',
      accessor: 'phone',
      className: 'text-muted-foreground text-sm',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <CommonStatus value={String(value)} />,
    },
    {
      header: 'Scope',
      accessor: 'scope',
      render: (value) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {String(value)}
        </span>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (value) =>
        value
          ? new Date(String(value)).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '—',
    },
  ]

  const actions = (row: StoreUser) => (
    <div className="flex justify-end gap-1.5">
      <CommonButton
        type="view"
        onClick={() => navigate({ to: '/store/settings/staff', search: { view: row.id } })}
      />
      <CommonButton
        type="edit"
        onClick={() => navigate({ to: '/store/settings/staff', search: { edit: row.id } })}
      />
      <CommonButton type="delete" onClick={() => setDeleteTarget(row)} />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage store staff members and their roles
          </p>
        </div>

        <Button
          onClick={() => navigate({ to: '/store/settings/staff', search: { create: 'true' } })}
          className="gap-1.5"
        >
          <span className="text-base leading-none">+</span> Add Staff
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b pb-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Staff List
            </CardTitle>
            {data && (
              <span className="text-xs text-muted-foreground">
                {data.length} member{data.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error && <p className="text-destructive p-6 text-sm">{getApiErrorMessage(error)}</p>}

          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            loadingComponent={
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            }
            emptyText="No staff found. Add your first staff member to get started."
            action={actions}
          />

          <TablePagination
            limit={limit}
            onLimitChange={setLimit}
            hasNextPage={false}
            onNext={() => {}}
            onPrevious={undefined}
          />
        </CardContent>
      </Card>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Remove Staff Member"
        description={`Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone and will revoke their store access.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}

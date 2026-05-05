/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Pencil, Trash, Eye, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableCell, TableRow } from '@/components/ui/table'

import { DataTable, type Column } from '@/components/commonUI/data-table'
import { TablePagination } from '@/components/commonUI/table-pagination'
import DeleteConfirmDialog from '@/components/commonUI/DeleteConfirmDialog'

import { deleteStoreRole, listStoreRoles, type StoreRole } from '@/api/store/storeRoles'
import { getApiErrorMessage } from '@/lib/errors'
import { STATUS_LIST } from '@/components/commonUI/status'

export default function StoreRolesPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [limit, setLimit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<StoreRole | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['storeRoles'],
    queryFn: listStoreRoles,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStoreRole,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['storeRoles'] })
      const prev = queryClient.getQueryData<StoreRole[]>(['storeRoles'])
      queryClient.setQueryData<StoreRole[]>(['storeRoles'], (old = []) =>
        old.filter((role) => role.id !== id),
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['storeRoles'], ctx?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['storeRoles'] })
      setDeleteTarget(null)
    },
  })

  const columns: Column<StoreRole>[] = [
    {
      header: 'Role Name',
      accessor: 'name',
      render: (value) => <span className="font-semibold text-foreground">{String(value)}</span>,
    },
    {
      header: 'Template',
      accessor: 'template',
      render: (value) => {
        const item = STATUS_LIST.find((i) => i.value === String(value))

        const colorClass = item?.className ?? 'bg-muted text-muted-foreground border-border'

        const label = item?.label ?? String(value).replace(/_/g, ' ')

        return (
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {label}
          </span>
        )
      },
    },
    {
      header: 'Description',
      accessor: 'description',
      className: 'max-w-[260px] truncate text-muted-foreground text-sm',
    },
    {
      header: 'Permissions',
      accessor: 'abilities',
      render: (value) => (
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{(value as any[])?.length || 0}</span>
        </div>
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

  const actions = (row: StoreRole) => (
    <div className="flex justify-end gap-1.5">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: '/store/settings/roles', search: { view: row.id } })}
        title="View"
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: '/store/settings/roles', search: { edit: row.id } })}
        title="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => setDeleteTarget(row)}
        title="Delete"
      >
        <Trash className="h-3.5 w-3.5" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Roles</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage role templates and their permissions
          </p>
        </div>

        <Button
          onClick={() => navigate({ to: '/store/settings/roles', search: { create: 'true' } })}
          className="gap-1.5"
        >
          <span className="text-base leading-none">+</span> Create Role
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b bg-muted/30 py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Roles List
            </CardTitle>
            {data && (
              <span className="text-xs text-muted-foreground">
                {data.length} role{data.length !== 1 ? 's' : ''}
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
                <TableCell colSpan={6} className="h-32 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            }
            emptyText="No roles found. Create your first role to get started."
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
        title="Delete Role"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone and may affect users assigned to this role.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}

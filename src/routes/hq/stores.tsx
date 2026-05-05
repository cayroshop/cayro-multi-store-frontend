import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { listStores } from '@/api/stores'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableCell, TableRow } from '@/components/ui/table'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

import { DataTable } from '@/components/commonUI/data-table'
import { TablePagination } from '@/components/commonUI/table-pagination'
import type { Column } from '@/components/commonUI/data-table'
import type { StoreRecord } from '@/types/api'
import { CommonStatus } from '@/components/commonUI/CommonStatus'
import { CommonModal } from '@/components/commonUI/common-modal'

export const Route = createFileRoute('/hq/stores')({
  component: StoresPage,
})

function StoresPage() {
  const [limit, setLimit] = useState(10)
  const [selectedStore, setSelectedStore] = useState<StoreRecord | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: listStores,
  })

  // ✅ Columns define
  const columns: Column<StoreRecord>[] = [
    {
      header: 'Code',
      accessor: 'code',
      className: 'font-mono text-sm font-semibold',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (value) => <CommonStatus value={value as string} />,
    },
    {
      header: 'City',
      accessor: 'city',
      className: 'text-muted-foreground',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Stores</h2>
      </div>

      <Card className="border-border/60 overflow-hidden shadow-sm">
        <CardHeader className="border-border/60 border-b py-4">
          <CardTitle className="text-base font-medium">Locations</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {error ? (
            <p className="text-destructive p-6 text-sm">{getApiErrorMessage(error)}</p>
          ) : null}

          {/* ✅ DataTable */}
          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            loadingComponent={
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            }
            emptyText="No stores found"
            action={(s) => (
              <button
                onClick={() => {
                  setSelectedStore(s)
                  setOpenModal(true)
                }}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              >
                View
              </button>
            )}
          />

          <CommonModal open={openModal} onClose={() => setOpenModal(false)} title="Store Details">
            {selectedStore && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Code</p>
                  <p className="font-medium">{selectedStore.code}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedStore.name}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Type</p>
                  <CommonStatus value={selectedStore.type} />
                </div>

                <div>
                  <p className="text-muted-foreground">City</p>
                  <p>{selectedStore.city}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">State</p>
                  <p>{selectedStore.state}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Pincode</p>
                  <p>{selectedStore.pincode}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p>{selectedStore.phone}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{selectedStore.email}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p>{selectedStore.address}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">GSTIN</p>
                  <p>{selectedStore.gstin}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Timezone</p>
                  <p>{selectedStore.timezone}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Status</p>
                  <CommonStatus value={selectedStore.isActive ? 'active' : 'inactive'} />
                </div>

                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>
                    {selectedStore.createdAt
                      ? new Date(selectedStore.createdAt).toLocaleString()
                      : '-'}
                  </p>{' '}
                </div>
              </div>
            )}
          </CommonModal>

          {/* ✅ Pagination */}
          <TablePagination
            limit={limit}
            onLimitChange={setLimit}
            hasNextPage={false}
            onNext={() => {}}
            onPrevious={undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}

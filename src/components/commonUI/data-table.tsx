import { type ReactNode } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

export type Column<T> = {
  header: string
  accessor: keyof T
  className?: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

type DataTableProps<T> = {
  data?: T[]
  columns: Column<T>[]
  isLoading?: boolean
  loadingComponent?: ReactNode
  emptyText?: string
  action?: (row: T) => ReactNode
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  loadingComponent,
  emptyText = 'No data found',
  action,
}: DataTableProps<T>) {
  return (
    <ScrollArea className="w-full max-h-125">
      <Table>
        {/* ✅ Header */}
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.accessor)}>{col.header}</TableHead>
            ))}
            {action && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        {/* ✅ Body */}
        <TableBody>
          {isLoading ? (
            loadingComponent
          ) : data?.length ? (
            data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => {
                  const value = row[col.accessor]
                  return (
                    <TableCell key={String(col.accessor)} className={col.className}>
                      {col.render ? col.render(value, row) : String(value)}
                    </TableCell>
                  )
                })}
                {action && <TableCell className="text-right">{action(row)}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (action ? 1 : 0)}
                className="text-center py-6 text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

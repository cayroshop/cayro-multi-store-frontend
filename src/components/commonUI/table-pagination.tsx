import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TablePaginationProps = {
  limit: number
  onLimitChange: (val: number) => void

  hasNextPage?: boolean
  onNext: () => void

  onPrevious?: () => void
}

export function TablePagination({
  limit,
  onLimitChange,
  hasNextPage,
  onNext,
  onPrevious,
}: TablePaginationProps) {
  return (
    <div className="border-border flex items-center justify-between border-t p-4">
      {/* Rows per page */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Rows per page</span>

        <Select value={String(limit)} onValueChange={(val) => onLimitChange(Number(val))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination buttons */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPrevious?.()
              }}
              className={!onPrevious ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (hasNextPage) onNext()
              }}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

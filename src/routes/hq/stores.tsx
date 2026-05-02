import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

import { listStores } from '@/api/stores'
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

export const Route = createFileRoute('/hq/stores')({
  component: StoresPage,
})

function StoresPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: listStores,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Stores</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Live list from <code className="bg-muted rounded px-1 py-0.5 text-xs">GET /stores</code>
        </p>
      </div>

      <Card className="border-border/60 overflow-hidden shadow-sm">
        <CardHeader className="border-border/60 border-b py-4">
          <CardTitle className="text-base font-medium">Locations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <p className="text-destructive p-6 text-sm">{getApiErrorMessage(error)}</p>
          ) : null}
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
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
                {data?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm font-semibold">{s.code}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.city}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        to="/hq/stores/$storeId"
                        params={{ storeId: s.id }}
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

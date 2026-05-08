import { Badge } from '@/components/ui/badge'
import { STATUS_LIST } from './status'
import { cn } from '@/lib/utils'

type CommonStatusProps = {
  value: string
  list?: typeof STATUS_LIST
}

export function CommonStatus({ value, list = STATUS_LIST }: CommonStatusProps) {
  const status = list.find((s) => s.value.toLowerCase() === value.toLowerCase())

  if (!status) {
    return <Badge className="bg-gray-100 text-gray-600 border-0">{value}</Badge>
  }

  return <Badge className={cn(status.className, 'border-0')}>{status.label}</Badge>
}

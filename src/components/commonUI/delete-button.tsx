import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

type DeleteButtonProps = {
  onDelete: () => Promise<unknown>
  queryKeyToInvalidate?: unknown[]
  confirmText?: string
}

export function DeleteButton({
  onDelete,
  queryKeyToInvalidate,
  confirmText = 'Are you sure you want to delete?',
}: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      toast.success('Deleted successfully')

      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate })
      }

      setConfirming(false)
    },
    onError: () => {
      toast.error('Delete failed')
      setConfirming(false)
    },
  })

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{confirmText}</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Yes'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          No
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setConfirming(true)}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}

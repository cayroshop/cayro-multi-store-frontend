import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

type SubmitButtonProps = {
  onSubmit: () => Promise<unknown>
  label?: string
  loadingLabel?: string
  successMessage?: string
  errorMessage?: string
  variant?: 'default' | 'secondary' | 'destructive'
}

export function SubmitButton({
  onSubmit,
  label = 'Submit',
  loadingLabel = 'Submitting...',
  successMessage = 'Submitted successfully',
  errorMessage = 'Something went wrong',
  variant = 'default',
}: SubmitButtonProps) {
  const mutation = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      toast.success(successMessage)
    },
    onError: () => {
      toast.error(errorMessage)
    },
  })

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  )
}

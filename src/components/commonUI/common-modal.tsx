import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type CommonModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function CommonModal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: CommonModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-2xl bg-background shadow-lg border p-6',
          className,
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        {title && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        )}

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  )
}

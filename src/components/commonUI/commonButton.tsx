import { Eye, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ActionType = 'view' | 'edit' | 'delete'

interface CommonButtonProps {
  type: ActionType
  onClick: () => void
}

export const CommonButton = ({ type, onClick }: CommonButtonProps) => {
  const config = {
    view: {
      icon: Eye,
      title: 'View',
      className: 'hover:text-blue-500',
    },
    edit: {
      icon: Pencil,
      title: 'Edit',
      className: 'hover:text-amber-500',
    },
    delete: {
      icon: Trash,
      title: 'Delete',
      className: 'hover:text-destructive',
    },
  }

  const { icon: Icon, title, className } = config[type]

  return (
    <Button
      size="icon"
      variant="ghost"
      className={`h-8 w-8 text-muted-foreground ${className}`}
      onClick={onClick}
      title={title}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  )
}

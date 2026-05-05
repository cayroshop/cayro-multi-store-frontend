import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

const sequence = ['light', 'dark', 'system'] as const

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycle = () => {
    const current = (theme ?? 'system') as (typeof sequence)[number]
    const idx = Math.max(0, sequence.indexOf(current))
    setTheme(sequence[(idx + 1) % sequence.length])
  }

  if (!resolvedTheme) {
    return (
      <Button variant="ghost" size="icon" className="size-9" disabled>
        <Sun className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9"
      aria-label={`Theme: ${theme ?? 'system'}. Click to cycle light, dark, system.`}
      onClick={cycle}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  )
}

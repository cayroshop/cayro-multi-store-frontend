import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'

const sequence = ['light', 'dark', 'system'] as const
const emptySubscribe = () => () => undefined

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const cycle = () => {
    const current = (theme ?? 'system') as (typeof sequence)[number]
    const idx = Math.max(0, sequence.indexOf(current))
    setTheme(sequence[(idx + 1) % sequence.length])
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9" aria-hidden disabled>
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

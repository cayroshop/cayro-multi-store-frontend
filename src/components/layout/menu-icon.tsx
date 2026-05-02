import type { ComponentType } from 'react'
import * as Icons from 'lucide-react'

function toPascal(kebab: string): string {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

export function MenuIcon({ name, className }: { name: string; className?: string }) {
  const key = toPascal(name)
  const Cmp = ((Icons as unknown as Record<string, ComponentType<{ className?: string }>>)[key] ??
    Icons.Circle) as ComponentType<{ className?: string }>
  return <Cmp className={className} aria-hidden />
}

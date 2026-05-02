import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { LogOut, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

import { fetchMenu, logoutRequest } from '@/api/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { MenuIcon } from '@/components/layout/menu-icon'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import type { MenuItem } from '@/types/api'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'

function NavSection({
  items,
  pathname,
  depth = 0,
}: {
  items: MenuItem[]
  pathname: string
  depth?: number
}) {
  return (
    <ul className={cn('space-y-0.5', depth > 0 && 'border-border mt-1 border-l pl-3')}>
      {items.map((item) => (
        <li key={item.key}>
          <div className="flex flex-col gap-0.5">
            <Link
              to={item.path}
              className={cn(
                'hover:bg-accent/80 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.path || pathname.startsWith(`${item.path}/`)
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <MenuIcon name={item.icon} className="size-4 shrink-0 opacity-80" />
              <span className="truncate">{item.label}</span>
            </Link>
            {item.children?.length ? (
              <NavSection items={item.children} pathname={pathname} depth={depth + 1} />
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

function SidebarBody({ menu, pathname }: { menu: MenuItem[]; pathname: string }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 pr-2">
      <p className="text-muted-foreground px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase">
        Navigation
      </p>
      <NavSection items={menu} pathname={pathname} />
    </nav>
  )
}

export function ErpShell({
  children,
  audience,
}: {
  children: React.ReactNode
  audience: 'HQ' | 'STORE'
}) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)

  const { data, isLoading } = useQuery({
    queryKey: ['auth-menu', audience],
    queryFn: fetchMenu,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (data?.user) useAuthStore.getState().patchUser(data.user)
  }, [data?.user])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  const menu = data?.menu ?? []
  const user = data?.user

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?'

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-3 py-4">
        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl font-semibold shadow-md">
          C
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">Cayro ERP</p>
          <p className="text-muted-foreground truncate text-xs">
            {audience === 'HQ' ? 'HQ' : 'Store'}
          </p>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 py-4">
        {isLoading ? (
          <div className="space-y-2 px-3">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ) : (
          <SidebarBody menu={menu} pathname={pathname} />
        )}
      </ScrollArea>
      <Separator />
      <div className="flex items-center gap-2 p-3">
        <Avatar className="size-9 border shadow-sm">
          <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user?.name ?? '—'}</p>
          <p className="text-muted-foreground truncate text-xs">{user?.email ?? ''}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-background flex min-h-svh w-full">
      <aside
        className={cn(
          'border-border bg-card/40 supports-[backdrop-filter]:bg-card/30 sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r backdrop-blur-xl lg:flex',
        )}
      >
        {sidebar}
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-md">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="size-4" />
          </Button>
          <div className="flex flex-1 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Overview
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight capitalize">
                {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'Home'}
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label="Log out"
                onClick={async () => {
                  await logoutRequest()
                  void navigate({ to: '/login' })
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="relative flex-1 p-4 md:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.18),transparent)]" />
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

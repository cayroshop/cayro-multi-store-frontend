import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { LogOut, PanelLeft, PanelLeftClose } from 'lucide-react'
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

// ─── Nav item for collapsed (icon-only) mode ────────────────────────────────

function NavItemCollapsed({ item, pathname }: { item: MenuItem; pathname: string }) {
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)
  return (
    <Link
      to={item.path}
      title={item.label}
      className={cn(
        'group relative flex size-10 items-center justify-center rounded-lg transition-all duration-150',
        isActive
          ? 'bg-white/20 text-white shadow-sm'
          : 'text-white/70 hover:bg-white/10 hover:text-white',
      )}
    >
      <MenuIcon name={item.icon} className="size-4 shrink-0" />
      <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
    </Link>
  )
}

// ─── Nav section for expanded mode ──────────────────────────────────────────

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
    <ul className={cn('space-y-0.5', depth > 0 && 'mt-1 border-l border-white/20 pl-3')}>
      {items.map((item) => (
        <li key={item.key}>
          <div className="flex flex-col gap-0.5">
            <Link
              to={item.path}
              className={cn(
                'flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                pathname === item.path || pathname.startsWith(`${item.path}/`)
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <MenuIcon name={item.icon} className="size-4 shrink-0 opacity-90" />
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
      <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-white/50">
        Navigation
      </p>
      <NavSection items={menu} pathname={pathname} />
    </nav>
  )
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export function ErpShell({
  children,
  audience,
}: {
  children: React.ReactNode
  audience: 'HQ' | 'STORE'
}) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Mobile sheet state — local only, never persisted
  const [mobileOpen, setMobileOpen] = useState(false)

  // Desktop collapse state
  const [collapsed, setCollapsed] = useState(false)

  // Keep useUiStore in sync so other consumers (if any) stay consistent
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  useEffect(() => {
    setSidebarOpen(mobileOpen)
  }, [mobileOpen, setSidebarOpen])

  const { data, isLoading: menuLoading } = useQuery({
    queryKey: ['auth-menu', audience],
    queryFn: fetchMenu,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })

  useEffect(() => {
    if (data?.user) {
      useAuthStore.getState().patchUser(data.user)
    }
  }, [data?.user])

  // Close mobile sidebar on route change
  const prevPathRef = useRef(pathname)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setMobileOpen(false)
      prevPathRef.current = pathname
    }
  }, [pathname])

  const menu = data?.menu ?? []
  const user = data?.user

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?'

  // ── Collapsed sidebar (icon-only) ─────────────────────────────────────────
  const collapsedSidebar = (
    <div className="flex h-full min-h-0 flex-col items-center overflow-hidden">
      {/* Logo */}
      <div className="flex h-14 w-full shrink-0 items-center justify-center">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 font-semibold text-white shadow-md">
          C
        </div>
      </div>

      {/* Expand button */}
      <button
        onClick={() => setCollapsed(false)}
        className="group relative mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Expand sidebar"
      >
        <PanelLeft className="size-4" />
        <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Expand
        </span>
      </button>

      <Separator className="mb-3 w-8 shrink-0 bg-white/15" />

      {/* Nav icons */}
      <ScrollArea className="min-h-0 flex-1 w-full">
        <div className="flex flex-col items-center gap-1 px-1 py-1">
          {menuLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="size-10 shrink-0 rounded-lg bg-white/15" />
              ))
            : menu.map((item) => (
                <NavItemCollapsed key={item.key} item={item} pathname={pathname} />
              ))}
        </div>
      </ScrollArea>

      <Separator className="mt-3 w-8 shrink-0 bg-white/15" />

      {/* Avatar */}
      <div className="group relative shrink-0 py-3">
        <Avatar className="size-9 cursor-default border border-white/20 shadow-sm">
          <AvatarFallback className="bg-white/20 text-xs font-medium text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="pointer-events-none absolute left-full bottom-3 z-50 ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1.5 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          <p className="font-medium">{user?.name ?? '—'}</p>
          <p className="opacity-70">{user?.email ?? ''}</p>
        </div>
      </div>
    </div>
  )

  // ── Expanded sidebar ──────────────────────────────────────────────────────
  const expandedSidebar = (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 px-3 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 font-semibold text-white shadow-md">
          C
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight text-white">Cayro ERP</p>
          <p className="truncate text-xs text-white/60">{audience === 'HQ' ? 'HQ' : 'Store'}</p>
        </div>
        {/* Collapse button — desktop only */}
        <button
          onClick={() => setCollapsed(true)}
          className="hidden shrink-0 size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:flex"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <Separator className="shrink-0 bg-white/15" />

      {/* Nav — scrollable, takes remaining space */}
      <ScrollArea className="min-h-0 flex-1 py-4">
        {menuLoading ? (
          <div className="space-y-3 px-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Skeleton className="h-4 w-4 rounded bg-white/15" />
                  <Skeleton className="h-4 w-32 rounded bg-white/15" />
                </div>
                {i % 3 === 1 && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <Skeleton className="h-3 w-3 rounded bg-white/10" />
                      <Skeleton className="h-3 w-24 rounded bg-white/10" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <SidebarBody menu={menu} pathname={pathname} />
        )}
      </ScrollArea>

      <Separator className="shrink-0 bg-white/15" />

      {/* User footer — always visible */}
      <div className="flex shrink-0 items-center gap-2 p-3">
        <Avatar className="size-9 border border-white/20 shadow-sm">
          <AvatarFallback className="bg-white/20 text-xs font-medium text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user?.name ?? '—'}</p>
          <p className="truncate text-xs text-white/60">{user?.email ?? ''}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-background flex min-h-svh w-full">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'sidebar-green sticky top-0 hidden h-dvh shrink-0 flex-col lg:flex',
          'transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-15' : 'w-64',
        )}
      >
        {collapsed ? collapsedSidebar : expandedSidebar}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="sidebar-green w-72 border-r-0 p-0">
          {expandedSidebar}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-md">
          {/* Mobile hamburger */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <PanelLeft className="size-4" />
          </Button>

          <div className="flex flex-1 items-center justify-between gap-3 overflow-hidden">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Overview
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight capitalize">
                {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'Home'}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="size-9 hover:text-destructive"
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

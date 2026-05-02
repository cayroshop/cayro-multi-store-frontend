import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center text-sm">{message}</p>
      <Button type="button" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Screen not built yet</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        This menu path does not have a matching route in the SPA yet, or your branch is ahead of the
        backend module. HQ/store shells only ship routes that match implemented APIs.
      </p>
      <Link to="/" className="text-primary text-sm font-medium underline underline-offset-4">
        Back to home
      </Link>
    </div>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: function Root() {
    return (
      <ThemeProvider>
        <TooltipProvider delay={200}>
          <ErrorBoundary FallbackComponent={RootErrorFallback}>
            <Outlet />
          </ErrorBoundary>
          <Toaster richColors position="top-right" />
          {import.meta.env.DEV ? <TanStackRouterDevtools position="bottom-right" /> : null}
        </TooltipProvider>
      </ThemeProvider>
    )
  },
})

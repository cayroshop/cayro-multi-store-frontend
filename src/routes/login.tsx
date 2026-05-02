import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Building2, Loader2 } from 'lucide-react'
import { useId } from 'react'
import { toast } from 'sonner'

import { loginRequest } from '@/api/auth'
import { bootstrapSession } from '@/lib/api-client'
import { getStoredRefreshToken } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    useAuthStore.getState().hydrateFromStorage()
    if (!useAuthStore.getState().accessToken && getStoredRefreshToken()) {
      await bootstrapSession()
    }
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const emailId = useId()
  const passwordId = useId()
  const navigate = useNavigate()
  const login = useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      loginRequest(body.email, body.password),
    onSuccess: (data) => {
      useAuthStore.getState().setSession(data.accessToken, data.refreshToken, data.user)
      const to = data.user.scope === 'HQ' ? '/hq/dashboard' : '/store/dashboard'
      void navigate({ to })
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Sign in failed'))
    },
  })

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.25),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.35),transparent)]" />
      <div className="border-border/60 bg-card/80 supports-[backdrop-filter]:bg-card/60 relative z-10 w-full max-w-[420px] rounded-2xl border p-px shadow-2xl backdrop-blur-xl">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-3 pb-2 text-center">
            <div className="bg-primary text-primary-foreground mx-auto flex size-14 items-center justify-center rounded-2xl shadow-lg">
              <Building2 className="size-7" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Cayro ERP</CardTitle>
            <CardDescription className="text-base">
              Sign in to manage stores, inventory, and orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                const email = String(fd.get('email') ?? '')
                const password = String(fd.get('password') ?? '')
                login.mutate({ email, password })
              }}
            >
              <div className="space-y-2">
                <Label htmlFor={emailId}>Email</Label>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@cayro.in"
                  required
                  className="h-11 bg-background/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={passwordId}>Password</Label>
                <Input
                  id={passwordId}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 bg-background/60"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full text-base shadow-md"
                disabled={login.isPending}
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground relative z-10 mt-8 max-w-md text-center text-xs">
        Authorized Cayro personnel only. Sessions use short-lived access tokens and a rotating
        refresh token.
      </p>
    </div>
  )
}

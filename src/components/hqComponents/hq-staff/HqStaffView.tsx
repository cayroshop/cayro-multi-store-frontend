/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  CalendarDays,
  Pencil,
  User,
  RefreshCw,
  Hash,
  LogIn,
  Layers,
  BadgeCheck,
  KeyRound,
  Shield,
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  getHqUserById,
  getHqUserAbilitiesById,
  resetHqUserPasswordById,
  type HqUser,
  type HqUserAbilities,
} from '@/api/hq/hqUsers'
import { StatusBadge } from '@/components/commonUI/commonStatusBadge'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ShortId({ id }: { id: string }) {
  return (
    <span className="font-mono text-xs text-muted-foreground" title={id}>
      {id.slice(0, 8)}…{id.slice(-4)}
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary select-none">
      {initials}
    </div>
  )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 gap-6">
      <div className="flex items-center gap-2.5 text-muted-foreground shrink-0">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground text-right ml-4 truncate max-w-[60%]">
        {value ?? <span className="text-muted-foreground font-normal">—</span>}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 pt-4 pb-1">
      {children}
    </p>
  )
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ViewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-24" />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1 px-6 pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Reset Password Dialog ────────────────────────────────────────────────────

function ResetPasswordDialog({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  userId: string
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ newPassword: string; confirm: string }>()

  const mutation = useMutation({
    mutationFn: (newPassword: string) => resetHqUserPasswordById(userId, { newPassword }),
    onSuccess: () => {
      toast.success('Password reset successfully')
      reset()
      onOpenChange(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to reset password')
    },
  })

  const onSubmit = (values: { newPassword: string; confirm: string }) => {
    if (values.newPassword !== values.confirm) {
      toast.error('Passwords do not match')
      return
    }
    mutation.mutate(values.newPassword)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for this HQ staff member. They will need to use it on next login.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Min. 6 characters"
              {...register('newPassword', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
              className={errors.newPassword ? 'border-destructive' : ''}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-sm font-medium">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Re-enter password"
              {...register('confirm', { required: 'Please confirm the password' })}
              className={errors.confirm ? 'border-destructive' : ''}
            />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}>
            {mutation.isPending ? 'Resetting…' : 'Reset Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Abilities Section ────────────────────────────────────────────────────────

function AbilitiesSection({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery<HqUserAbilities>({
    queryKey: ['hqUserAbilities', userId],
    queryFn: () => getHqUserAbilitiesById(userId),
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const grouped = data.effective.reduce(
    (acc, ab) => {
      if (!acc[ab.subject]) acc[ab.subject] = []
      acc[ab.subject].push(ab)
      return acc
    },
    {} as Record<string, typeof data.effective>,
  )

  const hasOverrides = data.overrides.allow.length > 0 || data.overrides.deny.length > 0

  return (
    <div className="space-y-6 pt-2">
      {/* Role Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-medium">{data.role?.name || 'No Role Assigned'}</p>
          <p className="text-xs text-muted-foreground">Scope: {data.scope}</p>
        </div>

        {data.role?.template && <StatusBadge value={data.role.template} />}
      </div>

      {/* Permissions */}
      {data.effective.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No permissions assigned</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([subject, abilities]) => (
            <div key={subject} className="rounded-xl border border-border overflow-hidden">
              {/* Subject Header */}
              <div className="px-4 py-2 bg-muted/40 border-b">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {subject}
                </p>
              </div>

              {/* Checkbox Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4">
                {abilities.map((ab, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 rounded-md border px-3 py-2 bg-background cursor-default"
                  >
                    <input
                      type="checkbox"
                      checked={!ab.inverted}
                      readOnly
                      className="h-4 w-4 accent-emerald-600"
                    />

                    <span className="text-sm capitalize">{ab.action}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overrides */}
      {hasOverrides && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Allow */}
          <div className="rounded-xl border border-emerald-200 overflow-hidden">
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Extra Allow ({data.overrides.allow.length})
              </p>
            </div>

            <div className="p-3 space-y-2">
              {data.overrides.allow.length === 0 ? (
                <p className="text-xs text-muted-foreground">None</p>
              ) : (
                data.overrides.allow.map((ab, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white"
                  >
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span className="text-xs">
                      {ab.action} - {ab.subject}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Deny */}
          <div className="rounded-xl border border-red-200 overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Denied ({data.overrides.deny.length})
              </p>
            </div>

            <div className="p-3 space-y-2">
              {data.overrides.deny.length === 0 ? (
                <p className="text-xs text-muted-foreground">None</p>
              ) : (
                data.overrides.deny.map((ab, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      readOnly
                      className="h-4 w-4 accent-red-600"
                    />
                    <span className="text-xs">
                      {ab.action} - {ab.subject}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HqStaffView({ id }: { id: string }) {
  const navigate = useNavigate()
  const [resetOpen, setResetOpen] = useState(false)

  const { data, isLoading, error } = useQuery<HqUser>({
    queryKey: ['hqUser', id],
    queryFn: () => getHqUserById(id),
    staleTime: 0,
    refetchOnMount: 'always',
  })

  if (isLoading) return <ViewSkeleton />

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/hq/users/staff' })}
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Staff
        </Button>
        <p className="text-sm text-destructive">Failed to load HQ staff member details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/hq/users/staff' })}
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Staff
      </Button>

      {/* ── Profile Card ── */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={data.name} />
              <div>
                <CardTitle className="text-lg">{data.name}</CardTitle>
                <CardDescription className="mt-0.5">{data.email}</CardDescription>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusBadge value={data.status} />
                  <Badge variant="outline" className="text-xs font-normal">
                    {data.scope}
                  </Badge>
                  {data.hqRole && <StatusBadge value={data.hqRole} />}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setResetOpen(true)}
              >
                <KeyRound className="h-3.5 w-3.5" />
                Reset Password
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => navigate({ to: '/hq/users/staff', search: { edit: id } })}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-0 pb-4">
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="mb-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details">
              <SectionLabel>Contact</SectionLabel>
              <InfoRow icon={Mail} label="Email" value={data.email} />
              <InfoRow icon={Phone} label="Phone" value={data.phone} />

              <SectionLabel>Account</SectionLabel>
              <InfoRow
                icon={BadgeCheck}
                label="Status"
                value={<StatusBadge value={data.status} />}
              />
              <InfoRow icon={Layers} label="Scope" value={data.scope} />
              <InfoRow
                icon={User}
                label="HQ Role"
                value={
                  data.hqRole ?? (
                    <span className="text-muted-foreground font-normal text-xs">Not assigned</span>
                  )
                }
              />

              <SectionLabel>Store</SectionLabel>
              <InfoRow
                icon={Store}
                label="Store ID"
                value={data.storeId ? <ShortId id={data.storeId} /> : null}
              />

              <SectionLabel>Role</SectionLabel>
              <InfoRow
                icon={ShieldCheck}
                label="Role ID"
                value={data.roleId ? <ShortId id={data.roleId} /> : null}
              />

              <SectionLabel>System Info</SectionLabel>
              <InfoRow icon={Hash} label="User ID" value={<ShortId id={data.id} />} />
              <InfoRow icon={CalendarDays} label="Joined" value={formatDate(data.createdAt)} />
              <InfoRow icon={RefreshCw} label="Last Updated" value="—" />
              <InfoRow icon={LogIn} label="Last Login" value="—" />
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <AbilitiesSection userId={id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Reset Password Dialog ── */}
      <ResetPasswordDialog open={resetOpen} onOpenChange={setResetOpen} userId={id} />
    </div>
  )
}

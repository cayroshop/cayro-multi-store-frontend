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
  CheckCircle2,
  XCircle,
  Shield,
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  getStoreUserById,
  getStoreUserAbilities,
  resetStoreUserPassword,
  type StoreUserDetails,
  type StoreUserAbilities,
} from '@/api/store/storeUser'
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
    mutationFn: (newPassword: string) => resetStoreUserPassword(userId, { newPassword }),
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
            Set a new password for this staff member. They will need to use it on next login.
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
  const { data, isLoading } = useQuery<StoreUserAbilities>({
    queryKey: ['storeUserAbilities', userId],
    queryFn: () => getStoreUserAbilities(userId),
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
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
      {/* Role info */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Role:</span>

        {data.role ? (
          <>
            <span className="font-semibold text-sm">{data.role.name}</span>

            {data.role.template && <StatusBadge value={data.role.template} />}

            <span className="text-xs text-muted-foreground ml-auto">
              {data.role.abilities?.length ?? 0} from role
              {hasOverrides &&
                ` · ${data.overrides.allow.length} allow override · ${data.overrides.deny.length} deny override`}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-muted-foreground">No role assigned</span>

            <span className="text-xs text-muted-foreground ml-auto">
              Direct permissions only
              {hasOverrides && ` · ${data.overrides.allow.length} allow override`}
            </span>
          </>
        )}
      </div>

      {/* Effective permissions grouped by subject */}
      {data.effective.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-lg">
          <Shield className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No permissions assigned</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([subject, abilities]) => (
            <div key={subject} className="rounded-lg border border-border/60 overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/40 border-b border-border/60 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {subject}
                </p>
                <span className="text-xs text-muted-foreground">
                  {abilities.length} action{abilities.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-border/40">
                {abilities.map((ability, idx) => {
                  const isDenied = ability.inverted === true
                  return (
                    <div key={idx} className="flex items-center justify-between px-4 py-3">
                      <StatusBadge value={ability.action} />
                      <div className="flex items-center gap-1.5">
                        {isDenied ? (
                          <>
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="text-xs font-medium text-destructive">Denied</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600">Allowed</span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overrides section */}
      {hasOverrides && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Custom Overrides
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-200 overflow-hidden">
                <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Extra Allow ({data.overrides.allow.length})
                  </p>
                </div>
                <div className="divide-y divide-border/30">
                  {data.overrides.allow.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-3 py-3">None</p>
                  ) : (
                    data.overrides.allow.map((ab, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2">
                        <StatusBadge value={ab.action} />
                        <span className="text-xs text-muted-foreground">{ab.subject}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-red-200 overflow-hidden">
                <div className="px-3 py-2 bg-red-50 border-b border-red-200">
                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Denied ({data.overrides.deny.length})
                  </p>
                </div>
                <div className="divide-y divide-border/30">
                  {data.overrides.deny.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-3 py-3">None</p>
                  ) : (
                    data.overrides.deny.map((ab, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2">
                        <StatusBadge value={ab.action} />
                        <span className="text-xs text-muted-foreground">{ab.subject}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoreStaffView({ id }: { id: string }) {
  const navigate = useNavigate()
  const [resetOpen, setResetOpen] = useState(false)

  const { data, isLoading, error } = useQuery<StoreUserDetails>({
    queryKey: ['storeUser', id],
    queryFn: () => getStoreUserById(id),
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
          onClick={() => navigate({ to: '/store/settings/staff' })}
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Staff
        </Button>
        <p className="text-sm text-destructive">Failed to load staff member details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/store/settings/staff' })}
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
                  {data.role?.template && <StatusBadge value={data.role.template} />}
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
                onClick={() => navigate({ to: '/store/settings/staff', search: { edit: id } })}
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
              {data.store ? (
                <>
                  <InfoRow icon={Store} label="Store Name" value={data.store.name} />
                  <InfoRow icon={Hash} label="Store Code" value={data.store.code} />
                  <InfoRow icon={Hash} label="Store ID" value={<ShortId id={data.store.id} />} />
                </>
              ) : (
                <InfoRow icon={Store} label="Store" value={null} />
              )}

              <SectionLabel>Role</SectionLabel>
              {data.role ? (
                <>
                  <InfoRow icon={ShieldCheck} label="Role Name" value={data.role.name} />
                  <InfoRow
                    icon={Layers}
                    label="Template"
                    value={data.role.template?.replace(/_/g, ' ')}
                  />
                  <InfoRow icon={Hash} label="Role ID" value={<ShortId id={data.role.id} />} />
                </>
              ) : (
                <InfoRow icon={ShieldCheck} label="Role" value={null} />
              )}

              <SectionLabel>System Info</SectionLabel>
              <InfoRow icon={Hash} label="User ID" value={<ShortId id={data.id} />} />
              <InfoRow icon={CalendarDays} label="Joined" value={formatDate(data.createdAt)} />
              <InfoRow icon={RefreshCw} label="Last Updated" value={formatDate(data.updatedAt)} />
              <InfoRow icon={LogIn} label="Last Login" value={formatDate(data.lastLoginAt)} />
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

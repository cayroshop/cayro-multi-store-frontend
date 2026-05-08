/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

import {
  getStoreUserById,
  updateStoreUser,
  createStoreUser,
  getStoreUserAbilities,
  updateStoreUserAbilities,
  type StoreUserDetails,
  type StoreUserAbilities,
  type AbilityItem,
} from '@/api/store/storeUser'

import { listStoreRoles, type StoreRole } from '@/api/store/storeRoles'

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValues = {
  name: string
  email: string
  phone: string
  password: string
  roleId: string
  status: string
}

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function EditSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-24" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Ability Helpers (pure — defined at module level) ────────────────────────

function addAbility(list: AbilityItem[], setList: (v: AbilityItem[]) => void) {
  setList([...list, { action: '', subject: '', inverted: false }])
}

function removeAbility(list: AbilityItem[], setList: (v: AbilityItem[]) => void, idx: number) {
  setList(list.filter((_, i) => i !== idx))
}

function updateAbility(
  list: AbilityItem[],
  setList: (v: AbilityItem[]) => void,
  idx: number,
  field: keyof AbilityItem,
  value: string | boolean,
) {
  const updated = [...list]
  updated[idx] = { ...updated[idx], [field]: value }
  setList(updated)
}

// ─── AbilityList (declared at module level — not inside render) ───────────────

interface AbilityListProps {
  list: AbilityItem[]
  setList: (v: AbilityItem[]) => void
  label: string
  color: 'green' | 'red'
}

function AbilityList({ list, setList, label, color }: AbilityListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            color === 'green' ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {label} ({list.length})
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5 h-7 text-xs"
          onClick={() => addAbility(list, setList)}
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-muted-foreground py-3 border border-dashed rounded-lg text-center">
          No overrides
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((ab, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                color === 'green'
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-red-200 bg-red-50/50'
              }`}
            >
              <Input
                placeholder="action (e.g. read)"
                value={ab.action}
                onChange={(e) => updateAbility(list, setList, idx, 'action', e.target.value)}
                className="h-7 text-xs"
              />
              <Input
                placeholder="subject (e.g. Order)"
                value={ab.subject}
                onChange={(e) => updateAbility(list, setList, idx, 'subject', e.target.value)}
                className="h-7 text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeAbility(list, setList, idx)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Abilities Editor ─────────────────────────────────────────────────────────

function AbilitiesEditor({ userId }: { userId: string }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<StoreUserAbilities>({
    queryKey: ['storeUserAbilities', userId],
    queryFn: () => getStoreUserAbilities(userId),
    staleTime: 0,
  })

  const [allowList, setAllowList] = useState<AbilityItem[]>([])
  const [denyList, setDenyList] = useState<AbilityItem[]>([])
  const seeded = useRef(false)

  useEffect(() => {
    if (data && !seeded.current) {
      seeded.current = true
      setAllowList(data.overrides.allow)
      setDenyList(data.overrides.deny)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: () => updateStoreUserAbilities(userId, { allow: allowList, deny: denyList }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeUserAbilities', userId] })
      toast.success('Permissions updated successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update permissions')
    },
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

  return (
    <div className="space-y-6 pt-2">
      {/* Current effective permissions summary */}
      {data && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Current Role: {data.role?.name ?? '—'}</p>
            <Badge variant="outline" className="text-xs">
              {data.effective.length} effective permissions
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Base permissions come from the assigned role. Use the overrides below to grant or revoke
            specific permissions for this staff member.
          </p>
        </div>
      )}

      {/* Allow overrides */}
      <AbilityList
        list={allowList}
        setList={setAllowList}
        label="Extra Allow Overrides"
        color="green"
      />

      {/* Deny overrides */}
      <AbilityList list={denyList} setList={setDenyList} label="Deny Overrides" color="red" />

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="min-w-36"
        >
          {mutation.isPending ? 'Saving...' : 'Save Permissions'}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoreStaffEdit({ id }: { id?: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const seededRef = useRef(false)

  // ── Fetch existing user (edit mode) ──
  const { data, isLoading } = useQuery<StoreUserDetails>({
    queryKey: ['storeUser', id],
    queryFn: () => getStoreUserById(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  // ── Fetch roles for the combobox ──
  const { data: roles = [] } = useQuery<StoreRole[]>({
    queryKey: ['storeRoles'],
    queryFn: listStoreRoles,
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      roleId: '',
      status: 'ACTIVE',
    },
  })

  const roleIdValue = useWatch({ control, name: 'roleId' }) ?? ''
  const statusValue = useWatch({ control, name: 'status' }) ?? ''

  // ── Seed form from fetched data (edit mode) ──
  useEffect(() => {
    if (data && id && !seededRef.current) {
      seededRef.current = true
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: '',
        roleId: data.roleId ?? '',
        status: data.status ?? 'ACTIVE',
      })
    }
  }, [data, id, reset])

  // ── Mutation ──
  const mutation = useMutation({
    mutationFn: (payload: any) => (id ? updateStoreUser(id, payload) : createStoreUser(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeUsers'] })
      if (id) queryClient.invalidateQueries({ queryKey: ['storeUser', id] })
      toast.success(id ? 'Staff member updated successfully' : 'Staff member added successfully')
      navigate({ to: '/store/settings/staff' })
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || 'Something went wrong'
      toast.error(msg)
    },
  })

  const onSubmit = (values: FormValues) => {
    if (id) {
      const payload: any = {
        name: values.name,
        phone: values.phone,
        status: values.status,
        roleId: values.roleId || undefined,
      }
      mutation.mutate(payload)
    } else {
      const payload: any = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        scope: 'STORE' as const,
        roleId: values.roleId || undefined,
      }
      mutation.mutate(payload)
    }
  }

  const selectedRole = roles.find((r) => r.id === roleIdValue)

  if (isLoading) return <EditSkeleton />

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

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          {id && <TabsTrigger value="permissions">Permissions</TabsTrigger>}
        </TabsList>

        {/* ── Details Tab ── */}
        <TabsContent value="details">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-base">
                {id ? 'Edit Staff Member' : 'Add New Staff Member'}
              </CardTitle>
              <CardDescription>
                {id
                  ? 'Update the staff member details and role below.'
                  : 'Fill in the details to add a new staff member to this store.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Rahul Sharma"
                  {...register('name', { required: 'Full name is required' })}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              {/* Email — only on create */}
              {!id && (
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                    })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              )}

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  {...register('phone', { required: 'Phone number is required' })}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              {/* Password — only on create */}
              {!id && (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Set a strong password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
              )}

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Role</Label>
                <Combobox
                  items={roles}
                  value={roleIdValue}
                  onValueChange={(value) => setValue('roleId', value ?? '')}
                >
                  <ComboboxInput placeholder="Select a role" />
                  <ComboboxContent>
                    <ComboboxEmpty>No roles found</ComboboxEmpty>
                    <ComboboxList>
                      {(item: StoreRole) => (
                        <ComboboxItem key={item.id} value={item.id}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {selectedRole && (
                  <p className="text-xs text-muted-foreground">
                    Template: {selectedRole.template?.replace(/_/g, ' ') ?? '—'} ·{' '}
                    {(selectedRole as any).abilities?.length ?? 0} permissions
                  </p>
                )}
              </div>

              {/* Status — only on edit */}
              {id && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <Combobox
                    items={STATUS_OPTIONS}
                    value={statusValue}
                    onValueChange={(value) => setValue('status', value ?? 'ACTIVE')}
                  >
                    <ComboboxInput placeholder="Select status" />
                    <ComboboxContent>
                      <ComboboxEmpty>No options</ComboboxEmpty>
                      <ComboboxList>
                        {(item: string) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Save / Cancel ── */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={mutation.isPending}
              className="min-w-30"
            >
              {mutation.isPending ? 'Saving...' : id ? 'Update Staff' : 'Add Staff'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/store/settings/staff' })}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </TabsContent>

        {/* ── Permissions Tab (edit only) ── */}
        {id && (
          <TabsContent value="permissions">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-base">Permission Overrides</CardTitle>
                <CardDescription>
                  Customize permissions for this staff member beyond their assigned role.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <AbilitiesEditor userId={id} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

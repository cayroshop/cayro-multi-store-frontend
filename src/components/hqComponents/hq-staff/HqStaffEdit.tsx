/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Store } from 'lucide-react'
import { toast } from 'sonner'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
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
  getHqUserById,
  updateHqUserById,
  createHqUser,
  type HqUser,
  type AbilityItem,
} from '@/api/hq/hqUsers'

import { AbilitiesEditor } from './AbilitiesEditor'
import {
  getHqRoles,
  hqRolesAbilityCatalog,
  type HqRole,
  type HqRoleAbilityCatalogItem,
} from '@/api/hq/hqRoles'

import { getAllHqStores, type HqStore } from '@/api/hq/hqStores'
import { StatusBadge } from '@/components/commonUI/commonStatusBadge'

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

// ─── AbilitiesSelector ────────────────────────────────────────────────────────
function AbilitiesSelector({
  catalog,
  selected,
  onChange,
}: {
  catalog: HqRoleAbilityCatalogItem[]
  selected: AbilityItem[]
  onChange: (abilities: AbilityItem[]) => void
}) {
  const isChecked = (subject: string, action: string) =>
    selected.some((a) => a.subject === subject && a.action === action)

  const toggle = (subject: string, action: string) => {
    if (isChecked(subject, action)) {
      onChange(selected.filter((a) => !(a.subject === subject && a.action === action)))
    } else {
      onChange([...selected, { subject, action }])
    }
  }

  const toggleSubject = (subject: string, actions: string[]) => {
    const allChecked = actions.every((a) => isChecked(subject, a))
    if (allChecked) {
      onChange(selected.filter((a) => a.subject !== subject))
    } else {
      const toAdd = actions
        .filter((a) => !isChecked(subject, a))
        .map((a) => ({ subject, action: a }))
      onChange([...selected, ...toAdd])
    }
  }

  // Group catalog items by module
  const grouped: Record<string, HqRoleAbilityCatalogItem[]> = {}
  catalog.forEach((item) => {
    if (!grouped[item.module]) grouped[item.module] = []
    grouped[item.module].push(item)
  })

  if (catalog.length === 0) {
    return (
      <div className="rounded-lg border border-border/60 px-4 py-6 text-center text-xs text-muted-foreground">
        No ability catalog available
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <div className="max-h-72 overflow-y-auto">
        {Object.entries(grouped).map(([module, items], gi) => (
          <div key={module} className={gi > 0 ? 'border-t border-border/40' : ''}>
            {/* Module header */}
            <div className="px-3 py-2 bg-muted/40 sticky top-0 z-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {module}
              </span>
            </div>

            {items.map((item) => {
              const actions = item.actions.map((a) => a.action)
              const allChecked =
                actions.length > 0 && actions.every((a) => isChecked(item.subject, a))
              const someChecked = actions.some((a) => isChecked(item.subject, a))

              return (
                <div
                  key={item.subject}
                  className="flex items-start gap-3 px-3 py-2.5 border-t border-border/20 hover:bg-muted/20 transition-colors"
                >
                  {/* Subject-level "select all" checkbox */}
                  <Checkbox
                    checked={allChecked}
                    data-state={someChecked && !allChecked ? 'indeterminate' : undefined}
                    onCheckedChange={() => toggleSubject(item.subject, actions)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-xs font-medium text-foreground w-28 shrink-0 pt-0.5">
                    {item.label}
                  </span>
                  {/* Per-action checkboxes */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {item.actions.map(({ action }) => {
                      return (
                        <label
                          key={action}
                          className="flex items-center gap-1.5 cursor-pointer select-none"
                        >
                          <Checkbox
                            checked={isChecked(item.subject, action)}
                            onCheckedChange={() => toggle(item.subject, action)}
                            className="h-3.5 w-3.5"
                          />

                          {/* NEW Badge from ACTION_MAP */}
                          <StatusBadge value={action} />
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="px-3 py-1.5 bg-muted/30 border-t text-xs text-muted-foreground">
          {selected.length} permission{selected.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HqStaffEdit({ id }: { id?: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const seededRef = useRef(false)

  // Create-mode state
  const [selectedStoreId, setSelectedStoreId] = useState<string>('')
  const [selectedAbilities, setSelectedAbilities] = useState<AbilityItem[]>([])

  const { data, isLoading } = useQuery<HqUser>({
    queryKey: ['hqUser', id],
    queryFn: () => getHqUserById(id!),
    enabled: !!id,
    staleTime: 0,
  })

  const { data: roles = [] } = useQuery<HqRole[]>({
    queryKey: ['storeRoles'],
    queryFn: getHqRoles,
  })

  // Only fetch stores + catalog when creating a new user
  const { data: stores = [], isLoading: storesLoading } = useQuery<HqStore[]>({
    queryKey: ['hqStores'],
    queryFn: getAllHqStores,
    enabled: !id,
    staleTime: 5 * 60 * 1000,
  })

  const { data: abilityCatalog = [], isLoading: catalogLoading } = useQuery<
    HqRoleAbilityCatalogItem[]
  >({
    queryKey: ['hqAbilityCatalog'],
    queryFn: hqRolesAbilityCatalog,
    enabled: !id,
    staleTime: 5 * 60 * 1000,
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

  const selectedRole = roles.find((r) => r.id === roleIdValue)

  useEffect(() => {
    if (data && id && !seededRef.current) {
      seededRef.current = true
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone ?? '',
        password: '',
        roleId: data.roleId ?? '',
        status: data.status ?? 'ACTIVE',
      })
    }
  }, [data, id, reset])

  const mutation = useMutation({
    mutationFn: (payload: any) => (id ? updateHqUserById(id, payload) : createHqUser(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hqUsers'] })
      if (id) queryClient.invalidateQueries({ queryKey: ['hqUser', id] })
      toast.success(id ? 'HQ staff updated successfully' : 'HQ staff created successfully')
      navigate({ to: '/hq/users/staff' })
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Something went wrong'),
  })

  const onSubmit = (values: FormValues) => {
    if (id) {
      mutation.mutate({
        name: values.name,
        phone: values.phone,
        status: values.status,
        roleId: values.roleId || undefined,
      })
    } else {
      mutation.mutate({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        scope: 'STORE' as const,
        roleId: values.roleId || undefined,
        storeId: selectedStoreId || undefined,
        abilities: selectedAbilities.length > 0 ? selectedAbilities : undefined,
      })
    }
  }

  if (isLoading) return <EditSkeleton />

  return (
    <div className="space-y-6 pb-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/hq/users/staff' })}
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

        <TabsContent value="details">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-base">
                {id ? 'Edit HQ Staff Member' : 'Add New HQ Staff Member'}
              </CardTitle>
              <CardDescription>
                {id
                  ? 'Update the HQ staff member details and role below.'
                  : 'Fill in the details to add a new HQ staff member.'}
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
                      {(item: HqRole) => (
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

              {/* ─── Create-only: Store Access ──────────────────────────────── */}
              {!id && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-muted-foreground" />
                      Store Access
                    </span>
                  </Label>
                  {storesLoading ? (
                    <Skeleton className="h-9 w-full rounded-lg" />
                  ) : (
                    <Combobox
                      items={stores}
                      value={selectedStoreId}
                      onValueChange={(value) => setSelectedStoreId(value ?? '')}
                    >
                      <ComboboxInput placeholder="Select a store" />
                      <ComboboxContent>
                        <ComboboxEmpty>No stores found</ComboboxEmpty>
                        <ComboboxList>
                          {(item: HqStore) => (
                            <ComboboxItem key={item.id} value={item.id}>
                              {item.name}
                              <span className="ml-1.5 text-xs text-muted-foreground font-mono">
                                {item.code}
                              </span>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  )}
                </div>
              )}

              {/* ─── Create-only: Initial Permissions ──────────────────────── */}
              {!id && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Initial Permissions</Label>
                    {selectedAbilities.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 h-4 ml-auto">
                        {selectedAbilities.length} selected
                      </Badge>
                    )}
                  </div>
                  {catalogLoading ? (
                    <Skeleton className="h-40 w-full rounded-lg" />
                  ) : (
                    <AbilitiesSelector
                      catalog={abilityCatalog}
                      selected={selectedAbilities}
                      onChange={setSelectedAbilities}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Optionally grant initial permissions beyond the assigned role.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
              onClick={() => navigate({ to: '/hq/users/staff' })}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </TabsContent>

        {id && (
          <TabsContent value="permissions">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-base">Permission Overrides</CardTitle>
                <CardDescription>
                  Customize permissions for this HQ staff member beyond their assigned role.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 px-6">
                <AbilitiesEditor userId={id} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

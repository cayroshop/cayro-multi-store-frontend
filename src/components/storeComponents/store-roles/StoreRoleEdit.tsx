/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

import {
  getStoreRoleById,
  updateStoreRole,
  createStoreRole,
  type StoreRoleDetails,
} from '@/api/store/storeRoles'

import { ACTION_ORDER, PERMISSION_SCHEMA, TEMPLATES } from '@/api/commonTypes'

// ─── Derived constants from schema ───────────────────────────────────────────

const SUBJECTS = Object.keys(PERMISSION_SCHEMA) as string[]

// All unique actions across all subjects, in a logical display order

const ALL_ACTIONS = ACTION_ORDER.filter((a) =>
  Object.values(PERMISSION_SCHEMA).some((actions) => actions.includes(a)),
)

// ─── Action colour map ────────────────────────────────────────────────────────

const ACTION_META: Record<string, { label: string; headerColor: string; checkboxColor: string }> = {
  read: {
    label: 'Read',
    headerColor: 'text-blue-600',
    checkboxColor: 'data-[state=checked]:bg-blue-500    data-[state=checked]:border-blue-500',
  },
  create: {
    label: 'Create',
    headerColor: 'text-emerald-600',
    checkboxColor: 'data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500',
  },
  update: {
    label: 'Update',
    headerColor: 'text-amber-600',
    checkboxColor: 'data-[state=checked]:bg-amber-500   data-[state=checked]:border-amber-500',
  },
  delete: {
    label: 'Delete',
    headerColor: 'text-red-600',
    checkboxColor: 'data-[state=checked]:bg-red-500     data-[state=checked]:border-red-500',
  },
  assign: {
    label: 'Assign',
    headerColor: 'text-violet-600',
    checkboxColor: 'data-[state=checked]:bg-violet-500  data-[state=checked]:border-violet-500',
  },
  sync: {
    label: 'Sync',
    headerColor: 'text-sky-600',
    checkboxColor: 'data-[state=checked]:bg-sky-500     data-[state=checked]:border-sky-500',
  },
  cancel: {
    label: 'Cancel',
    headerColor: 'text-orange-600',
    checkboxColor: 'data-[state=checked]:bg-orange-500  data-[state=checked]:border-orange-500',
  },
  deliver: {
    label: 'Deliver',
    headerColor: 'text-teal-600',
    checkboxColor: 'data-[state=checked]:bg-teal-500    data-[state=checked]:border-teal-500',
  },
  ship: {
    label: 'Ship',
    headerColor: 'text-cyan-600',
    checkboxColor: 'data-[state=checked]:bg-cyan-500    data-[state=checked]:border-cyan-500',
  },
  dispatch: {
    label: 'Dispatch',
    headerColor: 'text-indigo-600',
    checkboxColor: 'data-[state=checked]:bg-indigo-500  data-[state=checked]:border-indigo-500',
  },
  receive: {
    label: 'Receive',
    headerColor: 'text-lime-600',
    checkboxColor: 'data-[state=checked]:bg-lime-500    data-[state=checked]:border-lime-500',
  },
  approve: {
    label: 'Approve',
    headerColor: 'text-green-600',
    checkboxColor: 'data-[state=checked]:bg-green-500   data-[state=checked]:border-green-500',
  },
  move: {
    label: 'Move',
    headerColor: 'text-fuchsia-600',
    checkboxColor: 'data-[state=checked]:bg-fuchsia-500 data-[state=checked]:border-fuchsia-500',
  },
  adjust: {
    label: 'Adjust',
    headerColor: 'text-rose-600',
    checkboxColor: 'data-[state=checked]:bg-rose-500    data-[state=checked]:border-rose-500',
  },
  void: {
    label: 'Void',
    headerColor: 'text-pink-600',
    checkboxColor: 'data-[state=checked]:bg-pink-500    data-[state=checked]:border-pink-500',
  },
  refund: {
    label: 'Refund',
    headerColor: 'text-yellow-600',
    checkboxColor: 'data-[state=checked]:bg-yellow-500  data-[state=checked]:border-yellow-500',
  },
  export: {
    label: 'Export',
    headerColor: 'text-slate-600',
    checkboxColor: 'data-[state=checked]:bg-slate-500   data-[state=checked]:border-slate-500',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** subject → set of enabled actions */
type PermMatrix = Record<string, Set<string>>

type FormValues = {
  name: string
  template: string
  description: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function abilitiesToMatrix(abilities: { action: string; subject: string }[]): PermMatrix {
  const matrix: PermMatrix = {}
  for (const { action, subject } of abilities) {
    if (!matrix[subject]) matrix[subject] = new Set()
    matrix[subject].add(action)
  }
  return matrix
}

function matrixToAbilities(matrix: PermMatrix): { action: string; subject: string }[] {
  const result: { action: string; subject: string }[] = []
  for (const [subject, actions] of Object.entries(matrix)) {
    for (const action of actions) {
      result.push({ action, subject })
    }
  }
  return result
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function EditSkeleton() {
  return (
    <div className="space-y-6 ">
      <Skeleton className="h-9 w-24" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoreRoleEdit({ id }: { id?: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<StoreRoleDetails>({
    queryKey: ['storeRole', id],
    queryFn: () => getStoreRoleById(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', template: '', description: '' },
  })

  const templateValue = useWatch({ control, name: 'template' }) ?? ''

  // ── Matrix state ──
  // Initialised lazily from `data` when it first arrives.
  // We use a "seeded" ref to avoid calling setMatrix inside an effect body,
  // which would trigger a cascading render cycle.
  const seededRef = useRef(false)

  const [matrix, setMatrix] = useState<PermMatrix>(() => {
    // On first render for edit mode, data won't be available yet — empty matrix.
    // We'll seed it once data arrives via the effect below using the ref guard.
    return {}
  })

  // Sync form fields AND matrix once after data loads (edit mode only).
  // We call reset() (from RHF) which is safe inside an effect.
  // For matrix we gate on the seededRef so setMatrix is only ever called
  // once per data load, not on every render of the effect.
  useEffect(() => {
    if (data && id && !seededRef.current) {
      seededRef.current = true

      // Reset RHF fields — safe: reset() doesn't setState synchronously in the
      // way the linter is warning about.
      reset({
        name: data.name,
        template: data.template ?? '',
        description: data.description ?? '',
      })

      // Seed the matrix exactly once.
      // This setState call is intentional — it runs once after the async query
      // resolves, not on every render, so it does NOT cause cascading renders.
      // The lint warning fires because it sees setMatrix inside useEffect, but
      // the seededRef guard prevents more than one call per load.
      setMatrix(abilitiesToMatrix(data.abilities))
    }
  }, [data, id, reset])

  // ── Toggle one cell ──
  const toggleCell = useCallback((subject: string, action: string) => {
    setMatrix((prev) => {
      const next: PermMatrix = {}
      for (const [s, acts] of Object.entries(prev)) next[s] = new Set(acts)
      if (!next[subject]) next[subject] = new Set()
      if (next[subject].has(action)) {
        next[subject].delete(action)
        if (next[subject].size === 0) delete next[subject]
      } else {
        next[subject].add(action)
      }
      return next
    })
  }, [])

  // ── Toggle all valid actions for a subject row ──
  const toggleRow = useCallback((subject: string) => {
    const validActions = PERMISSION_SCHEMA[subject] ?? []
    setMatrix((prev) => {
      const next: PermMatrix = {}
      for (const [s, acts] of Object.entries(prev)) next[s] = new Set(acts)
      const allChecked = validActions.every((a) => next[subject]?.has(a))
      if (allChecked) {
        delete next[subject]
      } else {
        next[subject] = new Set(validActions)
      }
      return next
    })
  }, [])

  // ── Mutation ──
  const mutation = useMutation({
    mutationFn: (payload: any) => (id ? updateStoreRole(id, payload) : createStoreRole(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeRoles'] })
      if (id) queryClient.invalidateQueries({ queryKey: ['storeRole', id] })
      toast.success(id ? 'Role updated successfully' : 'Role created successfully')
      navigate({ to: '/store/settings/roles' })
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || 'Something went wrong'
      toast.error(msg)
    },
  })

  const onSubmit = (values: FormValues) => {
    const payload: any = {
      name: values.name,
      description: values.description,
      abilities: matrixToAbilities(matrix),
    }

    // सिर्फ तभी भेजो जब template select किया हो
    if (values.template) {
      payload.template = values.template
    }

    mutation.mutate(payload)
  }

  const totalPermissions = Object.values(matrix).reduce((sum, set) => sum + set.size, 0)
  const activeSubjects = Object.keys(matrix).length

  if (isLoading) return <EditSkeleton />

  return (
    <div className="space-y-6 pb-10">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/store/settings/roles' })}
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roles
      </Button>

      {/* ── Basic Info ── */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-base">{id ? 'Edit Role' : 'Create New Role'}</CardTitle>
          <CardDescription>
            {id
              ? 'Update the role details and permissions below.'
              : 'Fill in the details to create a new store role.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">
              Role Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Store Manager – North"
              {...register('name', { required: 'Role name is required' })}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Template</Label>
            <Combobox
              items={TEMPLATES}
              value={templateValue}
              onValueChange={(value) => setValue('template', value ?? '')}
            >
              <ComboboxInput placeholder="Select a template" />
              <ComboboxContent>
                <ComboboxEmpty>No template found</ComboboxEmpty>
                <ComboboxList>
                  {(item: (typeof TEMPLATES)[number]) => (
                    <ComboboxItem key={item} value={item}>
                      {item.replace(/_/g, ' ')}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Brief description of this role's purpose"
              {...register('description')}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Permission Matrix ── */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 shrink-0" />
              <div>
                <CardTitle className="text-base leading-none">Permissions</CardTitle>
                <CardDescription className="mt-1">
                  Each subject shows only its valid actions
                </CardDescription>
              </div>
            </div>
            {totalPermissions > 0 && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/50 shrink-0">
                {totalPermissions} selected
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-20 bg-background">
                <tr className="border-b border-border/60 bg-background">
                  <th className="sticky left-0 z-30 bg-background text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-40 w-40 border-r border-border/30">
                    Subject
                  </th>

                  {ALL_ACTIONS.map((action) => {
                    const meta = ACTION_META[action] ?? {
                      label: action,
                      headerColor: 'text-muted-foreground',
                      checkboxColor: '',
                    }

                    return (
                      <th
                        key={action}
                        className="px-3 py-3 text-center min-w-20 w-20 bg-background"
                      >
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${meta.headerColor}`}
                        >
                          {meta.label}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody>
                {SUBJECTS.map((subject, idx) => {
                  const validActions = PERMISSION_SCHEMA[subject] ?? []
                  const subjectActions = matrix[subject] ?? new Set<string>()
                  const allChecked =
                    validActions.length > 0 && validActions.every((a) => subjectActions.has(a))
                  const someChecked = validActions.some((a) => subjectActions.has(a))
                  const hasAny = someChecked

                  return (
                    <tr
                      key={subject}
                      className={[
                        'border-b border-border/30 transition-colors',
                        idx % 2 === 1 ? 'bg-muted/3' : '',
                        hasAny ? 'bg-muted/10!' : '',
                        'hover:bg-muted/15',
                      ].join(' ')}
                    >
                      <td className="sticky left-0 z-10 bg-background px-5 py-3 border-r border-border/30">
                        {' '}
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={allChecked}
                            data-indeterminate={!allChecked && someChecked ? true : undefined}
                            onCheckedChange={() => toggleRow(subject)}
                            className="h-4 w-4 shrink-0"
                          />
                          <span
                            className={`font-medium text-sm select-none cursor-pointer whitespace-nowrap ${
                              hasAny ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                            onClick={() => toggleRow(subject)}
                          >
                            {subject}
                          </span>
                        </div>
                      </td>

                      {ALL_ACTIONS.map((action) => {
                        const isValid = (validActions as readonly string[]).includes(action)
                        const checked = isValid && subjectActions.has(action)
                        const meta = ACTION_META[action] ?? { checkboxColor: '' }

                        return (
                          <td key={action} className="px-3 py-3 text-center">
                            {isValid ? (
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleCell(subject, action)}
                                className={`h-4 w-4 ${checked ? meta.checkboxColor : ''}`}
                              />
                            ) : (
                              <span className="inline-block h-px w-4 bg-border/40 mx-auto translate-y-2" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border/40 bg-muted/10 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {totalPermissions > 0
                ? `${totalPermissions} permission${totalPermissions !== 1 ? 's' : ''} across ${activeSubjects} subject${activeSubjects !== 1 ? 's' : ''}`
                : 'No permissions selected yet'}
            </p>
            {totalPermissions > 0 && (
              <button
                type="button"
                onClick={() => setMatrix({})}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2 shrink-0"
              >
                Clear all
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Save / Cancel ── */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSubmit(onSubmit)} disabled={mutation.isPending} className="min-w-30">
          {mutation.isPending ? 'Saving...' : id ? 'Update Role' : 'Create Role'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/store/settings/roles' })}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

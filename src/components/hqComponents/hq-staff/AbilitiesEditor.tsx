/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  getHqUserAbilitiesById,
  updateHqUserAbilitiesById,
  type HqUserAbilities,
  type AbilityItem,
} from '@/api/hq/hqUsers'

import { PERMISSION_SCHEMA, SUBJECTS, ACTION_STYLE_MAP } from './abilities.constants.ts'

// ─── Types ────────────────────────────────────────────────────────────────────

type OverrideEntry = { id: number; subject: string; action: string }

let _idCounter = 0
const nextId = () => ++_idCounter

// ─── ActionBadge ──────────────────────────────────────────────────────────────

function ActionBadge({ action, onClick }: { action: string; onClick?: () => void }) {
  const s = ACTION_STYLE_MAP[action] ?? {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  }
  return (
    <span
      onClick={onClick}
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border capitalize',
        s.bg,
        s.text,
        s.border,
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
      ].join(' ')}
    >
      {action}
    </span>
  )
}

// ─── OverrideRow ──────────────────────────────────────────────────────────────

function OverrideRow({
  entry,
  onRemove,
  onChange,
}: {
  entry: OverrideEntry
  onRemove: () => void
  onChange: (field: 'subject' | 'action', value: string) => void
}) {
  const availableActions = PERMISSION_SCHEMA[entry.subject] ?? Object.keys(ACTION_STYLE_MAP)

  const handleSubjectChange = (value: string | null) => {
    if (!value) return
    onChange('subject', value)
    const actions = PERMISSION_SCHEMA[value] ?? []
    if (!actions.includes(entry.action)) {
      onChange('action', actions[0] ?? '')
    }
  }

  const handleActionChange = (value: string | null) => {
    if (!value) return
    onChange('action', value)
  }

  return (
    <div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2">
      <Select value={entry.subject} onValueChange={handleSubjectChange}>
        <SelectTrigger className="h-7 text-xs w-36 border-border/60">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          {SUBJECTS.map((s) => (
            <SelectItem key={s} value={s} className="text-xs">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />

      <Select value={entry.action} onValueChange={handleActionChange}>
        <SelectTrigger className="h-7 text-xs w-32 border-border/60">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          {availableActions.map((a) => (
            <SelectItem key={a} value={a} className="text-xs">
              <ActionBadge action={a} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto">
        <ActionBadge action={entry.action} />
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

// ─── OverridePanel ────────────────────────────────────────────────────────────

function OverridePanel({
  type,
  list,
  onAdd,
  onRemove,
  onChange,
}: {
  type: 'allow' | 'deny'
  list: OverrideEntry[]
  onAdd: () => void
  onRemove: (id: number) => void
  onChange: (id: number, field: 'subject' | 'action', value: string) => void
}) {
  const isAllow = type === 'allow'

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isAllow ? 'border-emerald-200' : 'border-red-200'
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${
          isAllow ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {isAllow ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${isAllow ? 'text-emerald-700' : 'text-red-700'}`}>
            {isAllow ? 'Extra allow overrides' : 'Deny overrides'}
          </span>
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 h-4 ${
              isAllow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {list.length}
          </Badge>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* min-h-15 = min-h-[60px] canonical class */}
      <div className="p-3 space-y-2 min-h-15">
        {list.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-5">
            {isAllow ? 'No extra allow overrides added' : 'No permissions denied yet'}
          </p>
        ) : (
          list.map((entry) => (
            <OverrideRow
              key={entry.id}
              entry={entry}
              onRemove={() => onRemove(entry.id)}
              onChange={(field, value) => onChange(entry.id, field, value)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── BasePermissionsMatrix ────────────────────────────────────────────────────

function BasePermissionsMatrix({
  abilities,
  onQuickAllow,
  onQuickDeny,
}: {
  abilities: AbilityItem[]
  onQuickAllow: (subject: string, action: string) => void
  onQuickDeny: (subject: string, action: string) => void
}) {
  const grouped: Record<string, string[]> = {}
  abilities.forEach(({ subject, action }) => {
    if (!grouped[subject]) grouped[subject] = []
    grouped[subject].push(action)
  })

  const entries: [string, string[]][] =
    Object.keys(grouped).length > 0
      ? Object.entries(grouped)
      : Object.entries(PERMISSION_SCHEMA).map(([s, a]) => [s, [...a]])

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* max-h-105 = max-h-[420px] canonical class */}
      <div className="max-h-105 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-36 border-b">
                Subject
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground border-b">
                Actions
              </th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground border-b w-36">
                Override
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([subject, actions]) => (
              <tr
                key={subject}
                className="border-b last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <span className="font-medium text-foreground">{subject}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {actions.map((action) => (
                      <ActionBadge key={action} action={action} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <button
                      onClick={() => onQuickAllow(subject, actions[0] ?? 'read')}
                      className="text-[10px] px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      + Allow
                    </button>
                    <button
                      onClick={() => onQuickDeny(subject, actions[0] ?? 'read')}
                      className="text-[10px] px-2 py-0.5 rounded border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      + Deny
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground px-4 py-2 border-t bg-muted/20">
        Click "+ Allow" or "+ Deny" to quickly add an override for that subject
      </p>
    </div>
  )
}

// ─── AbilitiesEditor ──────────────────────────────────────────────────────────

export function AbilitiesEditor({ userId }: { userId: string }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<HqUserAbilities>({
    queryKey: ['hqUserAbilities', userId],
    queryFn: () => getHqUserAbilitiesById(userId),
  })

  const [allowList, setAllowList] = useState<OverrideEntry[]>([])
  const [denyList, setDenyList] = useState<OverrideEntry[]>([])
  const seeded = useRef(false)

  useEffect(() => {
    if (data && !seeded.current) {
      seeded.current = true
      setAllowList(
        (data.overrides.allow ?? []).map((a) => ({
          id: nextId(),
          subject: a.subject,
          action: a.action,
        })),
      )
      setDenyList(
        (data.overrides.deny ?? []).map((a) => ({
          id: nextId(),
          subject: a.subject,
          action: a.action,
        })),
      )
    }
  }, [data])

  const addEntry = (
    setList: React.Dispatch<React.SetStateAction<OverrideEntry[]>>,
    subject?: string,
    action?: string,
  ) => {
    const defaultSubject = subject ?? SUBJECTS[0] ?? 'Orders'
    const defaultAction = action ?? PERMISSION_SCHEMA[defaultSubject]?.[0] ?? 'read'
    setList((prev) => [...prev, { id: nextId(), subject: defaultSubject, action: defaultAction }])
  }

  const removeEntry = (
    setList: React.Dispatch<React.SetStateAction<OverrideEntry[]>>,
    id: number,
  ) => setList((prev) => prev.filter((e) => e.id !== id))

  const updateEntry = (
    setList: React.Dispatch<React.SetStateAction<OverrideEntry[]>>,
    id: number,
    field: 'subject' | 'action',
    value: string,
  ) => setList((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  const mutation = useMutation({
    mutationFn: () => {
      const clean = (list: OverrideEntry[]) =>
        list
          .filter((e) => e.subject.trim() && e.action.trim())
          .map((e) => ({ subject: e.subject.trim(), action: e.action.trim() }))

      return updateHqUserAbilitiesById(userId, {
        allow: clean(allowList),
        deny: clean(denyList),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hqUserAbilities', userId] })
      toast.success('Permissions updated successfully')
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Failed to update permissions'),
  })

  if (isLoading)
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">Loading permissions...</div>
    )

  if (!data) return null

  return (
    <div className="space-y-5">
      {/* Role info bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border rounded-xl">
        <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Current role:</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
            {data.role?.name ?? '—'}
          </span>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {data.role?.abilities?.length ?? 0} base permissions
        </span>
      </div>

      <Tabs defaultValue="overrides">
        <TabsList className="h-8">
          <TabsTrigger value="overrides" className="text-xs">
            Overrides
          </TabsTrigger>
          <TabsTrigger value="base" className="text-xs">
            Base permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overrides" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OverridePanel
              type="allow"
              list={allowList}
              onAdd={() => addEntry(setAllowList)}
              onRemove={(id) => removeEntry(setAllowList, id)}
              onChange={(id, field, value) => updateEntry(setAllowList, id, field, value)}
            />
            <OverridePanel
              type="deny"
              list={denyList}
              onAdd={() => addEntry(setDenyList)}
              onRemove={(id) => removeEntry(setDenyList, id)}
              onChange={(id, field, value) => updateEntry(setDenyList, id, field, value)}
            />
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            size="sm"
            className="mt-2"
          >
            {mutation.isPending ? 'Saving...' : 'Save permission changes'}
          </Button>
        </TabsContent>

        <TabsContent value="base" className="mt-4">
          <BasePermissionsMatrix
            abilities={data.role?.abilities ?? []}
            onQuickAllow={(subject, action) => {
              addEntry(setAllowList, subject, action)
              toast.success(`Added to allow: ${action} → ${subject}`)
            }}
            onQuickDeny={(subject, action) => {
              addEntry(setDenyList, subject, action)
              toast.success(`Added to deny: ${action} → ${subject}`)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

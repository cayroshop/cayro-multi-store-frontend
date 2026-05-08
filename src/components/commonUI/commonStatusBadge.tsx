type VariantMap = Record<
  string,
  {
    label: string
    className: string
  }
>

const STATUS_MAP: VariantMap = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  blocked: { label: 'Blocked', className: 'bg-red-100 text-red-700' },
}

const TEMPLATE_MAP: VariantMap = {
  STORE_MANAGER: {
    label: 'Store Manager',
    className: 'bg-violet-100 text-violet-700 border border-violet-200',
  },
  ORDER_EXECUTIVE: {
    label: 'Order Executive',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  PURCHASE_EXECUTIVE: {
    label: 'Purchase Executive',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  INVENTORY_EXECUTIVE: {
    label: 'Inventory Executive',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  CASHIER: {
    label: 'Cashier',
    className: 'bg-pink-100 text-pink-700 border border-pink-200',
  },
  VIEWER_AUDITOR: {
    label: 'Viewer Auditor',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
}

const ACTION_MAP: VariantMap = {
  create: {
    label: 'Create',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  read: { label: 'Read', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  update: { label: 'Update', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  delete: { label: 'Delete', className: 'bg-red-100 text-red-700 border border-red-200' },
  assign: { label: 'Assign', className: 'bg-violet-100 text-violet-700 border border-violet-200' },
  sync: { label: 'Sync', className: 'bg-sky-100 text-sky-700 border border-sky-200' },
  cancel: { label: 'Cancel', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  deliver: { label: 'Deliver', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  ship: { label: 'Ship', className: 'bg-cyan-100 text-cyan-700 border border-cyan-200' },
  dispatch: {
    label: 'Dispatch',
    className: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  },
  receive: { label: 'Receive', className: 'bg-lime-100 text-lime-700 border border-lime-200' },
  move: { label: 'Move', className: 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200' },
  adjust: { label: 'Adjust', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  approve: { label: 'Approve', className: 'bg-green-100 text-green-700 border border-green-200' },
  void: { label: 'Void', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  refund: { label: 'Refund', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  export: { label: 'Export', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
}

function getItem(value: string) {
  return STATUS_MAP[value] || TEMPLATE_MAP[value] || ACTION_MAP[value]
}

export function StatusBadge({ value }: { value: string }) {
  const item = getItem(value)

  if (!item) {
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border">
        {value}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  )
}

export type StatusItem = {
  value: string
  label: string
  className: string
}

export const STATUS_LIST: StatusItem[] = [
  {
    value: 'active',
    label: 'Active',
    className: 'bg-green-100 text-green-700',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-600',
  },
  {
    value: 'pending',
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
  },
  {
    value: 'blocked',
    label: 'Blocked',
    className: 'bg-red-100 text-red-700',
  },
  {
    value: 'physical',
    label: 'Physical',
    className: 'bg-indigo-100 text-indigo-700',
  },
  {
    value: 'online',
    label: 'Online',
    className: 'bg-green-100 text-green-700',
  },
  {
    value: 'STORE_MANAGER',
    label: 'Store Manager',
    className: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  {
    value: 'ORDER_EXECUTIVE',
    label: 'Order Executive',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'PURCHASE_EXECUTIVE',
    label: 'Purchase Executive',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    value: 'INVENTORY_EXECUTIVE',
    label: 'Inventory Executive',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    value: 'CASHIER',
    label: 'Cashier',
    className: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  {
    value: 'VIEWER_AUDITOR',
    label: 'Viewer Auditor',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
]

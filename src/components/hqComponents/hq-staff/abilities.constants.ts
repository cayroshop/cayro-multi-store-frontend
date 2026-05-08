export const PERMISSION_SCHEMA: Record<string, readonly string[]> = {
  Orders: ['read', 'update', 'sync', 'cancel', 'deliver'],
  Shipments: ['read', 'ship', 'dispatch', 'cancel'],
  Purchase: ['read', 'create', 'update', 'receive', 'cancel'],
  Suppliers: ['read', 'create', 'update'],
  Inventory: ['read', 'move', 'adjust', 'sync', 'approve'],
  Sales: ['read', 'create', 'void', 'refund'],
  Returns: ['read', 'create', 'approve', 'refund'],
  StockTransfers: ['read', 'create', 'dispatch', 'receive'],
  Customers: ['read'],
  Reports: ['read', 'export'],
  Settings: ['read'],
  Users: ['read', 'create', 'update', 'delete'],
  Roles: ['read', 'create', 'update', 'delete', 'assign'],
  AuditLogs: ['read'],
  Invoices: ['read'],
  Catalog: ['read', 'create'],
}

export const SUBJECTS = Object.keys(PERMISSION_SCHEMA)

export type ActionStyle = { bg: string; text: string; border: string }

export const ACTION_STYLE_MAP: Record<string, ActionStyle> = {
  create: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  read: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  update: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  delete: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  assign: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  sync: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
  cancel: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  deliver: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  ship: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  dispatch: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  receive: { bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-200' },
  approve: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  move: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
  adjust: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  void: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  refund: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  export: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
}

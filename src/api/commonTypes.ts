export const SUBJECTS = [
  'Orders',
  'Stores',
  'Shipments',
  'Purchase',
  'Suppliers',
  'Inventory',
  'Sales',
  'Returns',
  'StockTransfers',
  'Customers',
  'Reports',
  'Settings',
  'Users',
  'Roles',
  'AuditLogs',
  'Invoices',
  'Catalog',
] as const

export const TEMPLATES = [
  'STORE_MANAGER',
  'ORDER_EXECUTIVE',
  'PURCHASE_EXECUTIVE',
  'INVENTORY_EXECUTIVE',
  'CASHIER',
  'VIEWER_AUDITOR',
] as const

export const ACTIONS = ['create', 'read', 'update', 'delete', 'manage'] as const

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
} as const

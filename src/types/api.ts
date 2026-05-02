/** Backend error envelope (`GlobalExceptionFilter`). */
export type ApiErrorBody = {
  code: string
  message: string
  details?: unknown
  correlationId?: string
}

export type UserProfile = {
  id: string
  name: string
  email: string
  phone: string | null
  scope: 'HQ' | 'STORE'
  hqRole: 'SUPER_ADMIN' | 'ERP_ADMIN' | null
  status: string
  store: { id: string; code: string; name: string } | null
  role: { id: string; name: string; template: string } | null
  assignedStores: { id: string; code: string; name: string }[]
}

export type MenuItem = {
  key: string
  label: string
  icon: string
  path: string
  children?: MenuItem[]
}

export type MenuPayload = {
  user: UserProfile
  menu: MenuItem[]
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: UserProfile
}

export type UserListItem = {
  id: string
  name: string
  email: string
  phone: string | null
  scope: string
  hqRole: string | null
  status: string
  storeId: string | null
  roleId: string | null
  createdAt: string
}

export type UserListResponse = {
  items: UserListItem[]
  nextCursor?: string
}

export type StoreRecord = {
  id: string
  code: string
  name: string
  type: string
  address: string
  city: string
  state: string
  stateCode: string
  pincode: string
  phone: string | null
  email: string | null
  gstin: string
  timezone: string
  createdAt?: string
  updatedAt?: string
}

export type RoleAbility = {
  id: string
  action: string
  subject: string
}

export type RoleRecord = {
  id: string
  name: string
  template: string
  storeId: string
  store?: { id: string; code: string; name: string }
  abilities: RoleAbility[]
}

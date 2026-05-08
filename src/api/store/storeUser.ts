/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client'

// ================= TYPES =================

export interface StoreUser {
  id: string
  name: string
  email: string
  phone: string
  scope: string
  hqRole: string | null
  status: string
  storeId: string
  roleId: string
  createdAt: string
}

// Create Payload
export interface CreateStoreUserPayload {
  name: string
  email: string
  phone: string
  password: string
  scope: 'STORE'
  storeId: string
  roleId: string
}

// Update Payload
export interface UpdateStoreUserPayload {
  name?: string
  phone?: string
  status?: string
  roleId?: string
}

// Reset Password Payload
export interface ResetPasswordPayload {
  newPassword: string
}

// Ability item (from role or override)
export interface AbilityItem {
  action: string
  subject: string
  inverted?: boolean
}

// Abilities response — GET /store/users/:id/abilities
export interface StoreUserAbilities {
  userId: string
  scope: string
  role: {
    id: string
    name: string
    template: string
    abilities: AbilityItem[]
  }
  overrides: {
    allow: AbilityItem[]
    deny: AbilityItem[]
  }
  effective: AbilityItem[]
}

// Update abilities payload — PUT /store/users/:id/abilities
export interface UpdateAbilitiesPayload {
  allow: AbilityItem[]
  deny: AbilityItem[]
}

// Detailed Response
export interface StoreUserDetails extends StoreUser {
  passwordHash: string
  createdBy: string
  lastLoginAt: string
  updatedAt: string
  store: {
    id: string
    code: string
    name: string
  }
  role: {
    id: string
    name: string
    template: string
  }
  storeAccess: any[]
  userAbilities: any[]
}

interface StoreUsersResponse {
  items: StoreUser[]
}

// ================= APIs =================

// 🔹 List
export async function listStoreUsers(limit = 20) {
  const { data } = await apiClient.get<StoreUsersResponse>(`/store/users?limit=${limit}`)
  return data.items
}

// 🔹 Get by ID
export async function getStoreUserById(id: string) {
  const { data } = await apiClient.get<StoreUserDetails>(`/store/users/${id}`)
  return data
}

// 🔹 Create
export async function createStoreUser(payload: CreateStoreUserPayload) {
  const { data } = await apiClient.post<StoreUser>(`/store/users`, payload)
  return data
}

// 🔹 Update
export async function updateStoreUser(id: string, payload: UpdateStoreUserPayload) {
  const { data } = await apiClient.patch<StoreUser>(`/store/users/${id}`, payload)
  return data
}

// 🔹 Delete
export async function deleteStoreUser(id: string) {
  const { data } = await apiClient.delete(`/store/users/${id}`)
  return data
}

// 🔹 Reset Password
export async function resetStoreUserPassword(id: string, payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<{ ok: boolean }>(
    `/store/users/${id}/reset-password`,
    payload,
  )
  return data
}

// 🔹 Get Abilities
export async function getStoreUserAbilities(id: string) {
  const { data } = await apiClient.get<StoreUserAbilities>(`/store/users/${id}/abilities`)
  return data
}

// 🔹 Update Abilities (overrides)
export async function updateStoreUserAbilities(id: string, payload: UpdateAbilitiesPayload) {
  const { data } = await apiClient.put<StoreUserAbilities>(`/store/users/${id}/abilities`, payload)
  return data
}

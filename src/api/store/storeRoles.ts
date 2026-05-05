/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client'

// ================= TYPES =================

// 🔹 Ability
export interface Ability {
  id?: string
  roleId?: string
  action: string
  subject: string
  conditions?: Record<string, any>
  inverted?: boolean
  createdAt?: string
}

// 🔹 Role (List)
export interface StoreRole {
  id: string
  storeId: string
  name: string
  template: string
  description: string
  createdAt: string
  updatedAt: string
  abilities: Ability[]
}

// 🔹 Role Details
export interface StoreRoleDetails extends StoreRole {
  store: {
    id: string
    code: string
    name: string
  }
}

// 🔹 Create Payload
export interface CreateStoreRolePayload {
  storeId: string
  name: string
  template: string
  description: string
  abilities: {
    action: string
    subject: string
  }[]
}

// 🔹 Update Payload
export interface UpdateStoreRolePayload {
  name?: string
  template?: string
  description?: string
  abilities?: {
    action: string
    subject: string
  }[]
}

// ================= APIs =================

// 🔹 List Roles
export async function listStoreRoles() {
  const { data } = await apiClient.get<StoreRole[]>(`/store/roles`)
  return data
}

// 🔹 Get Role by ID
export async function getStoreRoleById(id: string) {
  const { data } = await apiClient.get<StoreRoleDetails>(`/store/roles/${id}`)
  return data
}

// 🔹 Create Role
export async function createStoreRole(payload: CreateStoreRolePayload) {
  const { data } = await apiClient.post<StoreRole>(`/store/roles`, payload)
  return data
}

// 🔹 Update Role
export async function updateStoreRole(id: string, payload: UpdateStoreRolePayload) {
  const { data } = await apiClient.patch<StoreRole>(`/store/roles/${id}`, payload)
  return data
}

// 🔹 Delete Role
export async function deleteStoreRole(id: string) {
  const { data } = await apiClient.delete(`/store/roles/${id}`)
  return data
}

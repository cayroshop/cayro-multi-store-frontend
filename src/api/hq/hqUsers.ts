/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client'
import { getRequest } from '@/lib/request'
import type { UserListResponse } from '@/types/api'

// ================= TYPES =================

export interface HqUser {
  id: string
  name: string
  email: string
  phone: string | null
  scope: string
  hqRole: string | null
  status: string
  createdAt: string
  storeId?: string | null
  roleId?: string | null
}

export interface AbilityItem {
  action: string
  subject: string
  inverted?: boolean
}

// ================= PAYLOAD TYPES =================

export interface CreateHqUserPayload {
  name: string
  email: string
  phone: string
  password: string
  scope: 'HQ'
  hqRole: string
  storeIds?: string[]
  abilities?: AbilityItem[]
  storeId?: string
  roleId?: string
}

export interface UpdateHqUserPayload {
  name?: string
  phone?: string
  status?: string
  roleId?: string
}

export interface ResetHqUserPasswordPayload {
  newPassword: string
}

export interface UpdateHqUserAbilitiesPayload {
  allow: AbilityItem[]
  deny: AbilityItem[]
}

export interface UpdateHqUserAccessByIdPayload {
  storeIds: string[]
  allow: AbilityItem[]
  deny?: AbilityItem[]
}

// ================= FILTER TYPES =================

export interface FilterOption {
  value: string
  label: string
}

export interface FilterStoreOption {
  id: string
  code: string
  name: string
}

export interface FilterRoleOption {
  id: string
  name: string
  template: string
}

export interface HqUsersFiltersResponse {
  scopes: FilterOption[]
  statuses: FilterOption[]
  stores: FilterStoreOption[]
  roles: FilterRoleOption[]
}

// ================= RESPONSE TYPES =================

export interface HqUserAbilities {
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

export interface HqUserAccessByIdResponse {
  userId: string
  scope: string
  hqRole: string
  storeIds: string[]
  overrides: {
    allow: AbilityItem[]
    deny: AbilityItem[]
  }
}

// ================= APIs =================

export function listHqUsers(params?: any) {
  return getRequest<UserListResponse>('/hq/users', params)
}

export function getHqUsersFilters(params?: any) {
  return getRequest<HqUsersFiltersResponse>('/hq/users/filters', params)
}

export async function getHqUserById(id: string) {
  const { data } = await apiClient.get<HqUser>(`/hq/users/${id}`)
  return data
}

export async function createHqUser(payload: CreateHqUserPayload) {
  const { data } = await apiClient.post<HqUser>('/hq/users', payload)
  return data
}

export async function updateHqUserById(id: string, payload: UpdateHqUserPayload) {
  const { data } = await apiClient.patch<HqUser>(`/hq/users/${id}`, payload)
  return data
}

export async function deleteHqUserById(id: string) {
  const { data } = await apiClient.delete(`/hq/users/${id}`)
  return data
}

export async function resetHqUserPasswordById(id: string, payload: ResetHqUserPasswordPayload) {
  const { data } = await apiClient.post<{ ok: boolean }>(`/hq/users/${id}/reset-password`, payload)
  return data
}

// ================= Abilities APIs =================

export async function getHqUserAbilitiesById(id: string) {
  const { data } = await apiClient.get<HqUserAbilities>(`/hq/users/${id}/abilities`)
  return data
}

/** Matches your cURL - Uses PUT */
export async function updateHqUserAbilitiesById(id: string, payload: UpdateHqUserAbilitiesPayload) {
  const { data } = await apiClient.put<HqUserAbilities>(`/hq/users/${id}/abilities`, payload)
  return data
}

export async function getHqUserAccessById(id: string) {
  const { data } = await apiClient.get<HqUserAccessByIdResponse>(`/hq/users/${id}/access`)
  return data
}

export async function updateHqUserAccessById(id: string, payload: UpdateHqUserAccessByIdPayload) {
  const { data } = await apiClient.put<HqUserAccessByIdResponse>(`/hq/users/${id}/access`, payload)
  return data
}

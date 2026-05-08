/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/hqRoles.ts
import { apiClient } from '@/lib/api-client'

// ================= TYPES =================

export interface HqRoleAbilityAction {
  action: string
  label: string
}

export interface HqRoleAbilityCatalogItem {
  subject: string
  label: string
  module: string
  description?: string
  actions: HqRoleAbilityAction[]
}

export interface HqRoleStore {
  id: string
  code: string
  name: string
}

export interface HqRoleAbility {
  id?: string
  roleId?: string
  action: string
  subject: string
  conditions?: Record<string, any> | null
  inverted?: boolean
  createdAt?: string
}

export interface HqRole {
  id: string
  storeId: string
  name: string
  template: string
  description: string
  createdAt: string
  updatedAt: string
  store: HqRoleStore
  abilities: HqRoleAbility[]
}

export interface CreateHqRolePayload {
  storeId: string
  name: string
  template: string
  description: string
  abilities: {
    action: string
    subject: string
  }[]
}

export interface UpdateHqRolePayload {
  name: string
  template: string
  description: string
  abilities: {
    action: string
    subject: string
  }[]
}

export interface FilterOption {
  value: string
  label: string
}

export interface HqRoleFiltersResponse {
  stores: HqRoleStore[]
  templates: FilterOption[]
}

export interface GetHqRoleFiltersParams {
  storeSearch?: string
  nameSearch?: string
  limit?: number
}

// ================= API =================

/**
 * 1st API
 * GET /hq/roles/ability-catalog
 */
export async function hqRolesAbilityCatalog() {
  const { data } = await apiClient.get<HqRoleAbilityCatalogItem[]>('/hq/roles/ability-catalog')
  return data
}

/**
 * 2nd API
 * GET /hq/roles
 */
export async function getHqRoles() {
  const { data } = await apiClient.get<HqRole[]>('/hq/roles')
  return data
}

/**
 * GET /hq/roles/:id
 */
export async function getHqRolesById(id: string) {
  const { data } = await apiClient.get<HqRole>(`/hq/roles/${id}`)
  return data
}

/**
 * 3rd API
 * POST /hq/roles
 */
export async function createHqRole(payload: CreateHqRolePayload) {
  const { data } = await apiClient.post<HqRole>('/hq/roles', payload)
  return data
}

/**
 * PATCH /hq/roles/:id
 */
export async function updateHqRoleById(id: string, payload: UpdateHqRolePayload) {
  const { data } = await apiClient.patch<HqRole>(`/hq/roles/${id}`, payload)
  return data
}

/**
 * DELETE /hq/roles/:id
 */
export async function deleteHqRoleById(id: string) {
  const { data } = await apiClient.delete(`/hq/roles/${id}`)
  return data
}

/**
 * 4th API
 * GET /hq/roles/filters
 */
export async function getHqRoleFilters(params: GetHqRoleFiltersParams = {}) {
  const { data } = await apiClient.get<HqRoleFiltersResponse>('/hq/roles/filters', {
    params: {
      storeSearch: params.storeSearch,
      nameSearch: params.nameSearch,
      limit: params.limit ?? 50,
    },
  })

  return data
}

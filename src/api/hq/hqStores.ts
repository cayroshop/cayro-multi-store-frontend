// hqStores.ts

import { getRequest, patchRequest, deleteRequest, idempotencyPostRequest } from '@/lib/request'

// ================= TYPES =================

export interface HqStore {
  id: string
  code: string
  name: string
  type: 'PHYSICAL' | 'ONLINE'
  address: string
  city: string
  state: string
  stateCode: string
  pincode: string
  phone: string
  email: string
  gstin: string
  timezone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PickupLocation {
  id: string
  storeId: string
  locationName: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ================= PAYLOADS =================

export interface CreateHqStorePayload {
  code: string
  name: string
  type: 'PHYSICAL' | 'ONLINE'
  address: string
  city: string
  state: string
  stateCode: string
  pincode: string
  phone: string
  email: string
  gstin: string
  timezone: string
}

export interface UpdateHqStoreByIdPayload {
  code?: string
  name?: string
  type?: 'PHYSICAL' | 'ONLINE'
  address?: string
  city?: string
  state?: string
  stateCode?: string
  pincode?: string
  phone?: string
  email?: string
  gstin?: string
  timezone?: string
}

export interface CreatePickupLocationByStoreIdPayload {
  locationName: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault?: boolean
}

export interface UpdatePickupLocationByPickupIdPayload {
  locationName?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  phone?: string
  isDefault?: boolean
  isActive?: boolean
}

// ================= APIs =================

// 🔹 Get All HQ Stores
export function getAllHqStores() {
  return getRequest<HqStore[]>('/hq/stores')
}

// 🔹 Create HQ Store (Idempotency Required)
export function createHqStore(payload: CreateHqStorePayload) {
  return idempotencyPostRequest<HqStore>('/hq/stores', payload)
}

// 🔹 Get HQ Store By ID
export function getHqStoreById(id: string) {
  return getRequest<HqStore>(`/hq/stores/${id}`)
}

// 🔹 Update HQ Store By ID
export function updateHqStoreById(id: string, payload: UpdateHqStoreByIdPayload) {
  return patchRequest<HqStore>(`/hq/stores/${id}`, payload)
}

// 🔹 Delete HQ Store By ID
export function deleteHqStoreById(id: string) {
  return deleteRequest(`/hq/stores/${id}`)
}

// 🔹 Get Pickup Locations By Store ID
export function getPickupLocationsByStoreId(storeId: string) {
  return getRequest<PickupLocation[]>(`/hq/stores/${storeId}/pickup-locations`)
}

// 🔹 Create Pickup Location By Store ID (Idempotency Required)
export function createPickupLocationByStoreId(
  storeId: string,
  payload: CreatePickupLocationByStoreIdPayload,
) {
  return idempotencyPostRequest<PickupLocation>(`/hq/stores/${storeId}/pickup-locations`, payload)
}

// 🔹 Update Pickup Location By Pickup ID
export function updatePickupLocationByPickupId(
  storeId: string,
  pickupId: string,
  payload: UpdatePickupLocationByPickupIdPayload,
) {
  return patchRequest<PickupLocation>(`/hq/stores/${storeId}/pickup-locations/${pickupId}`, payload)
}

// 🔹 Delete Pickup Location By Pickup ID
export function deletePickupLocationByPickupId(storeId: string, pickupId: string) {
  return deleteRequest(`/hq/stores/${storeId}/pickup-locations/${pickupId}`)
}

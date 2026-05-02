import { apiClient } from '@/lib/api-client'
import type { StoreRecord } from '@/types/api'

export async function listStores() {
  const { data } = await apiClient.get<StoreRecord[]>('/stores')
  return data
}

export async function getStore(id: string) {
  const { data } = await apiClient.get<StoreRecord>(`/stores/${id}`)
  return data
}

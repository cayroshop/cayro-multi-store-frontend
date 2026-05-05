import { apiClient } from '@/lib/api-client'
import type { StoreRecord } from '@/types/api'

export async function listStores() {
  const { data } = await apiClient.get<StoreRecord[]>('/hq/stores')
  return data
}

export async function getStore(id: string) {
  const { data } = await apiClient.get<StoreRecord>(`/hq/stores/${id}`)
  return data
}

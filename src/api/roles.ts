import { apiClient } from '@/lib/api-client'
import type { RoleRecord } from '@/types/api'

export async function listRoles() {
  const { data } = await apiClient.get<RoleRecord[]>('/roles')
  return data
}

export async function getRole(id: string) {
  const { data } = await apiClient.get<RoleRecord>(`/roles/${id}`)
  return data
}

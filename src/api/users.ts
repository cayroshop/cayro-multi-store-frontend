import { apiClient } from '@/lib/api-client'
import type { UserListResponse } from '@/types/api'

export type ListUsersParams = {
  limit?: number
  cursor?: string
  email?: string
}

export async function listUsers(params?: ListUsersParams) {
  const { data } = await apiClient.get<UserListResponse>('/users', { params })
  return data
}

export async function getUser(id: string) {
  const { data } = await apiClient.get(`/users/${id}`)
  return data
}

import { apiClient } from '@/lib/api-client'
import { getRequest } from '@/lib/request'
import type { UserListResponse } from '@/types/api'

export type ListUsersParams = {
  limit?: number
  cursor?: string
  email?: string
}

export function listUsers(params?: ListUsersParams) {
  return getRequest<UserListResponse>('/hq/users', params)
}

export async function getUser(id: string) {
  const { data } = await apiClient.get(`/hq/users/${id}`)
  return data
}

export async function deleteUser(id: string) {
  const { data } = await apiClient.delete(`/hq/users/${id}`)
  return data
}

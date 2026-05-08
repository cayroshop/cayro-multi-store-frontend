import { v7 as uuidv7 } from 'uuid'
import { apiClient } from '@/lib/api-client'

const generateIdempotencyKey = () => {
  return uuidv7()
}

export const getRequest = async <T>(url: string, params?: unknown): Promise<T> => {
  const { data } = await apiClient.get<T>(url, { params })
  return data
}

export const postRequest = async <T>(url: string, body?: unknown): Promise<T> => {
  const { data } = await apiClient.post<T>(url, body)
  return data
}

export const idempotencyPostRequest = async <T>(url: string, body?: unknown): Promise<T> => {
  const { data } = await apiClient.post<T>(url, body, {
    headers: {
      'Idempotency-Key': generateIdempotencyKey(),
    },
  })

  return data
}

export const putRequest = async <T>(url: string, body?: unknown): Promise<T> => {
  const { data } = await apiClient.put<T>(url, body)
  return data
}

export const patchRequest = async <T>(url: string, body?: unknown): Promise<T> => {
  const { data } = await apiClient.patch<T>(url, body)
  return data
}

export const deleteRequest = async <T>(url: string): Promise<T> => {
  const { data } = await apiClient.delete<T>(url)
  return data
}

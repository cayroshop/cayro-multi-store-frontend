import { isAxiosError } from 'axios'

import type { ApiErrorBody } from '@/types/api'

export function getApiErrorMessage(error: unknown, fallback = 'Request failed'): string {
  if (isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) return body.message
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

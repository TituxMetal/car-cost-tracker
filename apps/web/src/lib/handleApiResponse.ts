import type { ApiResponse } from '~/types'

export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success || response.data == null) {
    throw new Error(response.message || 'API request failed')
  }

  return response.data
}

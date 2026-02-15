import { api, handleApiResponse } from '~/lib'
import type { User } from '~/types'

/**
 * Get current authenticated user (SSR-only - use useAuth hook on client)
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me')
  return handleApiResponse(response)
}

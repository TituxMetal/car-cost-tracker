import { api, handleApiResponse } from '~/lib'
import type { User } from '~/types/user.types'

import type { UpdateProfileSchema } from '../schemas/user.schema'

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileSchema): Promise<User> => {
  const response = await api.patch<User>('/users/me', data)
  return handleApiResponse(response)
}

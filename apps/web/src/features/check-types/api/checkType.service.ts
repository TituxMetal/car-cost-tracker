import { api, handleApiResponse } from '~/lib'

import type { CreateCheckTypeSchema, UpdateCheckTypeSchema } from '../schemas'
import type { CheckType } from '../types'

const getBaseUrl = (vehicleId: string) => `/vehicles/${vehicleId}/check-types`

export const getCheckTypes = async (vehicleId: string): Promise<CheckType[]> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.get<CheckType[]>(url)

  return handleApiResponse(response)
}

export const getCheckType = async (vehicleId: string, id: string): Promise<CheckType | null> => {
  const url = `${getBaseUrl(vehicleId)}/${id}`
  const response = await api.get<CheckType | null>(url)

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }

  return response.data ?? null
}

export const createCheckType = async (
  vehicleId: string,
  data: CreateCheckTypeSchema
): Promise<CheckType> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.post<CheckType>(url, data)

  return handleApiResponse(response)
}

export const updateCheckType = async (
  vehicleId: string,
  id: string,
  data: UpdateCheckTypeSchema
): Promise<CheckType> => {
  const url = `${getBaseUrl(vehicleId)}/${id}`
  const response = await api.patch<CheckType>(url, data)

  return handleApiResponse(response)
}

export const deleteCheckType = async (vehicleId: string, id: string): Promise<void> => {
  const url = `${getBaseUrl(vehicleId)}/${id}`
  const response = await api.delete<void>(url)

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }
}

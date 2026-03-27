import { api, handleApiResponse } from '~/lib'

import type { CreateCheckLogSchema } from '../schemas'
import type { CheckLog, CheckStatusSummary } from '../types'

const getBaseUrl = (vehicleId: string) => `/vehicles/${vehicleId}/check-logs`

export const getCheckLogs = async (vehicleId: string): Promise<CheckLog[]> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.get<CheckLog[]>(url)

  return handleApiResponse(response)
}

export const createCheckLog = async (
  vehicleId: string,
  data: CreateCheckLogSchema & { checkTypeId: string }
): Promise<CheckLog> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.post<CheckLog>(url, data)

  return handleApiResponse(response)
}

export const deleteCheckLog = async (vehicleId: string, id: string): Promise<void> => {
  const url = `${getBaseUrl(vehicleId)}/${id}`
  const response = await api.delete<void>(url)

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }
}

export const getCheckStatusSummary = async (vehicleId: string): Promise<CheckStatusSummary[]> => {
  const url = `/vehicles/${vehicleId}/check-status`
  const response = await api.get<CheckStatusSummary[]>(url)

  return handleApiResponse(response)
}

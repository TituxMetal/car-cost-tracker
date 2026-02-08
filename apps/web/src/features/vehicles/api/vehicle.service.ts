import { api } from '~/lib/apiRequest'
import type { ApiResponse } from '~/types/api.types'

import type { CreateVehicleSchema, UpdateMileageSchema, UpdateVehicleSchema } from '../schemas'
import type { Vehicle } from '../types'

const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success && response.data) {
    return response.data
  }
  throw new Error(response.message || 'API request failed')
}

export const getMyVehicle = async (): Promise<Vehicle | null> => {
  const response = await api.get<Vehicle | null>('/api/vehicles/me')

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }

  return response.data ?? null
}

export const createVehicle = async (data: CreateVehicleSchema): Promise<Vehicle> => {
  const response = await api.post<Vehicle>('/api/vehicles', data)

  return handleApiResponse(response)
}

export const updateVehicle = async (id: string, data: UpdateVehicleSchema): Promise<Vehicle> => {
  const response = await api.patch<Vehicle>(`/api/vehicles/${id}`, data)

  return handleApiResponse(response)
}

export const updateMileage = async (id: string, data: UpdateMileageSchema): Promise<Vehicle> => {
  const response = await api.patch<Vehicle>(`/api/vehicles/${id}/mileage`, data)

  return handleApiResponse(response)
}

export const deleteVehicle = async (id: string): Promise<void> => {
  const response = await api.delete<void>(`/api/vehicles/${id}`)

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }
}

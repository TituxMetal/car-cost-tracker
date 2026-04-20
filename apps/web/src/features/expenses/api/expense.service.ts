import { api, handleApiResponse } from '~/lib'

import type { CreateExpenseInput, Expense, UpdateExpenseInput } from '../types'

const getBaseUrl = (vehicleId: string) => `/vehicles/${vehicleId}/expenses`

export const listExpenses = async (vehicleId: string): Promise<Expense[]> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.get<Expense[]>(url)

  return handleApiResponse(response)
}

export const createExpense = async (
  vehicleId: string,
  data: CreateExpenseInput
): Promise<Expense> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.post<Expense>(url, data)

  return handleApiResponse(response)
}

export const updateExpense = async (
  vehicleId: string,
  id: string,
  data: UpdateExpenseInput
): Promise<Expense> => {
  const url = `${getBaseUrl(vehicleId)}/${id}`
  const response = await api.patch<Expense>(url, data)

  return handleApiResponse(response)
}

export const deleteExpense = async (vehicleId: string, id: string): Promise<void> => {
  const url = `${getBaseUrl(vehicleId)}/${id}`
  const response = await api.delete<void>(url)

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }
}

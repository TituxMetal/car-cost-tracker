import { api, handleApiResponse } from '~/lib'

import type { Budget, UpsertBudgetInput } from '../types'

const getBaseUrl = (vehicleId: string) => `/vehicles/${vehicleId}/budget`

export const getBudget = async (vehicleId: string): Promise<Budget | null> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.get<Budget>(url)

  // 404 means no budget defined — expected state, not an error. The backend currently
  // also returns 500 "Internal server error" for the absent case because domain
  // exceptions are not mapped to HTTP statuses yet (tracked in PROGRESS.md backlog:
  // "Cross-cutting API — domain exceptions to HTTP status mapping"). Treat both as
  // "no budget" until the global ExceptionFilter lands.
  if (!response.success && response.status === 404) return null
  if (
    !response.success &&
    response.status === 500 &&
    response.message === 'Internal server error'
  ) {
    console.warn(
      '[budget.service] Treating 500 "Internal server error" as "no budget defined". ' +
        'Remove once the backend ExceptionFilter maps BudgetNotFoundException to HTTP 404.'
    )
    return null
  }

  return handleApiResponse(response)
}

export const upsertBudget = async (vehicleId: string, data: UpsertBudgetInput): Promise<Budget> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.put<Budget>(url, data)

  return handleApiResponse(response)
}

export const deleteBudget = async (vehicleId: string): Promise<void> => {
  const url = getBaseUrl(vehicleId)
  const response = await api.delete<void>(url)

  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }
}

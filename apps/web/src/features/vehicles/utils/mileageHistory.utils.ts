export interface MileageHistoryEntry {
  recordedAt: string
  mileage: number
  delta: number
}

const MAX_ENTRIES = 20

const storageKey = (vehicleId: string): string => `mileage-history:${vehicleId}`

export const getMileageHistory = (vehicleId: string): MileageHistoryEntry[] => {
  if (typeof window === 'undefined') return []

  const raw = window.localStorage.getItem(storageKey(vehicleId))
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (error) {
    console.warn(`mileageHistory: failed to parse stored history for ${vehicleId}`, error)
    return []
  }
}

export const appendMileageHistory = (vehicleId: string, entry: MileageHistoryEntry): void => {
  if (typeof window === 'undefined') return

  const next = [entry, ...getMileageHistory(vehicleId)].slice(0, MAX_ENTRIES)
  window.localStorage.setItem(storageKey(vehicleId), JSON.stringify(next))
}

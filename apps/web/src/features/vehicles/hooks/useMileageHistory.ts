import { useStore } from '@nanostores/react'
import { useCallback, useMemo } from 'react'

import { $mileageHistoryTick, bumpMileageHistoryTick } from '../store'
import { appendMileageHistory as appendUtil, getMileageHistory } from '../utils'
import type { MileageHistoryEntry } from '../utils'

export interface UseMileageHistoryReturn {
  entries: MileageHistoryEntry[]
  append: (entry: MileageHistoryEntry) => void
}

export const useMileageHistory = (vehicleId: string | undefined): UseMileageHistoryReturn => {
  const tick = useStore($mileageHistoryTick)

  const entries = useMemo(() => (vehicleId ? getMileageHistory(vehicleId) : []), [vehicleId, tick])

  const append = useCallback(
    (entry: MileageHistoryEntry) => {
      if (!vehicleId) return
      appendUtil(vehicleId, entry)
      bumpMileageHistoryTick()
    },
    [vehicleId]
  )

  return { entries, append }
}

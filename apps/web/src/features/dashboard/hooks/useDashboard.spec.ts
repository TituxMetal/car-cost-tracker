import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import type { CheckLog, CheckStatusSummary } from '~/features/check-logs'
import {
  $checkLogs,
  $checkStatuses,
  $error as $checkLogsError,
  $isLoading as $checkLogsLoading,
  checkLogActions
} from '~/features/check-logs/store'
import {
  $checkTypes,
  $error as $checkTypesError,
  $isLoading as $checkTypesLoading,
  checkTypeActions
} from '~/features/check-types/store'
import type { CheckType } from '~/features/check-types/types'
import type { Vehicle } from '~/features/vehicles'
import {
  $error as $vehicleError,
  $isLoading as $vehicleLoading,
  $vehicle,
  vehicleActions
} from '~/features/vehicles/store'
import { act, cleanup, renderHook } from '~/test-utils'

import { useDashboard } from './useDashboard'

const mockVehicle: Vehicle = {
  id: 'v1',
  userId: 'u1',
  make: 'Peugeot',
  model: '205 GTI',
  year: 1990,
  engineType: '1.9L',
  fuelType: 'GASOLINE',
  vin: 'VF3741',
  licensePlate: '1234AB',
  purchaseDate: '2020-01-01',
  mileage: 120000,
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z'
}

const mockCheckType: CheckType = {
  id: 'ct1',
  vehicleId: 'v1',
  name: 'Vidange',
  description: null,
  intervalDays: 30,
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z'
}

const mockLog = (overrides: Partial<CheckLog> = {}): CheckLog => ({
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: '2026-04-01',
  notes: null,
  nextDueAt: '2026-05-01',
  createdAt: '2026-04-01T10:00:00.000Z',
  ...overrides
})

const mockStatus = (overrides: Partial<CheckStatusSummary> = {}): CheckStatusSummary => ({
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  intervalDays: 30,
  lastCompletedAt: '2026-04-01',
  nextDueAt: '2026-05-01',
  status: 'on-time',
  ...overrides
})

const resetStores = () => {
  $vehicle.set(null)
  $vehicleLoading.set(false)
  $vehicleError.set(null)
  $checkLogs.set([])
  $checkStatuses.set([])
  $checkLogsLoading.set(false)
  $checkLogsError.set(null)
  $checkTypes.set([])
  $checkTypesLoading.set(false)
  $checkTypesError.set(null)
}

describe('useDashboard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    resetStores()
  })

  describe('aggregate state', () => {
    it('returns isLoading=true when any underlying hook is loading', () => {
      $checkLogsLoading.set(true)

      const { result } = renderHook(() => useDashboard())

      expect(result.current.isLoading).toBe(true)
    })

    it('returns isLoading=false when none of the hooks is loading', () => {
      const { result } = renderHook(() => useDashboard())

      expect(result.current.isLoading).toBe(false)
    })

    it('returns the first non-null error across the three hooks', () => {
      $checkTypesError.set('check-types failed')

      const { result } = renderHook(() => useDashboard())

      expect(result.current.error).toBe('check-types failed')
    })

    it('forwards vehicle, hasVehicle and hasCheckTypes from underlying stores', () => {
      $vehicle.set(mockVehicle)
      $checkTypes.set([mockCheckType])

      const { result } = renderHook(() => useDashboard())

      expect(result.current.vehicle).toEqual(mockVehicle)
      expect(result.current.hasVehicle).toBe(true)
      expect(result.current.hasCheckTypes).toBe(true)
    })

    it('reports hasVehicle=false and hasCheckTypes=false when stores are empty', () => {
      const { result } = renderHook(() => useDashboard())

      expect(result.current.hasVehicle).toBe(false)
      expect(result.current.hasCheckTypes).toBe(false)
    })
  })

  describe('derived data', () => {
    it('computes statusCounts from the statuses array', () => {
      $checkStatuses.set([
        mockStatus({ checkTypeId: 'a', status: 'on-time' }),
        mockStatus({ checkTypeId: 'b', status: 'on-time' }),
        mockStatus({ checkTypeId: 'c', status: 'due-soon' }),
        mockStatus({ checkTypeId: 'd', status: 'overdue' }),
        mockStatus({ checkTypeId: 'e', status: 'never', nextDueAt: null })
      ])

      const { result } = renderHook(() => useDashboard())

      expect(result.current.statusCounts).toEqual({
        onTime: 2,
        dueSoon: 1,
        overdue: 1,
        never: 1
      })
    })

    it('filters action items to overdue and due-soon and sorts overdue first', () => {
      $checkStatuses.set([
        mockStatus({ checkTypeId: 'a', status: 'on-time' }),
        mockStatus({ checkTypeId: 'b', status: 'due-soon', nextDueAt: '2099-01-05' }),
        mockStatus({ checkTypeId: 'c', status: 'overdue', nextDueAt: '2000-01-01' }),
        mockStatus({ checkTypeId: 'd', status: 'never', nextDueAt: null })
      ])

      const { result } = renderHook(() => useDashboard())

      expect(result.current.actionItems).toHaveLength(2)
      expect(result.current.actionItems[0]?.checkTypeId).toBe('c')
      expect(result.current.actionItems[0]?.status).toBe('overdue')
      expect(result.current.actionItems[1]?.checkTypeId).toBe('b')
      expect(result.current.actionItems[1]?.status).toBe('due-soon')
    })

    it('enriches action items with a daysLabel derived from nextDueAt', () => {
      $checkStatuses.set([
        mockStatus({ checkTypeId: 'b', status: 'overdue', nextDueAt: '2000-01-01' })
      ])

      const { result } = renderHook(() => useDashboard())

      expect(result.current.actionItems[0]?.daysLabel).toMatch(/jours? de retard/)
    })

    it('returns the first 5 logs from the store as recentLogs', () => {
      const logs = Array.from({ length: 8 }, (_, index) => mockLog({ id: `cl${index + 1}` }))
      $checkLogs.set(logs)

      const { result } = renderHook(() => useDashboard())

      expect(result.current.recentLogs).toHaveLength(5)
      expect(result.current.recentLogs[0]?.id).toBe('cl1')
      expect(result.current.recentLogs[4]?.id).toBe('cl5')
    })
  })

  describe('actions', () => {
    it('initialize fetches the vehicle and then fetches the related data when a vehicle exists', async () => {
      const fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockImplementation(async () => {
        $vehicle.set(mockVehicle)
        return mockVehicle
      })
      const fetchByVehicleSpy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(
        undefined
      )
      const fetchStatusesSpy = spyOn(checkLogActions, 'fetchStatuses').mockResolvedValue(undefined)
      const fetchLogsSpy = spyOn(checkLogActions, 'fetchLogs').mockResolvedValue(undefined)

      const { result } = renderHook(() => useDashboard())
      await act(async () => {
        await result.current.initialize()
      })

      expect(fetchVehicleSpy).toHaveBeenCalled()
      expect(fetchByVehicleSpy).toHaveBeenCalledWith('v1')
      expect(fetchStatusesSpy).toHaveBeenCalledWith('v1')
      expect(fetchLogsSpy).toHaveBeenCalledWith('v1')

      fetchVehicleSpy.mockRestore()
      fetchByVehicleSpy.mockRestore()
      fetchStatusesSpy.mockRestore()
      fetchLogsSpy.mockRestore()
    })

    it('initialize skips fetchAll when no vehicle is loaded', async () => {
      const fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
      const fetchByVehicleSpy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(
        undefined
      )

      const { result } = renderHook(() => useDashboard())
      await result.current.initialize()

      expect(fetchVehicleSpy).toHaveBeenCalled()
      expect(fetchByVehicleSpy).not.toHaveBeenCalled()

      fetchVehicleSpy.mockRestore()
      fetchByVehicleSpy.mockRestore()
    })

    it('fetchAll calls the three fetchers with the vehicleId', async () => {
      const fetchByVehicleSpy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(
        undefined
      )
      const fetchStatusesSpy = spyOn(checkLogActions, 'fetchStatuses').mockResolvedValue(undefined)
      const fetchLogsSpy = spyOn(checkLogActions, 'fetchLogs').mockResolvedValue(undefined)

      const { result } = renderHook(() => useDashboard())
      await result.current.fetchAll('v1')

      expect(fetchByVehicleSpy).toHaveBeenCalledWith('v1')
      expect(fetchStatusesSpy).toHaveBeenCalledWith('v1')
      expect(fetchLogsSpy).toHaveBeenCalledWith('v1')

      fetchByVehicleSpy.mockRestore()
      fetchStatusesSpy.mockRestore()
      fetchLogsSpy.mockRestore()
    })

    it('logCheck delegates to createLog and then refreshes statuses and logs', async () => {
      const createSpy = spyOn(checkLogActions, 'create').mockResolvedValue(mockLog())
      const fetchStatusesSpy = spyOn(checkLogActions, 'fetchStatuses').mockResolvedValue(undefined)
      const fetchLogsSpy = spyOn(checkLogActions, 'fetchLogs').mockResolvedValue(undefined)

      const { result } = renderHook(() => useDashboard())
      await result.current.logCheck('v1', 'ct1', { completedAt: '2026-04-10', notes: 'ok' })

      expect(createSpy).toHaveBeenCalledWith('v1', 'ct1', {
        completedAt: '2026-04-10',
        notes: 'ok'
      })
      expect(fetchStatusesSpy).toHaveBeenCalledWith('v1')
      expect(fetchLogsSpy).toHaveBeenCalledWith('v1')

      createSpy.mockRestore()
      fetchStatusesSpy.mockRestore()
      fetchLogsSpy.mockRestore()
    })
  })
})

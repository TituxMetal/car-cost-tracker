import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { $error, $isLoading, $vehicle, vehicleActions } from '../store'
import type { Vehicle } from '../types'

import { useVehicle } from './useVehicle'

const mockVehicle: Vehicle = {
  id: 'v1',
  userId: 'u1',
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  engineType: null,
  fuelType: 'GASOLINE',
  vin: null,
  licensePlate: 'AB-123-CD',
  purchaseDate: null,
  mileage: 50000,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('useVehicle', () => {
  beforeEach(() => {
    // Reset all store atoms to initial state before each test
    $vehicle.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  describe('reactive state', () => {
    it('should return vehicle from store', () => {
      $vehicle.set(mockVehicle)

      const { result } = renderHook(() => useVehicle())

      expect(result.current.vehicle).toEqual(mockVehicle)
    })

    it('should return null vehicle when store is empty', () => {
      const { result } = renderHook(() => useVehicle())

      expect(result.current.vehicle).toBeNull()
    })

    it('should return isLoading from store', () => {
      $isLoading.set(true)

      const { result } = renderHook(() => useVehicle())

      expect(result.current.isLoading).toBe(true)
    })

    it('should return error from store', () => {
      $error.set('Error message')

      const { result } = renderHook(() => useVehicle())

      expect(result.current.error).toBe('Error message')
    })

    it('should return hasVehicle as true when vehicle exists', () => {
      $vehicle.set(mockVehicle)

      const { result } = renderHook(() => useVehicle())

      expect(result.current.hasVehicle).toBe(true)
    })

    it('should return hasVehicle as false when no vehicle', () => {
      const { result } = renderHook(() => useVehicle())

      expect(result.current.hasVehicle).toBe(false)
    })

    it('should return vehicleDisplayName from store', () => {
      $vehicle.set(mockVehicle)

      const { result } = renderHook(() => useVehicle())

      expect(result.current.vehicleDisplayName).toBe('Toyota Corolla (2020)')
    })
  })

  describe('actions', () => {
    it('should call vehicleActions.fetchVehicle', async () => {
      const spy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)

      const { result } = renderHook(() => useVehicle())
      await result.current.fetchVehicle()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('should call vehicleActions.create with data', async () => {
      const data = { make: 'Honda', model: 'Civic', year: 2021 }
      const spy = spyOn(vehicleActions, 'create').mockResolvedValue(mockVehicle)

      const { result } = renderHook(() => useVehicle())
      await result.current.createVehicle(data)

      expect(spy).toHaveBeenCalledWith(data)
      spy.mockRestore()
    })

    it('should call vehicleActions.update with id and data', async () => {
      const data = { make: 'Honda', model: 'Civic', year: 2021 }
      const spy = spyOn(vehicleActions, 'update').mockResolvedValue(mockVehicle)

      const { result } = renderHook(() => useVehicle())
      await result.current.updateVehicle('v1', data)

      expect(spy).toHaveBeenCalledWith('v1', data)
      spy.mockRestore()
    })

    it('should call vehicleActions.updateMileage with id and data', async () => {
      const data = { mileage: 60000 }
      const spy = spyOn(vehicleActions, 'updateMileage').mockResolvedValue(mockVehicle)

      const { result } = renderHook(() => useVehicle())
      await result.current.updateMileage('v1', data)

      expect(spy).toHaveBeenCalledWith('v1', data)
      spy.mockRestore()
    })

    it('should call vehicleActions.remove with id', async () => {
      const spy = spyOn(vehicleActions, 'remove').mockResolvedValue(undefined)

      const { result } = renderHook(() => useVehicle())
      await result.current.deleteVehicle('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('should call vehicleActions.clearError', () => {
      const spy = spyOn(vehicleActions, 'clearError')

      const { result } = renderHook(() => useVehicle())
      result.current.clearError()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})

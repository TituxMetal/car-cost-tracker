import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup } from '~/test-utils'

import type { Vehicle } from '../types'

const mockGet = mock(() => Promise.resolve({}))
const mockPost = mock(() => Promise.resolve({}))
const mockPatch = mock(() => Promise.resolve({}))
const mockDelete = mock(() => Promise.resolve({}))

mock.module('~/lib/apiRequest', () => ({
  api: {
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
    put: mock(() => Promise.resolve({})),
    delete: mockDelete
  },
  apiRequest: mock(() => Promise.resolve({}))
}))

import {
  $error,
  $hasVehicle,
  $isLoading,
  $vehicle,
  $vehicleDisplayName,
  vehicleActions
} from './vehicle.store'

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

describe('Vehicle Store', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    mockGet.mockClear()
    mockPost.mockClear()
    mockPatch.mockClear()
    mockDelete.mockClear()

    // Reset store state
    $vehicle.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  describe('State Atoms', () => {
    it('should initialize $vehicle with null', () => {
      expect($vehicle.get()).toBeNull()
    })

    it('should initialize $isLoading with false', () => {
      expect($isLoading.get()).toBe(false)
    })

    it('should initialize $error with null', () => {
      expect($error.get()).toBeNull()
    })
  })

  describe('Computed Values', () => {
    it('should return false for $hasVehicle when vehicle is null', () => {
      expect($hasVehicle.get()).toBe(false)
    })

    it('should return true for $hasVehicle when vehicle exists', () => {
      $vehicle.set(mockVehicle)

      expect($hasVehicle.get()).toBe(true)
    })

    it('should return empty string for $vehicleDisplayName when no vehicle', () => {
      $vehicle.set(null)
      $error.set(null)

      expect($vehicleDisplayName.get()).toBe('')
    })

    it('should return "Make Model (Year)" for $vehicleDisplayName', () => {
      $vehicle.set(mockVehicle)

      expect($vehicleDisplayName.get()).toBe('Toyota Corolla (2020)')
    })
  })

  describe('vehicleActions', () => {
    describe('fetchVehicle', () => {
      it('should fetch and set vehicle on success', async () => {
        const apiResponse = { data: mockVehicle, success: true }

        mockGet.mockResolvedValueOnce(apiResponse)

        await vehicleActions.fetchVehicle()

        expect(mockGet).toHaveBeenCalledWith('/vehicles/me')
        expect($vehicle.get()).toEqual(mockVehicle)
        expect($error.get()).toBeNull()
      })

      it('should set vehicle to null when no vehicle exists', async () => {
        const apiResponse = { data: null, success: true }

        mockGet.mockResolvedValueOnce(apiResponse)

        await vehicleActions.fetchVehicle()

        expect(mockGet).toHaveBeenCalledWith('/vehicles/me')
        expect($vehicle.get()).toBeNull()
        expect($error.get()).toBeNull()
      })

      it('should set error on failure', async () => {
        const errorMessage = 'Failed to fetch vehicle'

        mockGet.mockRejectedValueOnce(new Error(errorMessage))

        await vehicleActions.fetchVehicle()

        expect(mockGet).toHaveBeenCalledWith('/vehicles/me')
        expect($vehicle.get()).toBeNull()
        expect($error.get()).toBe(errorMessage)
      })

      it('should manage loading state during fetch', async () => {
        const apiResponse = { data: mockVehicle, success: true }

        mockGet.mockResolvedValueOnce(apiResponse)

        const fetchPromise = vehicleActions.fetchVehicle()

        expect($isLoading.get()).toBe(true)

        await fetchPromise

        expect($isLoading.get()).toBe(false)
      })
    })

    describe('create', () => {
      it('should create vehicle and set state on success', async () => {
        const newVehicleData = {
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          fuelType: 'GASOLINE' as const
        }
        const createdVehicle = { ...mockVehicle, ...newVehicleData, id: 'v2' }
        const apiResponse = { data: createdVehicle, success: true }

        mockPost.mockResolvedValueOnce(apiResponse)

        const result = await vehicleActions.create(newVehicleData)

        expect(mockPost).toHaveBeenCalledWith('/vehicles', newVehicleData)
        expect($vehicle.get()).toEqual(createdVehicle)
        expect($error.get()).toBeNull()
        expect(result).toEqual(createdVehicle)
      })

      it('should set error on creation failure', async () => {
        const newVehicleData = {
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          fuelType: 'GASOLINE' as const
        }
        const errorMessage = 'Failed to create vehicle'

        mockPost.mockRejectedValueOnce(new Error(errorMessage))

        await expect(vehicleActions.create(newVehicleData)).rejects.toThrow(errorMessage)

        expect(mockPost).toHaveBeenCalledWith('/vehicles', newVehicleData)
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('update', () => {
      it('should update vehicle and set state on success', async () => {
        const updatedData = { make: 'Toyota', model: 'Camry', year: 2022 }
        const updatedVehicle = { ...mockVehicle, ...updatedData }
        const apiResponse = { data: updatedVehicle, success: true }

        mockPatch.mockResolvedValueOnce(apiResponse)

        const result = await vehicleActions.update(mockVehicle.id, updatedData)

        expect(mockPatch).toHaveBeenCalledWith(`/vehicles/${mockVehicle.id}`, updatedData)
        expect($vehicle.get()).toEqual(updatedVehicle)
        expect($error.get()).toBeNull()
        expect(result).toEqual(updatedVehicle)
      })

      it('should set error on update failure', async () => {
        const updatedData = { make: 'Toyota', model: 'Camry', year: 2022 }
        const errorMessage = 'Failed to update vehicle'

        mockPatch.mockRejectedValueOnce(new Error(errorMessage))

        await expect(vehicleActions.update(mockVehicle.id, updatedData)).rejects.toThrow(
          errorMessage
        )

        expect(mockPatch).toHaveBeenCalledWith(`/vehicles/${mockVehicle.id}`, updatedData)
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('updateMileage', () => {
      it('should update mileage and set state on success', async () => {
        const mileageData = { mileage: 55000 }
        const updatedVehicle = { ...mockVehicle, mileage: mileageData.mileage }
        const apiResponse = { data: updatedVehicle, success: true }

        mockPatch.mockResolvedValueOnce(apiResponse)

        const result = await vehicleActions.updateMileage(mockVehicle.id, mileageData)

        expect(mockPatch).toHaveBeenCalledWith(`/vehicles/${mockVehicle.id}/mileage`, mileageData)
        expect($vehicle.get()).toEqual(updatedVehicle)
        expect($error.get()).toBeNull()
        expect(result).toEqual(updatedVehicle)
      })

      it('should set error on mileage update failure', async () => {
        const mileageData = { mileage: 55000 }
        const errorMessage = 'Failed to update mileage'

        mockPatch.mockRejectedValueOnce(new Error(errorMessage))

        await expect(vehicleActions.updateMileage(mockVehicle.id, mileageData)).rejects.toThrow(
          errorMessage
        )

        expect(mockPatch).toHaveBeenCalledWith(`/vehicles/${mockVehicle.id}/mileage`, mileageData)
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('remove', () => {
      it('should delete vehicle and set state to null on success', async () => {
        const apiResponse = { success: true }

        mockDelete.mockResolvedValueOnce(apiResponse)

        await vehicleActions.remove(mockVehicle.id)

        expect(mockDelete).toHaveBeenCalledWith(`/vehicles/${mockVehicle.id}`)
        expect($vehicle.get()).toBeNull()
        expect($error.get()).toBeNull()
      })

      it('should set error on deletion failure', async () => {
        const errorMessage = 'Failed to delete vehicle'

        mockDelete.mockRejectedValueOnce(new Error(errorMessage))

        await expect(vehicleActions.remove(mockVehicle.id)).rejects.toThrow(errorMessage)

        expect(mockDelete).toHaveBeenCalledWith(`/vehicles/${mockVehicle.id}`)
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('setInitialVehicle', () => {
      it('should set vehicle and clear error', () => {
        $error.set('Some error')

        vehicleActions.setInitialVehicle(mockVehicle)

        expect($vehicle.get()).toEqual(mockVehicle)
        expect($error.get()).toBeNull()
      })

      it('should handle null vehicle', () => {
        $error.set('Some error')

        vehicleActions.setInitialVehicle(null)

        expect($vehicle.get()).toBeNull()
        expect($error.get()).toBeNull()
      })
    })

    describe('clearError', () => {
      it('should clear error state', () => {
        $error.set('Some error')

        vehicleActions.clearError()

        expect($error.get()).toBeNull()
      })
    })
  })
})

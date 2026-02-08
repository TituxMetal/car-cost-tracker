import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'

import type { CreateVehicleSchema } from '../schemas'
import type { FuelType, Vehicle } from '../types'
import { FUEL_TYPES } from '../types'

import {
  createVehicle,
  deleteVehicle,
  getMyVehicle,
  updateMileage,
  updateVehicle
} from './vehicle.service'

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

describe('vehicle.service', () => {
  let getSpy: Mock<typeof api.get>
  let postSpy: Mock<typeof api.post>
  let patchSpy: Mock<typeof api.patch>
  let deleteSpy: Mock<typeof api.delete>

  beforeEach(() => {
    getSpy = spyOn(api, 'get')
    postSpy = spyOn(api, 'post')
    patchSpy = spyOn(api, 'patch')
    deleteSpy = spyOn(api, 'delete')
  })

  afterEach(() => {
    getSpy.mockRestore()
    postSpy.mockRestore()
    patchSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('getMyVehicle', () => {
    it('should return vehicle when one exists', async () => {
      const vehicleData: Vehicle = mockVehicle

      getSpy.mockResolvedValueOnce({
        success: true,
        data: vehicleData
      })

      const result = await getMyVehicle()

      expect(api.get).toHaveBeenCalledWith('/api/vehicles/me')
      expect(result).toEqual(vehicleData)
    })

    it('should return null when no vehicle exists', async () => {
      getSpy.mockResolvedValueOnce({
        success: true,
        data: null
      })

      const result = await getMyVehicle()

      expect(api.get).toHaveBeenCalledWith('/api/vehicles/me')
      expect(result).toBeNull()
    })

    it('should throw on API failure', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'API error'
      })

      await expect(getMyVehicle()).rejects.toThrow('API error')
      expect(api.get).toHaveBeenCalledWith('/api/vehicles/me')
    })
  })

  describe('createVehicle', () => {
    it('should call api.post with correct endpoint and data', async () => {
      const createData: CreateVehicleSchema = {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        fuelType: FUEL_TYPES[0]
      }
      const mockedVehicle: Vehicle = {
        id: 'v2',
        userId: 'u1',
        make: createData.make,
        model: createData.model,
        year: createData.year,
        engineType: null,
        fuelType: createData.fuelType as FuelType,
        vin: null,
        licensePlate: null,
        purchaseDate: null,
        mileage: 0,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02'
      }

      postSpy.mockResolvedValueOnce({
        success: true,
        data: mockedVehicle
      })

      const result = await createVehicle(createData)

      expect(result).toEqual(mockedVehicle)
      expect(api.post).toHaveBeenCalledWith('/api/vehicles', createData)
    })

    it('should throw on failed creation', async () => {
      const createData: CreateVehicleSchema = {
        make: 'Honda',
        model: 'Civic',
        year: 2021
      }

      postSpy.mockResolvedValueOnce({
        success: false,
        message: 'Creation failed'
      })

      await expect(createVehicle(createData)).rejects.toThrow('Creation failed')
      expect(api.post).toHaveBeenCalledWith('/api/vehicles', createData)
    })
  })

  describe('updateVehicle', () => {
    it('should call api.patch with vehicle id and data', async () => {
      const id = 'v1'
      const updateData = { make: 'Subaru', model: 'Impreza' }

      const updatedVehicle: Vehicle = {
        ...mockVehicle,
        ...updateData
      }

      patchSpy.mockResolvedValueOnce({
        success: true,
        data: updatedVehicle
      })

      const result = await updateVehicle(id, updateData)

      expect(api.patch).toHaveBeenCalledWith(`/api/vehicles/${id}`, updateData)
      expect(result).toEqual(updatedVehicle)
    })

    it('should throw on failed update', async () => {
      const id = 'v1'
      const updateData = { make: 'Subaru', model: 'Impreza' }

      patchSpy.mockResolvedValueOnce({
        success: false,
        message: 'Update failed'
      })

      await expect(updateVehicle(id, updateData)).rejects.toThrow('Update failed')
      expect(api.patch).toHaveBeenCalledWith(`/api/vehicles/${id}`, updateData)
    })
  })

  describe('updateMileage', () => {
    it('should call api.patch with mileage endpoint', async () => {
      const id = 'v1'
      const mileageData = { mileage: 55000 }

      patchSpy.mockResolvedValueOnce({
        success: true,
        data: { ...mockVehicle, mileage: mileageData.mileage }
      })

      const result = await updateMileage(id, mileageData)

      expect(api.patch).toHaveBeenCalledWith(`/api/vehicles/${id}/mileage`, mileageData)
      expect(result.mileage).toEqual(mileageData.mileage)
    })

    it('should throw on failed mileage update', async () => {
      const id = 'v1'
      const mileageData = { mileage: 55000 }

      patchSpy.mockResolvedValueOnce({
        success: false,
        message: 'Mileage update failed'
      })

      await expect(updateMileage(id, mileageData)).rejects.toThrow('Mileage update failed')
      expect(api.patch).toHaveBeenCalledWith(`/api/vehicles/${id}/mileage`, mileageData)
    })
  })

  describe('deleteVehicle', () => {
    it('should call api.delete with vehicle id', async () => {
      const id = 'v1'

      deleteSpy.mockResolvedValueOnce({
        success: true
      })

      await expect(deleteVehicle(id)).resolves.toBeUndefined()
      expect(api.delete).toHaveBeenCalledWith(`/api/vehicles/${id}`)
    })

    it('should throw on failed deletion', async () => {
      const id = 'v1'

      deleteSpy.mockResolvedValueOnce({
        success: false,
        message: 'Deletion failed'
      })

      await expect(deleteVehicle(id)).rejects.toThrow('Deletion failed')
      expect(api.delete).toHaveBeenCalledWith(`/api/vehicles/${id}`)
    })
  })
})

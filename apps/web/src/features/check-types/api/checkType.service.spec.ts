import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'

import type { CreateCheckTypeSchema, UpdateCheckTypeSchema } from '../schemas'
import type { CheckType } from '../types'

import {
  createCheckType,
  deleteCheckType,
  getCheckType,
  getCheckTypes,
  updateCheckType
} from './checkType.service'

const mockCheckType: CheckType = {
  id: 'ct1',
  vehicleId: 'v1',
  name: 'Oil Level Check',
  description: null,
  intervalDays: 7,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
}

describe('checkType.service', () => {
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

  describe('getCheckTypes', () => {
    it('should return check types for a vehicle', async () => {
      const checkTypesData: CheckType[] = [mockCheckType]

      getSpy.mockResolvedValueOnce({
        success: true,
        data: checkTypesData
      })

      const result = await getCheckTypes('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-types')
      expect(result).toEqual(checkTypesData)
    })

    it('should return empty array when no check types exist', async () => {
      getSpy.mockResolvedValueOnce({
        success: true,
        data: []
      })

      const result = await getCheckTypes('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-types')
      expect(result).toEqual([])
    })

    it('should throw on API failure', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'API error'
      })

      await expect(getCheckTypes('v1')).rejects.toThrow('API error')
      expect(api.get).toHaveBeenCalledWith('/vehicles/v1/check-types')
    })
  })

  describe('getCheckType', () => {
    it('should return a single check type', async () => {
      const checkTypeData: CheckType = mockCheckType

      getSpy.mockResolvedValueOnce({
        success: true,
        data: checkTypeData
      })

      const result = await getCheckType('v1', 'ct1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1')
      expect(result).toEqual(checkTypeData)
    })

    it('should throw on API failure', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'API error'
      })

      await expect(getCheckType('v1', 'ct1')).rejects.toThrow('API error')
      expect(api.get).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1')
    })
  })

  describe('createCheckType', () => {
    it('should call api.post with correct endpoint and data', async () => {
      const createData: CreateCheckTypeSchema = {
        name: 'Tire Pressure Check',
        intervalDays: 14
      }
      const createdCheckType: CheckType = {
        id: 'ct2',
        vehicleId: 'v1',
        name: createData.name,
        description: null,
        intervalDays: createData.intervalDays,
        createdAt: '2026-01-02',
        updatedAt: '2026-01-02'
      }

      postSpy.mockResolvedValueOnce({
        success: true,
        data: createdCheckType
      })

      const result = await createCheckType('v1', createData)

      expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/check-types', createData)
      expect(result).toEqual(createdCheckType)
    })

    it('should throw on failed creation', async () => {
      const createData: CreateCheckTypeSchema = {
        name: 'Tire Pressure Check',
        intervalDays: 14
      }

      postSpy.mockResolvedValueOnce({
        success: false,
        message: 'Creation failed'
      })

      await expect(createCheckType('v1', createData)).rejects.toThrow('Creation failed')
      expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/check-types', createData)
    })
  })

  describe('updateCheckType', () => {
    it('should call api.patch with correct endpoint and data', async () => {
      const id = 'ct1'
      const updateData: UpdateCheckTypeSchema = { name: 'Updated Name', intervalDays: 30 }
      const updatedCheckType: CheckType = {
        ...mockCheckType,
        ...updateData
      }

      patchSpy.mockResolvedValueOnce({
        success: true,
        data: updatedCheckType
      })

      const result = await updateCheckType('v1', id, updateData)

      expect(patchSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1', updateData)
      expect(result).toEqual(updatedCheckType)
    })

    it('should throw on failed update', async () => {
      const id = 'ct1'
      const updateData: UpdateCheckTypeSchema = { name: 'Updated Name', intervalDays: 30 }

      patchSpy.mockResolvedValueOnce({
        success: false,
        message: 'Update failed'
      })

      await expect(updateCheckType('v1', id, updateData)).rejects.toThrow('Update failed')
      expect(patchSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1', updateData)
    })
  })

  describe('deleteCheckType', () => {
    it('should call api.delete with correct endpoint', async () => {
      const id = 'ct1'

      deleteSpy.mockResolvedValue({
        success: true
      })

      await expect(deleteCheckType('v1', id)).resolves.toBeUndefined()
      expect(api.delete).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1')
    })

    it('should throw on failed deletion', async () => {
      const id = 'ct1'

      deleteSpy.mockResolvedValueOnce({
        success: false,
        message: 'Deletion failed'
      })

      await expect(deleteCheckType('v1', id)).rejects.toThrow('Deletion failed')
      expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1')
    })
  })
})

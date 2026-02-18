import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { Prisma } from '@generated'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { CheckTypeInfrastructureMapper } from '../mappers'

import { PrismaCheckTypeRepository } from './PrismaCheckType.repository'

describe('PrismaCheckTypeRepository', () => {
  let repository: PrismaCheckTypeRepository
  let mockPrismaService: {
    checkType: {
      create: Mock<PrismaProvider['checkType']['create']>
      findUnique: Mock<PrismaProvider['checkType']['findUnique']>
      findMany: Mock<PrismaProvider['checkType']['findMany']>
      findFirst: Mock<PrismaProvider['checkType']['findFirst']>
      update: Mock<PrismaProvider['checkType']['update']>
      delete: Mock<PrismaProvider['checkType']['delete']>
    }
  }

  const createMockPrismaCheckType = (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    vehicleId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Oil Change',
    description: 'Change engine oil',
    intervalDays: 180,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    ...overrides
  })

  const createMockCheckTypeEntity = () =>
    new CheckTypeEntity(
      new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
      '123e4567-e89b-12d3-a456-426614174001',
      new CheckTypeNameValueObject('Oil Change'),
      'Change engine oil',
      new IntervalDaysValueObject(180),
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-01-02T00:00:00Z')
    )

  beforeEach(() => {
    mockPrismaService = {
      checkType: {
        create: mock(() => {}) as unknown as Mock<PrismaProvider['checkType']['create']>,
        findUnique: mock(() => {}) as unknown as Mock<PrismaProvider['checkType']['findUnique']>,
        findMany: mock(() => {}) as unknown as Mock<PrismaProvider['checkType']['findMany']>,
        findFirst: mock(() => {}) as unknown as Mock<PrismaProvider['checkType']['findFirst']>,
        update: mock(() => {}) as unknown as Mock<PrismaProvider['checkType']['update']>,
        delete: mock(() => {}) as unknown as Mock<PrismaProvider['checkType']['delete']>
      }
    }

    repository = new PrismaCheckTypeRepository(mockPrismaService as unknown as PrismaProvider)
  })

  describe('create', () => {
    it('should create check type and return domain entity', async () => {
      const checkTypeEntity = createMockCheckTypeEntity()
      const prismaRecord = createMockPrismaCheckType()

      mockPrismaService.checkType.create.mockResolvedValue(prismaRecord)

      const result = await repository.create(checkTypeEntity)

      expect(mockPrismaService.checkType.create).toHaveBeenCalledWith({
        data: CheckTypeInfrastructureMapper.toPrisma(checkTypeEntity)
      })
      expect(result).toEqual(CheckTypeInfrastructureMapper.toDomain(prismaRecord))
    })

    it('should throw CheckTypeAlreadyExistsException on unique constraint violation', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.0.0'
      })

      mockPrismaService.checkType.create.mockRejectedValue(prismaError)

      await expect(repository.create(createMockCheckTypeEntity())).rejects.toThrow(
        `Check type already exists: ${createMockCheckTypeEntity().name.value}`
      )
    })
  })

  describe('findById', () => {
    it('should find check type by id and return domain entity', async () => {
      const checkTypeId = new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const prismaRecord = createMockPrismaCheckType()

      mockPrismaService.checkType.findUnique.mockResolvedValue(prismaRecord)

      const result = await repository.findById(checkTypeId)

      expect(mockPrismaService.checkType.findUnique).toHaveBeenCalledWith({
        where: { id: checkTypeId.value }
      })
      expect(result).toEqual(CheckTypeInfrastructureMapper.toDomain(prismaRecord))
    })

    it('should return null when check type not found', async () => {
      const checkTypeId = new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000')

      mockPrismaService.checkType.findUnique.mockResolvedValue(null)

      const result = await repository.findById(checkTypeId)

      expect(result).toBeNull()
    })
  })

  describe('findByVehicleId', () => {
    it('should find all check types for vehicle', async () => {
      const vehicleId = '123e4567-e89b-12d3-a456-426614174001'
      const prismaRecords = [
        createMockPrismaCheckType(),
        createMockPrismaCheckType({ id: '123e4567-e89b-12d3-a456-426614174002' })
      ]

      mockPrismaService.checkType.findMany.mockResolvedValue(prismaRecords)

      const result = await repository.findByVehicleId(vehicleId)

      expect(mockPrismaService.checkType.findMany).toHaveBeenCalledWith({
        where: { vehicleId }
      })
      expect(result).toEqual(prismaRecords.map(CheckTypeInfrastructureMapper.toDomain))
    })

    it('should return empty array when vehicle has no check types', async () => {
      const vehicleId = '123e4567-e89b-12d3-a456-426614174001'

      mockPrismaService.checkType.findMany.mockResolvedValue([])

      const result = await repository.findByVehicleId(vehicleId)

      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update check type and return domain entity', async () => {
      const checkTypeEntity = createMockCheckTypeEntity()
      const updatesPrismaRecord = createMockPrismaCheckType({ name: 'Updated Name' })

      mockPrismaService.checkType.update.mockResolvedValue(updatesPrismaRecord)

      const result = await repository.update(checkTypeEntity)

      expect(mockPrismaService.checkType.update).toHaveBeenCalledWith({
        where: { id: checkTypeEntity.id.value },
        data: CheckTypeInfrastructureMapper.toPrisma(checkTypeEntity)
      })
      expect(result).toEqual(CheckTypeInfrastructureMapper.toDomain(updatesPrismaRecord))
    })

    it('should throw CheckTypeNotFoundException when check type does not exist', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '7.0.0'
      })

      mockPrismaService.checkType.update.mockRejectedValue(prismaError)

      await expect(repository.update(createMockCheckTypeEntity())).rejects.toThrow(
        `Check type not found: ${createMockCheckTypeEntity().id.value}`
      )
    })
  })

  describe('delete', () => {
    it('should delete check type by id', async () => {
      const checkTypeId = new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const deletedPrismaRecord = createMockPrismaCheckType({ id: checkTypeId.value })

      mockPrismaService.checkType.delete.mockResolvedValue(deletedPrismaRecord)

      await repository.delete(checkTypeId)

      expect(mockPrismaService.checkType.delete).toHaveBeenCalledWith({
        where: { id: checkTypeId.value }
      })
    })

    it('should throw CheckTypeNotFoundException when check type does not exist', async () => {
      const checkTypeId = new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '7.0.0'
      })

      mockPrismaService.checkType.delete.mockRejectedValue(prismaError)

      await expect(repository.delete(checkTypeId)).rejects.toThrow(
        `Check type not found: ${checkTypeId.value}`
      )
    })
  })

  describe('existsByNameAndVehicle', () => {
    it('should return true when check type exists with name for vehicle', async () => {
      const checkTypeId = CheckTypeIdValueObject.generate()
      const vehicleId = '123e4567-e89b-12d3-a456-426614174001'
      const foundCheckType = createMockPrismaCheckType({ id: checkTypeId.value, vehicleId })

      mockPrismaService.checkType.findFirst.mockResolvedValue(foundCheckType)

      const result = await repository.existsByNameAndVehicle(foundCheckType.name, vehicleId)

      expect(mockPrismaService.checkType.findFirst).toHaveBeenCalledWith({
        where: { name: foundCheckType.name, vehicleId }
      })
      expect(result).toBe(true)
    })

    it('should return false when no check type exists with name for vehicle', async () => {
      const vehicleId = '123e4567-e89b-12d3-a456-426614174001'

      mockPrismaService.checkType.findFirst.mockResolvedValue(null)

      const result = await repository.existsByNameAndVehicle('Oil Level Check', vehicleId)

      expect(mockPrismaService.checkType.findFirst).toHaveBeenCalledWith({
        where: { name: 'Oil Level Check', vehicleId }
      })
      expect(result).toBe(false)
    })
  })
})

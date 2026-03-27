import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { Prisma } from '@generated'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import { CheckLogNotFoundException } from '~/check-logs/domain/exceptions'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { CheckLogInfrastructureMapper } from '../mappers'

import { PrismaCheckLogRepository } from './PrismaCheckLog.repository'

describe('PrismaCheckLogRepository', () => {
  let repository: PrismaCheckLogRepository
  let mockPrismaService: {
    checkLog: {
      create: Mock<PrismaProvider['checkLog']['create']>
      findUnique: Mock<PrismaProvider['checkLog']['findUnique']>
      findMany: Mock<PrismaProvider['checkLog']['findMany']>
      delete: Mock<PrismaProvider['checkLog']['delete']>
    }
  }

  const createMockPrismaCheckLog = (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
    completedAt: '2026-03-15',
    notes: 'All good',
    nextDueAt: '2026-03-22',
    createdAt: new Date('2026-03-15T10:00:00Z'),
    updatedAt: new Date('2026-03-15T10:00:00Z'),
    ...overrides
  })

  const createMockCheckLogEntity = () =>
    new CheckLogEntity(
      new CheckLogIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
      '660e8400-e29b-41d4-a716-446655440000',
      new CompletedAtValueObject('2026-03-15'),
      'All good',
      '2026-03-22',
      new Date('2026-03-15T10:00:00Z'),
      new Date('2026-03-15T10:00:00Z')
    )

  beforeEach(() => {
    mockPrismaService = {
      checkLog: {
        create: mock(() => {}) as unknown as Mock<PrismaProvider['checkLog']['create']>,
        findUnique: mock(() => {}) as unknown as Mock<PrismaProvider['checkLog']['findUnique']>,
        findMany: mock(() => {}) as unknown as Mock<PrismaProvider['checkLog']['findMany']>,
        delete: mock(() => {}) as unknown as Mock<PrismaProvider['checkLog']['delete']>
      }
    }

    repository = new PrismaCheckLogRepository(mockPrismaService as unknown as PrismaProvider)
  })

  describe('create', () => {
    it('should create check log and return domain entity', async () => {
      const checkLogEntity = createMockCheckLogEntity()
      const prismaRecord = createMockPrismaCheckLog()

      mockPrismaService.checkLog.create.mockResolvedValue(prismaRecord)

      const result = await repository.create(checkLogEntity)

      expect(mockPrismaService.checkLog.create).toHaveBeenCalledWith({
        data: CheckLogInfrastructureMapper.toPrisma(checkLogEntity)
      })
      expect(result).toEqual(checkLogEntity)
    })
  })

  describe('findById', () => {
    it('should find check log by id and return domain entity', async () => {
      const checkLogEntity = createMockCheckLogEntity()
      const prismaRecord = createMockPrismaCheckLog()

      mockPrismaService.checkLog.findUnique.mockResolvedValue(prismaRecord)

      const result = await repository.findById(checkLogEntity.id)

      expect(mockPrismaService.checkLog.findUnique).toHaveBeenCalledWith({
        where: { id: checkLogEntity.id.value }
      })
      expect(result).toEqual(checkLogEntity)
    })

    it('should return null when check log not found', async () => {
      mockPrismaService.checkLog.findUnique.mockResolvedValue(null)

      const result = await repository.findById(
        new CheckLogIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      )

      expect(mockPrismaService.checkLog.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' }
      })
      expect(result).toBeNull()
    })
  })

  describe('findByCheckTypeId', () => {
    it('should find all logs for a check type', async () => {
      const checkLogEntity = createMockCheckLogEntity()
      const prismaRecord = createMockPrismaCheckLog()

      mockPrismaService.checkLog.findMany.mockResolvedValue([prismaRecord])

      const result = await repository.findByCheckTypeId(checkLogEntity.checkTypeId)

      expect(mockPrismaService.checkLog.findMany).toHaveBeenCalledWith({
        where: { checkTypeId: checkLogEntity.checkTypeId }
      })
      expect(result).toEqual([checkLogEntity])
    })
  })

  describe('findByVehicleId', () => {
    it('should find all logs for a vehicle using relation filter', async () => {
      const vehicleId = '550e8400-e29b-41d4-a716-446655440000'
      const checkLogEntity = createMockCheckLogEntity()
      const prismaRecord = createMockPrismaCheckLog()

      mockPrismaService.checkLog.findMany.mockResolvedValue([prismaRecord])

      const result = await repository.findByVehicleId(vehicleId)

      expect(mockPrismaService.checkLog.findMany).toHaveBeenCalledWith({
        where: { checkType: { vehicleId } }
      })
      expect(result).toEqual([checkLogEntity])
    })
  })

  describe('findMostRecentByCheckTypeIds', () => {
    it('should return a Map with most recent log per check type', async () => {
      const checkTypeId1 = '660e8400-e29b-41d4-a716-446655440000'
      const checkTypeId2 = '770e8400-e29b-41d4-a716-446655440000'

      const log1 = createMockPrismaCheckLog({
        id: 'aaa00000-0000-4000-8000-000000000001',
        checkTypeId: checkTypeId1,
        completedAt: '2026-03-15'
      })
      const log2 = createMockPrismaCheckLog({
        id: 'aaa00000-0000-4000-8000-000000000002',
        checkTypeId: checkTypeId1,
        completedAt: '2026-03-20'
      })
      const log3 = createMockPrismaCheckLog({
        id: 'aaa00000-0000-4000-8000-000000000003',
        checkTypeId: checkTypeId2,
        completedAt: '2026-03-18'
      })

      mockPrismaService.checkLog.findMany.mockResolvedValue([log2, log1, log3]) // unordered

      const result = await repository.findMostRecentByCheckTypeIds([checkTypeId1, checkTypeId2])

      expect(mockPrismaService.checkLog.findMany).toHaveBeenCalledWith({
        where: { checkTypeId: { in: [checkTypeId1, checkTypeId2] } },
        orderBy: { completedAt: 'desc' }
      })

      expect(result.size).toBe(2)
      expect(result.get(checkTypeId1)).toEqual(CheckLogInfrastructureMapper.toDomain(log2)) // most recent for checkTypeId1
      expect(result.get(checkTypeId2)).toEqual(CheckLogInfrastructureMapper.toDomain(log3))
    })

    it('should return empty Map when no logs exist', async () => {
      mockPrismaService.checkLog.findMany.mockResolvedValue([])

      const result = await repository.findMostRecentByCheckTypeIds([
        '123e4567-e89b-12d3-a456-426614174000'
      ])

      expect(mockPrismaService.checkLog.findMany).toHaveBeenCalledWith({
        where: { checkTypeId: { in: ['123e4567-e89b-12d3-a456-426614174000'] } },
        orderBy: { completedAt: 'desc' }
      })

      expect(result.size).toBe(0)
    })
  })

  describe('delete', () => {
    it('should delete check log by id', async () => {
      const checkLogId = new CheckLogIdValueObject('123e4567-e89b-12d3-a456-426614174000')

      await repository.delete(checkLogId)

      expect(mockPrismaService.checkLog.delete).toHaveBeenCalledWith({
        where: { id: checkLogId.value }
      })
    })

    it('should throw CheckLogNotFoundException on P2025', async () => {
      const checkLogId = new CheckLogIdValueObject('123e4567-e89b-12d3-a456-426614174000')

      mockPrismaService.checkLog.delete.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '7.0.0'
        })
      )

      await expect(repository.delete(checkLogId)).rejects.toThrow(CheckLogNotFoundException)
    })
  })
})

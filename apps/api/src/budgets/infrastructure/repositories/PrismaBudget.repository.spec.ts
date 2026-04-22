import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { Prisma, BudgetPeriod as PrismaBudgetPeriod } from '@generated'

import { BudgetEntity, BudgetPeriod } from '~/budgets/domain/entities'
import { BudgetNotFoundException } from '~/budgets/domain/exceptions'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { BudgetInfrastructureMapper } from '../mappers'

import { PrismaBudgetRepository } from './PrismaBudget.repository'

describe('PrismaBudgetRepository', () => {
  let repository: PrismaBudgetRepository
  let mockPrismaService: {
    budget: {
      findUnique: Mock<PrismaProvider['budget']['findUnique']>
      upsert: Mock<PrismaProvider['budget']['upsert']>
      delete: Mock<PrismaProvider['budget']['delete']>
    }
  }

  const budgetId = '550e8400-e29b-41d4-a716-446655440000'
  const vehicleId = '660e8400-e29b-41d4-a716-446655440000'

  const makePrismaRecord = (overrides = {}) => ({
    id: budgetId,
    vehicleId,
    amountCents: 20000,
    period: PrismaBudgetPeriod.MONTHLY,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides
  })

  const makeEntity = (overrides?: { amountCents?: number; period?: BudgetPeriod }): BudgetEntity =>
    new BudgetEntity(
      new BudgetIdValueObject(budgetId),
      vehicleId,
      AmountValueObject.fromCents(overrides?.amountCents ?? 20000),
      overrides?.period ?? BudgetPeriod.MONTHLY,
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-01-01T00:00:00Z')
    )

  beforeEach(() => {
    mockPrismaService = {
      budget: {
        findUnique: mock(() => {}) as unknown as Mock<PrismaProvider['budget']['findUnique']>,
        upsert: mock(() => {}) as unknown as Mock<PrismaProvider['budget']['upsert']>,
        delete: mock(() => {}) as unknown as Mock<PrismaProvider['budget']['delete']>
      }
    }
    repository = new PrismaBudgetRepository(mockPrismaService as unknown as PrismaProvider)
  })

  describe('findByVehicleId', () => {
    it('should return null when no record exists for the vehicle', async () => {
      mockPrismaService.budget.findUnique.mockResolvedValue(null)
      const result = await repository.findByVehicleId(vehicleId)

      expect(result).toBeNull()
      expect(mockPrismaService.budget.findUnique).toHaveBeenCalledWith({ where: { vehicleId } })
    })

    it('should return the mapped BudgetEntity when a record exists', async () => {
      const record = makePrismaRecord()

      mockPrismaService.budget.findUnique.mockResolvedValue(record)
      const result = await repository.findByVehicleId(vehicleId)

      expect(result).toBeInstanceOf(BudgetEntity)
      expect(result?.id.value).toBe(budgetId)
      expect(result?.vehicleId).toBe(vehicleId)
      expect(result?.amount.toCents()).toBe(20000)
      expect(result?.period).toBe(BudgetPeriod.MONTHLY)
    })
  })

  describe('save (upsert)', () => {
    it('should call prisma.budget.upsert with where/create/update payload', async () => {
      const entity = makeEntity()
      const expectedData = BudgetInfrastructureMapper.toPrisma(entity)

      mockPrismaService.budget.upsert.mockResolvedValue(makePrismaRecord())
      await repository.save(entity)

      expect(mockPrismaService.budget.upsert).toHaveBeenCalledWith({
        where: { vehicleId },
        update: {
          amountCents: expectedData.amountCents,
          period: expectedData.period,
          updatedAt: expectedData.updatedAt
        },
        create: expectedData
      })
    })

    it('should return the BudgetEntity mapped from the upsert result', async () => {
      const record = makePrismaRecord({ amountCents: 50000, period: PrismaBudgetPeriod.ANNUAL })

      mockPrismaService.budget.upsert.mockResolvedValue(record)
      const result = await repository.save(makeEntity())

      expect(result).toBeInstanceOf(BudgetEntity)
      expect(result?.amount.toCents()).toBe(50000)
      expect(result?.period).toBe(BudgetPeriod.ANNUAL)
    })

    it('should propagate unexpected Prisma errors from upsert', async () => {
      const error = new Error('boom')
      mockPrismaService.budget.upsert.mockRejectedValue(error)

      await expect(repository.save(makeEntity())).rejects.toThrow('boom')
    })
  })

  describe('deleteByVehicleId', () => {
    it('should call prisma.budget.delete with { where: { vehicleId } }', async () => {
      mockPrismaService.budget.delete.mockResolvedValue(makePrismaRecord())
      await repository.deleteByVehicleId(vehicleId)

      expect(mockPrismaService.budget.delete).toHaveBeenCalledWith({ where: { vehicleId } })
    })

    it('should throw BudgetNotFoundException on Prisma P2025 (record not found)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '7.0.0'
      })
      mockPrismaService.budget.delete.mockRejectedValue(prismaError)

      await expect(repository.deleteByVehicleId(vehicleId)).rejects.toBeInstanceOf(
        BudgetNotFoundException
      )
      await expect(repository.deleteByVehicleId(vehicleId)).rejects.toThrow(
        `Budget not found: ${vehicleId}`
      )
    })

    it('should propagate non-P2025 Prisma errors unchanged', async () => {
      const error = new Error('boom')
      mockPrismaService.budget.delete.mockRejectedValue(error)

      await expect(repository.deleteByVehicleId(vehicleId)).rejects.toThrow('boom')
    })
  })
})

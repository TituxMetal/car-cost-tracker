import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { ExpenseCategory as PrismaExpenseCategory, Prisma } from '@generated'

import { ExpenseCategory, ExpenseEntity } from '~/expenses/domain/entities'
import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '~/expenses/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { ExpenseInfrastructureMapper } from '../mappers'

import { PrismaExpenseRepository } from './PrismaExpense.repository'

describe('PrismaExpenseRepository', () => {
  let repository: PrismaExpenseRepository
  let mockPrismaService: {
    expense: {
      create: Mock<PrismaProvider['expense']['create']>
      findUnique: Mock<PrismaProvider['expense']['findUnique']>
      findMany: Mock<PrismaProvider['expense']['findMany']>
      update: Mock<PrismaProvider['expense']['update']>
      delete: Mock<PrismaProvider['expense']['delete']>
    }
  }

  const expenseId = '123e4567-e89b-12d3-a456-426614174000'
  const vehicleId = '550e8400-e29b-41d4-a716-446655440000'

  const createMockPrismaExpense = (overrides = {}) => ({
    id: expenseId,
    vehicleId,
    occurredAt: '2026-03-15',
    amountCents: 8950,
    category: PrismaExpenseCategory.SERVICE,
    description: 'Oil change',
    createdAt: new Date('2026-03-15T10:00:00Z'),
    updatedAt: new Date('2026-03-15T10:00:00Z'),
    ...overrides
  })

  const createMockEntity = () =>
    new ExpenseEntity(
      new ExpenseIdValueObject(expenseId),
      vehicleId,
      new OccurredAtValueObject('2026-03-15'),
      AmountValueObject.fromCents(8950),
      ExpenseCategory.SERVICE,
      'Oil change',
      new Date('2026-03-15T10:00:00Z'),
      new Date('2026-03-15T10:00:00Z')
    )

  beforeEach(() => {
    mockPrismaService = {
      expense: {
        create: mock(() => {}) as unknown as Mock<PrismaProvider['expense']['create']>,
        findUnique: mock(() => {}) as unknown as Mock<PrismaProvider['expense']['findUnique']>,
        findMany: mock(() => {}) as unknown as Mock<PrismaProvider['expense']['findMany']>,
        update: mock(() => {}) as unknown as Mock<PrismaProvider['expense']['update']>,
        delete: mock(() => {}) as unknown as Mock<PrismaProvider['expense']['delete']>
      }
    }

    repository = new PrismaExpenseRepository(mockPrismaService as unknown as PrismaProvider)
  })

  describe('create', () => {
    it('should create expense and return domain entity', async () => {
      const entity = createMockEntity()
      const prismaRecord = createMockPrismaExpense()

      mockPrismaService.expense.create.mockResolvedValue(prismaRecord)

      const result = await repository.create(entity)

      expect(mockPrismaService.expense.create).toHaveBeenCalledWith({
        data: ExpenseInfrastructureMapper.toPrisma(entity)
      })
      expect(result).toEqual(entity)
    })
  })

  describe('findById', () => {
    it('should find expense by id and return domain entity', async () => {
      const entity = createMockEntity()
      mockPrismaService.expense.findUnique.mockResolvedValue(createMockPrismaExpense())

      const result = await repository.findById(entity.id)

      expect(mockPrismaService.expense.findUnique).toHaveBeenCalledWith({
        where: { id: entity.id.value }
      })
      expect(result).toEqual(entity)
    })

    it('should return null when expense not found', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(null)

      const result = await repository.findById(new ExpenseIdValueObject(expenseId))

      expect(result).toBeNull()
    })
  })

  describe('findByVehicleId', () => {
    it('should find expenses for a vehicle ordered by occurredAt desc', async () => {
      const entity = createMockEntity()
      mockPrismaService.expense.findMany.mockResolvedValue([createMockPrismaExpense()])

      const result = await repository.findByVehicleId(vehicleId)

      expect(mockPrismaService.expense.findMany).toHaveBeenCalledWith({
        where: { vehicleId },
        orderBy: { occurredAt: 'desc' }
      })
      expect(result).toEqual([entity])
    })

    it('should return empty array when no expenses exist', async () => {
      mockPrismaService.expense.findMany.mockResolvedValue([])

      const result = await repository.findByVehicleId(vehicleId)

      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update expense and return domain entity', async () => {
      const entity = createMockEntity()
      mockPrismaService.expense.update.mockResolvedValue(createMockPrismaExpense())

      const result = await repository.update(entity)

      expect(mockPrismaService.expense.update).toHaveBeenCalledWith({
        where: { id: entity.id.value },
        data: ExpenseInfrastructureMapper.toPrisma(entity)
      })
      expect(result).toEqual(entity)
    })

    it('should throw ExpenseNotFoundException on P2025', async () => {
      const entity = createMockEntity()
      mockPrismaService.expense.update.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '7.0.0'
        })
      )

      await expect(repository.update(entity)).rejects.toThrow(ExpenseNotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete expense by id', async () => {
      const id = new ExpenseIdValueObject(expenseId)

      await repository.delete(id)

      expect(mockPrismaService.expense.delete).toHaveBeenCalledWith({
        where: { id: id.value }
      })
    })

    it('should throw ExpenseNotFoundException on P2025', async () => {
      const id = new ExpenseIdValueObject(expenseId)

      mockPrismaService.expense.delete.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '7.0.0'
        })
      )

      await expect(repository.delete(id)).rejects.toThrow(ExpenseNotFoundException)
    })
  })
})

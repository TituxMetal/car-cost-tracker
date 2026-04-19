import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { ExpenseCategory, ExpenseEntity } from '~/expenses/domain/entities'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '~/expenses/domain/value-objects'

import { ListExpensesByVehicleUseCase } from './ListExpensesByVehicle.uc'

describe('ListExpensesByVehicleUseCase', () => {
  let useCase: ListExpensesByVehicleUseCase
  let mockRepository: {
    create: Mock<IExpenseRepository['create']>
    findById: Mock<IExpenseRepository['findById']>
    findByVehicleId: Mock<IExpenseRepository['findByVehicleId']>
    update: Mock<IExpenseRepository['update']>
    delete: Mock<IExpenseRepository['delete']>
  }

  const vehicleId = 'vehicle-123'

  const makeEntity = (id: string, occurredAt: string): ExpenseEntity =>
    new ExpenseEntity(
      new ExpenseIdValueObject(id),
      vehicleId,
      new OccurredAtValueObject(occurredAt),
      AmountValueObject.fromCents(8950),
      ExpenseCategory.SERVICE,
      'Oil change',
      new Date(),
      new Date()
    )

  beforeEach(() => {
    mockRepository = {
      create: mock(() => {}) as unknown as Mock<IExpenseRepository['create']>,
      findById: mock(() => {}) as unknown as Mock<IExpenseRepository['findById']>,
      findByVehicleId: mock(() => {}) as unknown as Mock<IExpenseRepository['findByVehicleId']>,
      update: mock(() => {}) as unknown as Mock<IExpenseRepository['update']>,
      delete: mock(() => {}) as unknown as Mock<IExpenseRepository['delete']>
    }
    useCase = new ListExpensesByVehicleUseCase(mockRepository as unknown as IExpenseRepository)
  })

  describe('execute', () => {
    it('should return an empty array when no expenses exist', async () => {
      mockRepository.findByVehicleId.mockResolvedValueOnce([])

      const result = await useCase.execute(vehicleId)

      expect(result).toEqual([])
    })

    it('should preserve the repository ordering (occurredAt desc contract)', async () => {
      const newer = makeEntity('550e8400-e29b-41d4-a716-446655440002', '2026-03-15')
      const middle = makeEntity('550e8400-e29b-41d4-a716-446655440003', '2025-08-01')
      const older = makeEntity('550e8400-e29b-41d4-a716-446655440001', '2025-01-15')

      mockRepository.findByVehicleId.mockResolvedValueOnce([newer, middle, older])

      const result = await useCase.execute(vehicleId)

      expect(result.map(r => r.occurredAt)).toEqual(['2026-03-15', '2025-08-01', '2025-01-15'])
    })

    it('should map each entity to its DTO', async () => {
      const entity = makeEntity('550e8400-e29b-41d4-a716-446655440001', '2026-03-15')
      mockRepository.findByVehicleId.mockResolvedValueOnce([entity])

      const result = await useCase.execute(vehicleId)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('550e8400-e29b-41d4-a716-446655440001')
      expect(result[0].vehicleId).toBe(vehicleId)
      expect(result[0].amountCents).toBe(8950)
    })

    it('should call repository.findByVehicleId with the correct vehicleId', async () => {
      mockRepository.findByVehicleId.mockResolvedValueOnce([])

      await useCase.execute(vehicleId)

      expect(mockRepository.findByVehicleId).toHaveBeenCalledWith(vehicleId)
    })
  })
})

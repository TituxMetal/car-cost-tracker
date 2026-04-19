import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import { CreateExpenseDto, GetExpenseDto, UpdateExpenseDto } from '~/expenses/application/dtos'
import { ExpenseService } from '~/expenses/application/services'
import { ExpenseCategory } from '~/expenses/domain/entities'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

import { ExpenseController } from './Expense.controller'

describe('ExpenseController', () => {
  let controller: ExpenseController
  let mockExpenseService: {
    createExpense: Mock<typeof ExpenseService.prototype.createExpense>
    listExpensesByVehicle: Mock<typeof ExpenseService.prototype.listExpensesByVehicle>
    getExpenseById: Mock<typeof ExpenseService.prototype.getExpenseById>
    updateExpense: Mock<typeof ExpenseService.prototype.updateExpense>
    deleteExpense: Mock<typeof ExpenseService.prototype.deleteExpense>
  }
  let mockVehicleService: {
    getVehicleByUser: Mock<typeof VehicleService.prototype.getVehicleByUser>
  }

  const vehicleId = '123e4567-e89b-12d3-a456-426614174000'
  const userId = '123e4567-e89b-12d3-a456-426614174001'
  const expenseId = '123e4567-e89b-12d3-a456-426614174010'

  const createMockSession = (uid: string): AuthSession => ({
    session: { id: 'session-id', userId: uid, expiresAt: new Date() },
    user: {
      id: uid,
      email: 'test@example.com',
      emailVerified: true,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      banned: false,
      banReason: null,
      banExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const createMockVehicleDto = (overrides = {}): GetVehicleDto => {
    const dto = new GetVehicleDto()
    Object.assign(dto, {
      id: vehicleId,
      userId,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      engineType: 'V6',
      fuelType: 'GASOLINE',
      vin: null,
      licensePlate: 'ABC123',
      purchaseDate: new Date('2025-01-01'),
      mileage: 15000,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    })
    return dto
  }

  const createMockGetExpenseDto = (overrides = {}): GetExpenseDto => {
    const dto = new GetExpenseDto()
    Object.assign(dto, {
      id: expenseId,
      vehicleId,
      occurredAt: '2026-03-15',
      amountCents: 8950,
      category: ExpenseCategory.SERVICE,
      description: 'Oil change',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    })
    return dto
  }

  beforeEach(async () => {
    mockExpenseService = {
      createExpense: mock(() => {}) as unknown as Mock<
        typeof ExpenseService.prototype.createExpense
      >,
      listExpensesByVehicle: mock(() => {}) as unknown as Mock<
        typeof ExpenseService.prototype.listExpensesByVehicle
      >,
      getExpenseById: mock(() => {}) as unknown as Mock<
        typeof ExpenseService.prototype.getExpenseById
      >,
      updateExpense: mock(() => {}) as unknown as Mock<
        typeof ExpenseService.prototype.updateExpense
      >,
      deleteExpense: mock(() => {}) as unknown as Mock<
        typeof ExpenseService.prototype.deleteExpense
      >
    }

    mockVehicleService = {
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >
    }

    const module = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        { provide: ExpenseService, useValue: mockExpenseService },
        { provide: VehicleService, useValue: mockVehicleService }
      ]
    }).compile()

    controller = module.get<ExpenseController>(ExpenseController)
  })

  describe('create', () => {
    it('should create an expense for the vehicle', async () => {
      const createDto = new CreateExpenseDto()
      const expectedExpense = createMockGetExpenseDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockExpenseService.createExpense.mockResolvedValue(expectedExpense)

      const result = await controller.create(session, vehicleId, createDto)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockExpenseService.createExpense).toHaveBeenCalledWith(createDto, vehicleId)
      expect(result).toEqual(expectedExpense)
    })

    it('should throw VehicleNotFoundException when vehicle does not belong to user', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.create(session, vehicleId, new CreateExpenseDto())).rejects.toThrow(
        VehicleNotFoundException
      )
      expect(mockExpenseService.createExpense).not.toHaveBeenCalled()
    })
  })

  describe('getByVehicle', () => {
    it('should return all expenses for the vehicle', async () => {
      const expectedExpenses = [createMockGetExpenseDto()]
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockExpenseService.listExpensesByVehicle.mockResolvedValue(expectedExpenses)

      const result = await controller.getByVehicle(session, vehicleId)

      expect(mockExpenseService.listExpensesByVehicle).toHaveBeenCalledWith(vehicleId)
      expect(result).toEqual(expectedExpenses)
    })
  })

  describe('getOne', () => {
    it('should return a single expense', async () => {
      const expectedExpense = createMockGetExpenseDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockExpenseService.getExpenseById.mockResolvedValue(expectedExpense)

      const result = await controller.getOne(session, vehicleId, expenseId)

      expect(mockExpenseService.getExpenseById).toHaveBeenCalledWith(expenseId, vehicleId)
      expect(result).toEqual(expectedExpense)
    })
  })

  describe('update', () => {
    it('should update an expense', async () => {
      const updateDto = new UpdateExpenseDto()
      Object.assign(updateDto, { description: 'Updated note' })
      const expectedExpense = createMockGetExpenseDto({ description: 'Updated note' })
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockExpenseService.updateExpense.mockResolvedValue(expectedExpense)

      const result = await controller.update(session, vehicleId, expenseId, updateDto)

      expect(mockExpenseService.updateExpense).toHaveBeenCalledWith(expenseId, vehicleId, updateDto)
      expect(result).toEqual(expectedExpense)
    })
  })

  describe('delete', () => {
    it('should delete an expense', async () => {
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockExpenseService.deleteExpense.mockResolvedValue(undefined)

      await controller.delete(session, vehicleId, expenseId)

      expect(mockExpenseService.deleteExpense).toHaveBeenCalledWith(expenseId, vehicleId)
    })

    it('should throw VehicleNotFoundException when vehicle does not belong to user', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.delete(session, vehicleId, expenseId)).rejects.toThrow(
        VehicleNotFoundException
      )
      expect(mockExpenseService.deleteExpense).not.toHaveBeenCalled()
    })
  })

  describe('verifyVehicleOwnership', () => {
    it('should throw VehicleNotFoundException when user has no vehicle', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.getByVehicle(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })

    it('should throw VehicleNotFoundException when vehicle ID does not match', async () => {
      const session = createMockSession(userId)
      const wrongVehicle = createMockVehicleDto({ id: 'different-vehicle-id' })

      mockVehicleService.getVehicleByUser.mockResolvedValue(wrongVehicle)

      await expect(controller.getByVehicle(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })
  })
})

import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { Prisma, FuelType as PrismaFuelType } from '@generated'

import type { PrismaProvider } from '~/shared/infrastructure/database'
import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import {
  VehicleAlreadyExistsException,
  VehicleNotFoundException
} from '~/vehicles/domain/exceptions'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { VehicleInfrastructureMapper } from '../mappers'

import { PrismaVehicleRepository } from './PrismaVehicle.repository'

describe('PrismaVehicleRepository', () => {
  let repository: PrismaVehicleRepository
  let mockPrismaService: {
    vehicle: {
      create: Mock<PrismaProvider['vehicle']['create']>
      findUnique: Mock<PrismaProvider['vehicle']['findUnique']>
      findMany: Mock<PrismaProvider['vehicle']['findMany']>
      findFirst: Mock<PrismaProvider['vehicle']['findFirst']>
      update: Mock<PrismaProvider['vehicle']['update']>
      delete: Mock<PrismaProvider['vehicle']['delete']>
    }
  }

  const createMockPrismaVehicle = (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    engineType: 'V6',
    fuelType: PrismaFuelType.GASOLINE,
    vin: '1HGCM82633A004352',
    licensePlate: 'ABC123',
    purchaseDate: new Date('2025-01-01T00:00:00Z'),
    mileage: 15000,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    ...overrides
  })

  const createMockVehicleEntity = () =>
    new VehicleEntity(
      new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
      '123e4567-e89b-12d3-a456-426614174001',
      'Toyota',
      'Camry',
      new YearValueObject(2020),
      'V6',
      FuelType.GASOLINE,
      new VinValueObject('1HGCM82633A004352'),
      'ABC123',
      new Date('2025-01-01T00:00:00Z'),
      new MileageValueObject(15000),
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-01-02T00:00:00Z')
    )

  beforeEach(() => {
    mockPrismaService = {
      vehicle: {
        create: mock(() => {}) as unknown as Mock<PrismaProvider['vehicle']['create']>,
        findUnique: mock(() => {}) as unknown as Mock<PrismaProvider['vehicle']['findUnique']>,
        findMany: mock(() => {}) as unknown as Mock<PrismaProvider['vehicle']['findMany']>,
        findFirst: mock(() => {}) as unknown as Mock<PrismaProvider['vehicle']['findFirst']>,
        update: mock(() => {}) as unknown as Mock<PrismaProvider['vehicle']['update']>,
        delete: mock(() => {}) as unknown as Mock<PrismaProvider['vehicle']['delete']>
      }
    }

    repository = new PrismaVehicleRepository(mockPrismaService as unknown as PrismaProvider)
  })

  describe('create', () => {
    it('should create vehicle and return domain entity', async () => {
      const vehicleEntity = createMockVehicleEntity()
      const prismaVehicle = createMockPrismaVehicle()

      mockPrismaService.vehicle.create.mockResolvedValue(prismaVehicle)

      const result = await repository.create(vehicleEntity)

      expect(mockPrismaService.vehicle.create).toHaveBeenCalledWith({
        data: VehicleInfrastructureMapper.toPrisma(vehicleEntity)
      })
      expect(result).toEqual(VehicleInfrastructureMapper.toDomain(prismaVehicle))
    })

    it('should throw VehicleAlreadyExistsException on unique constraint violation', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.0.0'
      })

      mockPrismaService.vehicle.create.mockRejectedValue(prismaError)

      await expect(repository.create(createMockVehicleEntity())).rejects.toThrow(
        VehicleAlreadyExistsException
      )
    })
  })

  describe('findById', () => {
    it('should find vehicle by id and return domain entity', async () => {
      const vehicleId = new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const prismaVehicle = createMockPrismaVehicle()

      mockPrismaService.vehicle.findUnique.mockResolvedValue(prismaVehicle)

      const result = await repository.findById(vehicleId)

      expect(mockPrismaService.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId.value }
      })
      expect(result).toEqual(VehicleInfrastructureMapper.toDomain(prismaVehicle))
    })

    it('should return null when vehicle not found', async () => {
      const vehicleId = new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000')

      mockPrismaService.vehicle.findUnique.mockResolvedValue(null)

      const result = await repository.findById(vehicleId)

      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should find all vehicles for user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174001'
      const prismaVehicles = [
        createMockPrismaVehicle(),
        createMockPrismaVehicle({ id: '123e4567-e89b-12d3-a456-426614174002' })
      ]

      mockPrismaService.vehicle.findMany.mockResolvedValue(prismaVehicles)

      const result = await repository.findByUserId(userId)

      expect(mockPrismaService.vehicle.findMany).toHaveBeenCalledWith({
        where: { userId }
      })
      expect(result).toEqual(prismaVehicles.map(VehicleInfrastructureMapper.toDomain))
    })

    it('should return empty array when user has no vehicles', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174001'

      mockPrismaService.vehicle.findMany.mockResolvedValue([])

      const result = await repository.findByUserId(userId)

      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update vehicle and return domain entity', async () => {
      const vehicleEntity = createMockVehicleEntity()
      const updatedPrismaVehicle = createMockPrismaVehicle({ make: 'Honda' })

      mockPrismaService.vehicle.update.mockResolvedValue(updatedPrismaVehicle)

      const result = await repository.update(vehicleEntity)

      expect(mockPrismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: vehicleEntity.id.value },
        data: VehicleInfrastructureMapper.toPrisma(vehicleEntity)
      })
      expect(result).toEqual(VehicleInfrastructureMapper.toDomain(updatedPrismaVehicle))
    })

    it('should throw VehicleNotFoundException when vehicle does not exist', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '7.0.0'
      })

      mockPrismaService.vehicle.update.mockRejectedValue(prismaError)

      await expect(repository.update(createMockVehicleEntity())).rejects.toThrow(
        VehicleNotFoundException
      )
    })
  })

  describe('delete', () => {
    it('should delete vehicle by id', async () => {
      const vehicleId = new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const deletedVehicle = createMockPrismaVehicle({ id: vehicleId.value })

      mockPrismaService.vehicle.delete.mockResolvedValue(deletedVehicle)

      await repository.delete(vehicleId)

      expect(mockPrismaService.vehicle.delete).toHaveBeenCalledWith({
        where: { id: vehicleId.value }
      })
    })

    it('should throw VehicleNotFoundException when vehicle does not exist', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '7.0.0'
      })

      mockPrismaService.vehicle.delete.mockRejectedValue(prismaError)

      await expect(
        repository.delete(new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000'))
      ).rejects.toThrow(VehicleNotFoundException)
    })
  })

  describe('existsForUser', () => {
    it('should return true when vehicle exists for user', async () => {
      const vehicleId = new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const userId = '123e4567-e89b-12d3-a456-426614174001'
      const foundVehicle = createMockPrismaVehicle({ id: vehicleId.value, userId })

      mockPrismaService.vehicle.findFirst.mockResolvedValue(foundVehicle)

      const result = await repository.existsForUser(vehicleId, userId)

      expect(mockPrismaService.vehicle.findFirst).toHaveBeenCalledWith({
        where: { id: vehicleId.value, userId }
      })
      expect(result).toBe(true)
    })

    it('should return false when vehicle does not exist for user', async () => {
      const vehicleId = new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const userId = '123e4567-e89b-12d3-a456-426614174001'

      mockPrismaService.vehicle.findFirst.mockResolvedValue(null)

      const result = await repository.existsForUser(vehicleId, userId)

      expect(mockPrismaService.vehicle.findFirst).toHaveBeenCalledWith({
        where: { id: vehicleId.value, userId }
      })
      expect(result).toBe(false)
    })
  })
})

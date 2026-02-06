import { Injectable } from '@nestjs/common'

import { Prisma } from '@generated'

import type { PrismaProvider } from '~/shared/infrastructure/database'
import type { VehicleEntity } from '~/vehicles/domain/entities'
import {
  VehicleAlreadyExistsException,
  VehicleNotFoundException
} from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import type { VehicleIdValueObject } from '~/vehicles/domain/value-objects'

import { VehicleInfrastructureMapper } from '../mappers'

@Injectable()
export class PrismaVehicleRepository implements IVehicleRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(vehicle: VehicleEntity): Promise<VehicleEntity> {
    try {
      const prismaVehicle = await this.prisma.vehicle.create({
        data: VehicleInfrastructureMapper.toPrisma(vehicle)
      })

      return VehicleInfrastructureMapper.toDomain(prismaVehicle)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new VehicleAlreadyExistsException('A vehicle with the same VIN already exists.')
        }
      }

      throw error
    }
  }

  async findById(vehicleId: VehicleIdValueObject): Promise<VehicleEntity | null> {
    const prismaVehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId.value }
    })

    return prismaVehicle ? VehicleInfrastructureMapper.toDomain(prismaVehicle) : null
  }

  async findByUserId(userId: string): Promise<VehicleEntity[]> {
    const prismaVehicles = await this.prisma.vehicle.findMany({
      where: { userId }
    })

    return prismaVehicles.map(VehicleInfrastructureMapper.toDomain)
  }

  async update(vehicle: VehicleEntity): Promise<VehicleEntity> {
    try {
      const prismaVehicle = await this.prisma.vehicle.update({
        where: { id: vehicle.id.value },
        data: VehicleInfrastructureMapper.toPrisma(vehicle)
      })

      return VehicleInfrastructureMapper.toDomain(prismaVehicle)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new VehicleNotFoundException(`Vehicle with ID ${vehicle.id.value} not found.`)
        }
      }

      throw error
    }
  }

  async delete(vehicleId: VehicleIdValueObject): Promise<void> {
    try {
      await this.prisma.vehicle.delete({
        where: { id: vehicleId.value }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new VehicleNotFoundException(`Vehicle with ID ${vehicleId.value} not found.`)
        }
      }

      throw error
    }
  }

  async existsForUser(vehicleId: VehicleIdValueObject, userId: string): Promise<boolean> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId.value, userId }
    })

    return vehicle !== null
  }
}

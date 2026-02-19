import { Injectable } from '@nestjs/common'

import { Prisma } from '@generated'

import type { CheckTypeEntity } from '~/check-types/domain/entities'
import {
  CheckTypeAlreadyExistsException,
  CheckTypeNotFoundException
} from '~/check-types/domain/exceptions'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import type { CheckTypeIdValueObject } from '~/check-types/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { CheckTypeInfrastructureMapper } from '../mappers'

@Injectable()
export class PrismaCheckTypeRepository implements ICheckTypeRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(checkType: CheckTypeEntity): Promise<CheckTypeEntity> {
    try {
      const prismaCheckType = await this.prisma.checkType.create({
        data: CheckTypeInfrastructureMapper.toPrisma(checkType)
      })

      return CheckTypeInfrastructureMapper.toDomain(prismaCheckType)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new CheckTypeAlreadyExistsException(checkType.name.value)
        }
      }

      throw error
    }
  }

  async findById(id: CheckTypeIdValueObject): Promise<CheckTypeEntity | null> {
    const prismaCheckType = await this.prisma.checkType.findUnique({
      where: { id: id.value }
    })

    return prismaCheckType ? CheckTypeInfrastructureMapper.toDomain(prismaCheckType) : null
  }

  async findByVehicleId(vehicleId: string): Promise<CheckTypeEntity[]> {
    const prismaCheckTypes = await this.prisma.checkType.findMany({
      where: { vehicleId }
    })

    return prismaCheckTypes.map(CheckTypeInfrastructureMapper.toDomain)
  }

  async update(checkType: CheckTypeEntity): Promise<CheckTypeEntity> {
    try {
      const prismaCheckType = await this.prisma.checkType.update({
        where: { id: checkType.id.value },
        data: CheckTypeInfrastructureMapper.toPrisma(checkType)
      })

      return CheckTypeInfrastructureMapper.toDomain(prismaCheckType)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new CheckTypeNotFoundException(checkType.id.value)
        }
      }

      throw error
    }
  }

  async delete(id: CheckTypeIdValueObject): Promise<void> {
    try {
      await this.prisma.checkType.delete({
        where: { id: id.value }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new CheckTypeNotFoundException(id.value)
        }
      }

      throw error
    }
  }

  async existsByNameAndVehicle(name: string, vehicleId: string): Promise<boolean> {
    const existingCheckType = await this.prisma.checkType.findFirst({
      where: { name, vehicleId }
    })

    return existingCheckType !== null
  }
}

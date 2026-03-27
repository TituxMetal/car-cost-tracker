import { Injectable } from '@nestjs/common'

import { Prisma } from '@generated'

import type { CheckLogEntity } from '~/check-logs/domain/entities'
import { CheckLogNotFoundException } from '~/check-logs/domain/exceptions'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import type { CheckLogIdValueObject } from '~/check-logs/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { CheckLogInfrastructureMapper } from '../mappers'

@Injectable()
export class PrismaCheckLogRepository implements ICheckLogRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(checkLog: CheckLogEntity): Promise<CheckLogEntity> {
    const prismaCheckLog = await this.prisma.checkLog.create({
      data: CheckLogInfrastructureMapper.toPrisma(checkLog)
    })

    return CheckLogInfrastructureMapper.toDomain(prismaCheckLog)
  }

  async findById(id: CheckLogIdValueObject): Promise<CheckLogEntity | null> {
    const prismaCheckLog = await this.prisma.checkLog.findUnique({
      where: { id: id.value }
    })

    return prismaCheckLog ? CheckLogInfrastructureMapper.toDomain(prismaCheckLog) : null
  }

  async findByCheckTypeId(checkTypeId: string): Promise<CheckLogEntity[]> {
    const prismaCheckLogs = await this.prisma.checkLog.findMany({
      where: { checkTypeId }
    })

    return prismaCheckLogs.map(CheckLogInfrastructureMapper.toDomain)
  }

  async findByVehicleId(vehicleId: string): Promise<CheckLogEntity[]> {
    const prismaCheckLogs = await this.prisma.checkLog.findMany({
      where: { checkType: { vehicleId } }
    })

    return prismaCheckLogs.map(CheckLogInfrastructureMapper.toDomain)
  }

  async findMostRecentByCheckTypeIds(checkTypeIds: string[]): Promise<Map<string, CheckLogEntity>> {
    const prismaCheckLogs = await this.prisma.checkLog.findMany({
      where: { checkTypeId: { in: checkTypeIds } },
      orderBy: { completedAt: 'desc' }
    })

    const map = new Map<string, CheckLogEntity>()

    for (const log of prismaCheckLogs) {
      if (!map.has(log.checkTypeId)) {
        map.set(log.checkTypeId, CheckLogInfrastructureMapper.toDomain(log))
      }
    }

    return map
  }

  async delete(id: CheckLogIdValueObject): Promise<void> {
    try {
      await this.prisma.checkLog.delete({
        where: { id: id.value }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new CheckLogNotFoundException(id.value)
        }
      }

      throw error
    }
  }
}

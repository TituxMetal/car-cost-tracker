import { Injectable } from '@nestjs/common'

import { Prisma } from '@generated'

import type { BudgetEntity } from '~/budgets/domain/entities'
import { BudgetNotFoundException } from '~/budgets/domain/exceptions'
import type { IBudgetRepository } from '~/budgets/domain/repositories'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { BudgetInfrastructureMapper } from '../mappers'

@Injectable()
export class PrismaBudgetRepository implements IBudgetRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async findByVehicleId(vehicleId: string): Promise<BudgetEntity | null> {
    const record = await this.prisma.budget.findUnique({ where: { vehicleId } })

    return record ? BudgetInfrastructureMapper.toDomain(record) : null
  }

  async save(budget: BudgetEntity): Promise<BudgetEntity> {
    const data = BudgetInfrastructureMapper.toPrisma(budget)
    const record = await this.prisma.budget.upsert({
      where: { vehicleId: data.vehicleId },
      update: {
        amountCents: data.amountCents,
        period: data.period,
        updatedAt: data.updatedAt
      },
      create: data
    })

    return BudgetInfrastructureMapper.toDomain(record)
  }

  async deleteByVehicleId(vehicleId: string): Promise<void> {
    try {
      await this.prisma.budget.delete({ where: { vehicleId } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new BudgetNotFoundException(vehicleId)
      }
      throw error
    }
  }
}

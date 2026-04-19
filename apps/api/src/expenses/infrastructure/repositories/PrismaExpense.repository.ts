import { Injectable } from '@nestjs/common'

import { Prisma } from '@generated'

import type { ExpenseEntity } from '~/expenses/domain/entities'
import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import type { ExpenseIdValueObject } from '~/expenses/domain/value-objects'
import type { PrismaProvider } from '~/shared/infrastructure/database'

import { ExpenseInfrastructureMapper } from '../mappers'

@Injectable()
export class PrismaExpenseRepository implements IExpenseRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(expense: ExpenseEntity): Promise<ExpenseEntity> {
    const prismaExpense = await this.prisma.expense.create({
      data: ExpenseInfrastructureMapper.toPrisma(expense)
    })

    return ExpenseInfrastructureMapper.toDomain(prismaExpense)
  }

  async findById(id: ExpenseIdValueObject): Promise<ExpenseEntity | null> {
    const prismaExpense = await this.prisma.expense.findUnique({
      where: { id: id.value }
    })

    return prismaExpense ? ExpenseInfrastructureMapper.toDomain(prismaExpense) : null
  }

  async findByVehicleId(vehicleId: string): Promise<ExpenseEntity[]> {
    const prismaExpenses = await this.prisma.expense.findMany({
      where: { vehicleId },
      orderBy: { occurredAt: 'desc' }
    })

    return prismaExpenses.map(ExpenseInfrastructureMapper.toDomain)
  }

  async update(expense: ExpenseEntity): Promise<ExpenseEntity> {
    try {
      const prismaExpense = await this.prisma.expense.update({
        where: { id: expense.id.value },
        data: ExpenseInfrastructureMapper.toPrisma(expense)
      })

      return ExpenseInfrastructureMapper.toDomain(prismaExpense)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ExpenseNotFoundException(expense.id.value)
      }

      throw error
    }
  }

  async delete(id: ExpenseIdValueObject): Promise<void> {
    try {
      await this.prisma.expense.delete({
        where: { id: id.value }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ExpenseNotFoundException(id.value)
      }

      throw error
    }
  }
}

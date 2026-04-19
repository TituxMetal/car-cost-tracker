import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaProvider } from '~/shared/infrastructure/database'
import { VehiclesModule } from '~/vehicles/Vehicles.module'

import { ExpenseService } from './application/services'
import {
  CreateExpenseUseCase,
  DeleteExpenseUseCase,
  GetExpenseByIdUseCase,
  ListExpensesByVehicleUseCase,
  UpdateExpenseUseCase
} from './application/use-cases'
import type { IExpenseRepository } from './domain/repositories'
import { ExpenseController } from './infrastructure/controllers'
import { PrismaExpenseRepository } from './infrastructure/repositories'

@Module({
  imports: [AuthModule, VehiclesModule],
  controllers: [ExpenseController],
  providers: [
    {
      provide: 'IExpenseRepository',
      useFactory: (prisma: PrismaProvider) => new PrismaExpenseRepository(prisma),
      inject: [PrismaProvider]
    },
    {
      provide: CreateExpenseUseCase,
      useFactory: (repo: IExpenseRepository) => new CreateExpenseUseCase(repo),
      inject: ['IExpenseRepository']
    },
    {
      provide: ListExpensesByVehicleUseCase,
      useFactory: (repo: IExpenseRepository) => new ListExpensesByVehicleUseCase(repo),
      inject: ['IExpenseRepository']
    },
    {
      provide: GetExpenseByIdUseCase,
      useFactory: (repo: IExpenseRepository) => new GetExpenseByIdUseCase(repo),
      inject: ['IExpenseRepository']
    },
    {
      provide: UpdateExpenseUseCase,
      useFactory: (repo: IExpenseRepository) => new UpdateExpenseUseCase(repo),
      inject: ['IExpenseRepository']
    },
    {
      provide: DeleteExpenseUseCase,
      useFactory: (repo: IExpenseRepository) => new DeleteExpenseUseCase(repo),
      inject: ['IExpenseRepository']
    },
    ExpenseService
  ],
  exports: [ExpenseService]
})
export class ExpensesModule {}

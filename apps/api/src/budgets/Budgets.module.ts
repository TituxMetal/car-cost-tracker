import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaProvider } from '~/shared/infrastructure/database'
import { VehicleService } from '~/vehicles/application/services'
import { VehiclesModule } from '~/vehicles/Vehicles.module'

import { BudgetService } from './application/services'
import {
  DeleteBudgetUseCase,
  GetBudgetByVehicleUseCase,
  UpsertBudgetUseCase
} from './application/use-cases'
import type { IBudgetRepository } from './domain/repositories'
import { BudgetController } from './infrastructure/controllers'
import { PrismaBudgetRepository } from './infrastructure/repositories'

@Module({
  imports: [AuthModule, VehiclesModule],
  controllers: [BudgetController],
  providers: [
    {
      provide: 'IBudgetRepository',
      useFactory: (prisma: PrismaProvider) => new PrismaBudgetRepository(prisma),
      inject: [PrismaProvider]
    },
    {
      provide: GetBudgetByVehicleUseCase,
      useFactory: (repo: IBudgetRepository, vehicleService: VehicleService) =>
        new GetBudgetByVehicleUseCase(repo, vehicleService),
      inject: ['IBudgetRepository', VehicleService]
    },
    {
      provide: UpsertBudgetUseCase,
      useFactory: (repo: IBudgetRepository, vehicleService: VehicleService) =>
        new UpsertBudgetUseCase(repo, vehicleService),
      inject: ['IBudgetRepository', VehicleService]
    },
    {
      provide: DeleteBudgetUseCase,
      useFactory: (repo: IBudgetRepository, vehicleService: VehicleService) =>
        new DeleteBudgetUseCase(repo, vehicleService),
      inject: ['IBudgetRepository', VehicleService]
    },
    BudgetService
  ],
  exports: [BudgetService]
})
export class BudgetsModule {}

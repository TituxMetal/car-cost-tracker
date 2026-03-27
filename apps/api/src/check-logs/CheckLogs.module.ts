import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { CheckTypeService } from '~/check-types/application/services'
import { CheckTypesModule } from '~/check-types/CheckTypes.module'
import { PrismaProvider } from '~/shared/infrastructure/database'
import { VehiclesModule } from '~/vehicles/Vehicles.module'

import { CheckLogService } from './application/services'
import {
  CreateCheckLogUseCase,
  DeleteCheckLogUseCase,
  GetCheckLogUseCase,
  GetCheckStatusSummaryUseCase,
  ListCheckLogsByVehicleUseCase
} from './application/use-cases'
import type { ICheckLogRepository } from './domain/repositories'
import { CheckLogController, CheckStatusController } from './infrastructure/controllers'
import { PrismaCheckLogRepository } from './infrastructure/repositories'

@Module({
  imports: [AuthModule, VehiclesModule, CheckTypesModule],
  controllers: [CheckLogController, CheckStatusController],
  providers: [
    {
      provide: 'ICheckLogRepository',
      useFactory: (prisma: PrismaProvider) => new PrismaCheckLogRepository(prisma),
      inject: [PrismaProvider]
    },
    {
      provide: CreateCheckLogUseCase,
      useFactory: (checkLogRepository: ICheckLogRepository, checkTypeService: CheckTypeService) =>
        new CreateCheckLogUseCase(checkLogRepository, checkTypeService),
      inject: ['ICheckLogRepository', CheckTypeService]
    },
    {
      provide: ListCheckLogsByVehicleUseCase,
      useFactory: (checkLogRepository: ICheckLogRepository, checkTypeService: CheckTypeService) =>
        new ListCheckLogsByVehicleUseCase(checkLogRepository, checkTypeService),
      inject: ['ICheckLogRepository', CheckTypeService]
    },
    {
      provide: GetCheckLogUseCase,
      useFactory: (checkLogRepository: ICheckLogRepository, checkTypeService: CheckTypeService) =>
        new GetCheckLogUseCase(checkLogRepository, checkTypeService),
      inject: ['ICheckLogRepository', CheckTypeService]
    },
    {
      provide: DeleteCheckLogUseCase,
      useFactory: (checkLogRepository: ICheckLogRepository, checkTypeService: CheckTypeService) =>
        new DeleteCheckLogUseCase(checkLogRepository, checkTypeService),
      inject: ['ICheckLogRepository', CheckTypeService]
    },
    {
      provide: GetCheckStatusSummaryUseCase,
      useFactory: (checkLogRepository: ICheckLogRepository, checkTypeService: CheckTypeService) =>
        new GetCheckStatusSummaryUseCase(checkLogRepository, checkTypeService),
      inject: ['ICheckLogRepository', CheckTypeService]
    },
    CheckLogService
  ],
  exports: [CheckLogService]
})
export class CheckLogsModule {}

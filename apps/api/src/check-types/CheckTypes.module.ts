import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaProvider } from '~/shared/infrastructure/database'
import { VehiclesModule } from '~/vehicles/Vehicles.module'

import { CheckTypeService } from './application/services'
import {
  CreateCheckTypeUseCase,
  DeleteCheckTypeUseCase,
  GetCheckTypesByVehicleUseCase,
  GetCheckTypeUseCase,
  UpdateCheckTypeUseCase
} from './application/use-cases'
import type { ICheckTypeRepository } from './domain/repositories'
import { CheckTypeController } from './infrastructure/controllers'
import { PrismaCheckTypeRepository } from './infrastructure/repositories'

@Module({
  imports: [AuthModule, VehiclesModule],
  controllers: [CheckTypeController],
  providers: [
    {
      provide: 'ICheckTypeRepository',
      useFactory: (prisma: PrismaProvider) => new PrismaCheckTypeRepository(prisma),
      inject: [PrismaProvider]
    },
    {
      provide: CreateCheckTypeUseCase,
      useFactory: (checkTypeRepository: ICheckTypeRepository) =>
        new CreateCheckTypeUseCase(checkTypeRepository),
      inject: ['ICheckTypeRepository']
    },
    {
      provide: GetCheckTypesByVehicleUseCase,
      useFactory: (checkTypeRepository: ICheckTypeRepository) =>
        new GetCheckTypesByVehicleUseCase(checkTypeRepository),
      inject: ['ICheckTypeRepository']
    },
    {
      provide: GetCheckTypeUseCase,
      useFactory: (checkTypeRepository: ICheckTypeRepository) =>
        new GetCheckTypeUseCase(checkTypeRepository),
      inject: ['ICheckTypeRepository']
    },
    {
      provide: UpdateCheckTypeUseCase,
      useFactory: (checkTypeRepository: ICheckTypeRepository) =>
        new UpdateCheckTypeUseCase(checkTypeRepository),
      inject: ['ICheckTypeRepository']
    },
    {
      provide: DeleteCheckTypeUseCase,
      useFactory: (checkTypeRepository: ICheckTypeRepository) =>
        new DeleteCheckTypeUseCase(checkTypeRepository),
      inject: ['ICheckTypeRepository']
    },
    CheckTypeService
  ],
  exports: [CheckTypeService]
})
export class CheckTypesModule {}

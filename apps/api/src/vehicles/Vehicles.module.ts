import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaProvider } from '~/shared/infrastructure/database'

import { VehicleService } from './application/services'
import {
  CreateVehicleUseCase,
  DeleteVehicleUseCase,
  GetVehicleByUserUseCase,
  UpdateMileageUseCase,
  UpdateVehicleUseCase
} from './application/use-cases'
import type { IVehicleRepository } from './domain/repositories'
import { VehicleController } from './infrastructure/controllers'
import { PrismaVehicleRepository } from './infrastructure/repositories'

@Module({
  imports: [AuthModule],
  controllers: [VehicleController],
  providers: [
    {
      provide: 'IVehicleRepository',
      useFactory: (prisma: PrismaProvider) => new PrismaVehicleRepository(prisma),
      inject: [PrismaProvider]
    },
    {
      provide: GetVehicleByUserUseCase,
      useFactory: (vehicleRepository: IVehicleRepository) =>
        new GetVehicleByUserUseCase(vehicleRepository),
      inject: ['IVehicleRepository']
    },
    {
      provide: CreateVehicleUseCase,
      useFactory: (vehicleRepository: IVehicleRepository) =>
        new CreateVehicleUseCase(vehicleRepository),
      inject: ['IVehicleRepository']
    },
    {
      provide: UpdateVehicleUseCase,
      useFactory: (vehicleRepository: IVehicleRepository) =>
        new UpdateVehicleUseCase(vehicleRepository),
      inject: ['IVehicleRepository']
    },
    {
      provide: UpdateMileageUseCase,
      useFactory: (vehicleRepository: IVehicleRepository) =>
        new UpdateMileageUseCase(vehicleRepository),
      inject: ['IVehicleRepository']
    },
    {
      provide: DeleteVehicleUseCase,
      useFactory: (vehicleRepository: IVehicleRepository) =>
        new DeleteVehicleUseCase(vehicleRepository),
      inject: ['IVehicleRepository']
    },
    VehicleService
  ],
  exports: [VehicleService]
})
export class VehiclesModule {}

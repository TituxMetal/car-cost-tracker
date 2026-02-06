import type { Vehicle as PrismaVehicle } from '@generated'

import type { FuelType } from '~/vehicles/domain/entities'
import { VehicleEntity } from '~/vehicles/domain/entities'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

export class VehicleInfrastructureMapper {
  static toDomain(prismaVehicle: PrismaVehicle): VehicleEntity {
    const vehicleEntity = new VehicleEntity(
      new VehicleIdValueObject(prismaVehicle.id),
      prismaVehicle.userId,
      prismaVehicle.make,
      prismaVehicle.model,
      new YearValueObject(prismaVehicle.year),
      prismaVehicle.engineType,
      prismaVehicle.fuelType as FuelType,
      prismaVehicle.vin ? new VinValueObject(prismaVehicle.vin) : null,
      prismaVehicle.licensePlate,
      prismaVehicle.purchaseDate,
      new MileageValueObject(prismaVehicle.mileage),
      prismaVehicle.createdAt,
      prismaVehicle.updatedAt
    )

    return vehicleEntity
  }

  static toPrisma(vehicleEntity: VehicleEntity): Omit<PrismaVehicle, 'user'> {
    const prismaVehicle: Omit<PrismaVehicle, 'user'> = {
      id: vehicleEntity.id.value,
      userId: vehicleEntity.userId,
      make: vehicleEntity.make,
      model: vehicleEntity.model,
      year: vehicleEntity.year.value,
      engineType: vehicleEntity.engineType,
      fuelType: vehicleEntity.fuelType as PrismaVehicle['fuelType'],
      vin: vehicleEntity.vin ? vehicleEntity.vin.value : null,
      licensePlate: vehicleEntity.licensePlate,
      purchaseDate: vehicleEntity.purchaseDate,
      mileage: vehicleEntity.mileage.value,
      createdAt: vehicleEntity.createdAt,
      updatedAt: vehicleEntity.updatedAt
    }

    return prismaVehicle
  }
}

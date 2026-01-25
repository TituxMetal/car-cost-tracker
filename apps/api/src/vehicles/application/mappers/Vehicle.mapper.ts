import type { VehicleEntity } from '~/vehicles/domain/entities'

import { GetVehicleDto } from '../dtos/GetVehicle.dto'

export class VehicleMapper {
  static toGetVehicleDto(entity: VehicleEntity): GetVehicleDto {
    const dto: GetVehicleDto = {
      id: entity.id.value,
      userId: entity.userId,
      make: entity.make,
      model: entity.model,
      year: entity.year.value,
      engineType: entity.engineType,
      fuelType: entity.fuelType,
      vin: entity.vin?.value ?? null,
      licensePlate: entity.licensePlate,
      purchaseDate: entity.purchaseDate,
      mileage: entity.mileage.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }

    return Object.assign(new GetVehicleDto(), dto)
  }
}

import { Injectable } from '@nestjs/common'

import type { GetVehicleDto, UpdateVehicleDto } from '~/vehicles/application/dtos'
import { VehicleMapper } from '~/vehicles/application/mappers'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import {
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

@Injectable()
export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(vehicleId: string, userId: string, dto: UpdateVehicleDto): Promise<GetVehicleDto> {
    const vehicleIdVO = new VehicleIdValueObject(vehicleId)
    const existingVehicle = await this.vehicleRepository.existsForUser(vehicleIdVO, userId)

    if (!existingVehicle) {
      throw new VehicleNotFoundException('Vehicle not found for the user')
    }

    const vehicleEntity = await this.vehicleRepository.findById(vehicleIdVO)

    if (!vehicleEntity) {
      throw new VehicleNotFoundException('Vehicle not found')
    }

    vehicleEntity.updateDetails(
      dto.make ? dto.make : undefined,
      dto.model ? dto.model : undefined,
      dto.year ? new YearValueObject(dto.year) : undefined,
      dto.engineType ? dto.engineType : null,
      dto.fuelType ? dto.fuelType : null,
      dto.vin ? new VinValueObject(dto.vin) : null,
      dto.licensePlate ? dto.licensePlate : null,
      dto.purchaseDate ? new Date(dto.purchaseDate) : null
    )

    const updatedEntity = await this.vehicleRepository.update(vehicleEntity)

    return VehicleMapper.toGetVehicleDto(updatedEntity)
  }
}

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
    const vehicleEntity = await this.vehicleRepository.findById(vehicleIdVO)

    if (!vehicleEntity || vehicleEntity.userId !== userId) {
      throw new VehicleNotFoundException('Vehicle not found for the user')
    }

    vehicleEntity.updateDetails(
      dto.make,
      dto.model,
      dto.year !== undefined ? new YearValueObject(dto.year) : undefined,
      dto.engineType,
      dto.fuelType,
      dto.vin !== undefined ? new VinValueObject(dto.vin) : undefined,
      dto.licensePlate,
      dto.purchaseDate !== undefined ? new Date(dto.purchaseDate) : undefined
    )

    const updatedEntity = await this.vehicleRepository.update(vehicleEntity)

    return VehicleMapper.toGetVehicleDto(updatedEntity)
  }
}

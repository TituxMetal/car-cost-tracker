import { Injectable } from '@nestjs/common'

import type { CreateVehicleDto, GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleMapper } from '~/vehicles/application/mappers'
import { VehicleEntity } from '~/vehicles/domain/entities'
import { VehicleAlreadyExistsException } from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

@Injectable()
export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(dto: CreateVehicleDto, userId: string): Promise<GetVehicleDto> {
    const existingVehicles = await this.vehicleRepository.findByUserId(userId)

    if (existingVehicles.length > 0) {
      throw new VehicleAlreadyExistsException('User already has a vehicle')
    }

    const vehicle = new VehicleEntity(
      VehicleIdValueObject.generate(),
      userId,
      dto.make,
      dto.model,
      new YearValueObject(dto.year),
      dto.engineType ?? null,
      dto.fuelType ?? null,
      dto.vin !== undefined ? new VinValueObject(dto.vin) : null,
      dto.licensePlate ?? null,
      dto.purchaseDate !== undefined ? new Date(dto.purchaseDate) : null,
      dto.mileage !== undefined ? new MileageValueObject(dto.mileage) : new MileageValueObject(0),
      new Date(),
      new Date()
    )
    const createdEntity = await this.vehicleRepository.create(vehicle)

    return VehicleMapper.toGetVehicleDto(createdEntity)
  }
}

import { Injectable } from '@nestjs/common'

import type { GetVehicleDto, UpdateMileageDto } from '~/vehicles/application/dtos'
import { VehicleMapper } from '~/vehicles/application/mappers'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import { MileageValueObject, VehicleIdValueObject } from '~/vehicles/domain/value-objects'

@Injectable()
export class UpdateMileageUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(vehicleId: string, userId: string, dto: UpdateMileageDto): Promise<GetVehicleDto> {
    const vehicleIdVO = new VehicleIdValueObject(vehicleId)
    const vehicleEntity = await this.vehicleRepository.findById(vehicleIdVO)

    if (!vehicleEntity || vehicleEntity.userId !== userId) {
      throw new VehicleNotFoundException('Vehicle not found for the user')
    }

    vehicleEntity.updateMileage(new MileageValueObject(dto.mileage))

    const updatedEntity = await this.vehicleRepository.update(vehicleEntity)

    return VehicleMapper.toGetVehicleDto(updatedEntity)
  }
}

import { Injectable } from '@nestjs/common'

import type { GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleMapper } from '~/vehicles/application/mappers'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'

@Injectable()
export class GetVehicleByUserUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(userId: string): Promise<GetVehicleDto | null> {
    const vehicles = await this.vehicleRepository.findByUserId(userId)

    if (vehicles.length === 0) {
      return null
    }

    return VehicleMapper.toGetVehicleDto(vehicles[0])
  }
}

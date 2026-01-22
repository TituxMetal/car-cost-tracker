import { Injectable } from '@nestjs/common'

import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import { VehicleIdValueObject } from '~/vehicles/domain/value-objects'

@Injectable()
export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(vehicleId: string, userId: string): Promise<void> {
    const vehicleIdVO = new VehicleIdValueObject(vehicleId)
    const existingVehicle = await this.vehicleRepository.existsForUser(vehicleIdVO, userId)
    const vehicleEntity = await this.vehicleRepository.findById(vehicleIdVO)

    if (!existingVehicle || !vehicleEntity) {
      throw new VehicleNotFoundException(`Vehicle with ID ${vehicleId} not found.`)
    }

    await this.vehicleRepository.delete(vehicleIdVO)
  }
}

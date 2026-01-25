import { Injectable } from '@nestjs/common'

import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import { VehicleIdValueObject } from '~/vehicles/domain/value-objects'

@Injectable()
export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(vehicleId: string, userId: string): Promise<void> {
    const vehicleIdVO = new VehicleIdValueObject(vehicleId)
    const existsForUser = await this.vehicleRepository.existsForUser(vehicleIdVO, userId)

    if (!existsForUser) {
      throw new VehicleNotFoundException('Vehicle not found for the user')
    }

    await this.vehicleRepository.delete(vehicleIdVO)
  }
}

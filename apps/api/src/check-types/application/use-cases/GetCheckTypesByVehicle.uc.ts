import { Injectable } from '@nestjs/common'

import type { GetCheckTypeDto } from '~/check-types/application/dtos'
import { CheckTypeMapper } from '~/check-types/application/mappers'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'

@Injectable()
export class GetCheckTypesByVehicleUseCase {
  constructor(private readonly checkTypeRepository: ICheckTypeRepository) {}

  async execute(vehicleId: string): Promise<GetCheckTypeDto[]> {
    const checkTypes = await this.checkTypeRepository.findByVehicleId(vehicleId)

    return checkTypes.map(CheckTypeMapper.toGetCheckTypeDto)
  }
}

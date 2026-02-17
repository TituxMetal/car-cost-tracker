import { Injectable } from '@nestjs/common'

import type { GetCheckTypeDto } from '~/check-types/application/dtos'
import { CheckTypeMapper } from '~/check-types/application/mappers'
import { CheckTypeNotFoundException } from '~/check-types/domain/exceptions'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import { CheckTypeIdValueObject } from '~/check-types/domain/value-objects'

@Injectable()
export class GetCheckTypeUseCase {
  constructor(private readonly checkTypeRepository: ICheckTypeRepository) {}

  async execute(id: string, vehicleId: string): Promise<GetCheckTypeDto> {
    const checkTypeIdVO = new CheckTypeIdValueObject(id)
    const checkType = await this.checkTypeRepository.findById(checkTypeIdVO)

    if (!checkType || checkType.vehicleId !== vehicleId) {
      throw new CheckTypeNotFoundException(id)
    }

    return CheckTypeMapper.toGetCheckTypeDto(checkType)
  }
}

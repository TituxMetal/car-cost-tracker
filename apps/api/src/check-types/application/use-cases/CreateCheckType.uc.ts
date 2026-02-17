import { Injectable } from '@nestjs/common'

import type { CreateCheckTypeDto, GetCheckTypeDto } from '~/check-types/application/dtos'
import { CheckTypeMapper } from '~/check-types/application/mappers'
import { CheckTypeEntity } from '~/check-types/domain/entities'
import { CheckTypeAlreadyExistsException } from '~/check-types/domain/exceptions'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

@Injectable()
export class CreateCheckTypeUseCase {
  constructor(private readonly checkTypeRepository: ICheckTypeRepository) {}

  async execute(dto: CreateCheckTypeDto, vehicleId: string): Promise<GetCheckTypeDto> {
    const existingCheckType = await this.checkTypeRepository.existsByNameAndVehicle(
      dto.name,
      vehicleId
    )

    if (existingCheckType) {
      throw new CheckTypeAlreadyExistsException(dto.name)
    }

    const entity = new CheckTypeEntity(
      CheckTypeIdValueObject.generate(),
      vehicleId,
      new CheckTypeNameValueObject(dto.name),
      dto.description ?? null,
      new IntervalDaysValueObject(dto.intervalDays),
      new Date(),
      new Date()
    )

    const createdEntity = await this.checkTypeRepository.create(entity)

    return CheckTypeMapper.toGetCheckTypeDto(createdEntity)
  }
}

import { Injectable } from '@nestjs/common'

import type { GetCheckTypeDto, UpdateCheckTypeDto } from '~/check-types/application/dtos'
import { CheckTypeMapper } from '~/check-types/application/mappers'
import {
  CheckTypeAlreadyExistsException,
  CheckTypeNotFoundException
} from '~/check-types/domain/exceptions'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

@Injectable()
export class UpdateCheckTypeUseCase {
  constructor(private readonly checkTypeRepository: ICheckTypeRepository) {}

  async execute(id: string, vehicleId: string, dto: UpdateCheckTypeDto): Promise<GetCheckTypeDto> {
    const checkTypeId = new CheckTypeIdValueObject(id)
    const checkTypeEntity = await this.checkTypeRepository.findById(checkTypeId)

    if (!checkTypeEntity || checkTypeEntity.vehicleId !== vehicleId) {
      throw new CheckTypeNotFoundException(id)
    }

    if (dto.name !== undefined && dto.name !== checkTypeEntity.name.value) {
      const nameExists = await this.checkTypeRepository.existsByNameAndVehicle(dto.name, vehicleId)

      if (nameExists) {
        throw new CheckTypeAlreadyExistsException(dto.name)
      }
    }

    const nameVO = dto.name !== undefined ? new CheckTypeNameValueObject(dto.name) : undefined

    const intervalDaysVO =
      dto.intervalDays !== undefined ? new IntervalDaysValueObject(dto.intervalDays) : undefined

    checkTypeEntity.updateDetails(nameVO, dto.description, intervalDaysVO)

    const updatedEntity = await this.checkTypeRepository.update(checkTypeEntity)

    return CheckTypeMapper.toGetCheckTypeDto(updatedEntity)
  }
}

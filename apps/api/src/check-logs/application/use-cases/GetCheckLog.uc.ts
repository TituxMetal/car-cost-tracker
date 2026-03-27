import { Injectable } from '@nestjs/common'

import type { GetCheckLogDto } from '~/check-logs/application/dtos'
import { CheckLogMapper } from '~/check-logs/application/mappers'
import { CheckLogNotFoundException } from '~/check-logs/domain/exceptions'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import { CheckLogIdValueObject } from '~/check-logs/domain/value-objects'
import type { CheckTypeService } from '~/check-types/application/services'

@Injectable()
export class GetCheckLogUseCase {
  constructor(
    private readonly checkLogRepository: ICheckLogRepository,
    private readonly checkTypeService: CheckTypeService
  ) {}

  async execute(id: string, vehicleId: string): Promise<GetCheckLogDto> {
    const checkLogId = new CheckLogIdValueObject(id)
    const entity = await this.checkLogRepository.findById(checkLogId)

    if (!entity) {
      throw new CheckLogNotFoundException(id)
    }

    const checkType = await this.checkTypeService.getCheckType(entity.checkTypeId, vehicleId)

    return CheckLogMapper.toGetCheckLogDto(entity, checkType.name)
  }
}

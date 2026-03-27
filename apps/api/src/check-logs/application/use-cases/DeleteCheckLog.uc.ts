import { Injectable } from '@nestjs/common'

import { CheckLogNotFoundException } from '~/check-logs/domain/exceptions'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import { CheckLogIdValueObject } from '~/check-logs/domain/value-objects'
import type { CheckTypeService } from '~/check-types/application/services'

@Injectable()
export class DeleteCheckLogUseCase {
  constructor(
    private readonly checkLogRepository: ICheckLogRepository,
    private readonly checkTypeService: CheckTypeService
  ) {}

  async execute(id: string, vehicleId: string): Promise<void> {
    const checkLogId = new CheckLogIdValueObject(id)
    const entity = await this.checkLogRepository.findById(checkLogId)

    if (!entity) {
      throw new CheckLogNotFoundException(id)
    }

    await this.checkTypeService.getCheckType(entity.checkTypeId, vehicleId)
    await this.checkLogRepository.delete(checkLogId)
  }
}

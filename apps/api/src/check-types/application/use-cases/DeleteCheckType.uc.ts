import { Injectable } from '@nestjs/common'

import { CheckTypeNotFoundException } from '~/check-types/domain/exceptions'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import { CheckTypeIdValueObject } from '~/check-types/domain/value-objects'

@Injectable()
export class DeleteCheckTypeUseCase {
  constructor(private readonly checkTypeRepository: ICheckTypeRepository) {}

  async execute(id: string, vehicleId: string): Promise<void> {
    const checkTypeId = new CheckTypeIdValueObject(id)

    const checkType = await this.checkTypeRepository.findById(checkTypeId)

    if (!checkType || checkType.vehicleId !== vehicleId) {
      throw new CheckTypeNotFoundException(id)
    }

    await this.checkTypeRepository.delete(checkTypeId)
  }
}

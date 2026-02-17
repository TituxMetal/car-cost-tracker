import type { CheckTypeEntity } from '~/check-types/domain/entities'

import { GetCheckTypeDto } from '../dtos'

export class CheckTypeMapper {
  static toGetCheckTypeDto(entity: CheckTypeEntity): GetCheckTypeDto {
    const dto: GetCheckTypeDto = {
      id: entity.id.value,
      vehicleId: entity.vehicleId,
      name: entity.name.value,
      description: entity.description,
      intervalDays: entity.intervalDays.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }

    return Object.assign(new GetCheckTypeDto(), dto)
  }
}

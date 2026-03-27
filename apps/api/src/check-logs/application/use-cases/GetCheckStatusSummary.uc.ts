import { Injectable } from '@nestjs/common'

import type { CheckStatusSummaryDto } from '~/check-logs/application/dtos'
import { CheckLogMapper } from '~/check-logs/application/mappers'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import type { CheckTypeService } from '~/check-types/application/services'

@Injectable()
export class GetCheckStatusSummaryUseCase {
  constructor(
    private readonly checkLogRepository: ICheckLogRepository,
    private readonly checkTypeService: CheckTypeService
  ) {}

  async execute(vehicleId: string): Promise<CheckStatusSummaryDto[]> {
    const checkTypes = await this.checkTypeService.getCheckTypesByVehicle(vehicleId)
    const checkTypeIds = checkTypes.map(checkType => checkType.id)
    const latestLogs = await this.checkLogRepository.findMostRecentByCheckTypeIds(checkTypeIds)

    return checkTypes.map(checkType =>
      CheckLogMapper.toCheckStatusSummaryDto(checkType, latestLogs.get(checkType.id) ?? null)
    )
  }
}

import { Injectable } from '@nestjs/common'

import type { GetCheckLogDto } from '~/check-logs/application/dtos'
import { CheckLogMapper } from '~/check-logs/application/mappers'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import type { CheckTypeService } from '~/check-types/application/services'

@Injectable()
export class ListCheckLogsByVehicleUseCase {
  constructor(
    private readonly checkLogRepository: ICheckLogRepository,
    private readonly checkTypeService: CheckTypeService
  ) {}

  async execute(vehicleId: string): Promise<GetCheckLogDto[]> {
    const checkTypes = await this.checkTypeService.getCheckTypesByVehicle(vehicleId)
    const nameMap = new Map(checkTypes.map(ct => [ct.id, ct.name]))

    const logs = await this.checkLogRepository.findByVehicleId(vehicleId)

    return logs
      .map(log => CheckLogMapper.toGetCheckLogDto(log, nameMap.get(log.checkTypeId) ?? ''))
      .sort((a, b) => {
        if (a.completedAt === b.completedAt) return 0

        return a.completedAt > b.completedAt ? -1 : 1
      })
  }
}

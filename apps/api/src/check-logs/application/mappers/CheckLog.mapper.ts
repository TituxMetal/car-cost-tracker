import type { CheckLogEntity } from '~/check-logs/domain/entities'
import type { GetCheckTypeDto } from '~/check-types/application/dtos'

import type { CheckStatus } from '../dtos'
import { CheckStatusSummaryDto, GetCheckLogDto } from '../dtos'

const DUE_SOON_THRESHOLD_DAYS = 2

const computeStatus = (nextDueAt: string): CheckStatus => {
  const nextDueAtDate = new Date(nextDueAt + 'T00:00:00Z')
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const msPerDay = 24 * 60 * 60 * 1000
  const daysRemaining = (nextDueAtDate.getTime() - today.getTime()) / msPerDay

  if (daysRemaining < 0) return 'overdue'
  if (daysRemaining <= DUE_SOON_THRESHOLD_DAYS) return 'due-soon'

  return 'on-time'
}

export class CheckLogMapper {
  static toGetCheckLogDto(entity: CheckLogEntity, checkTypeName: string): GetCheckLogDto {
    const dto: GetCheckLogDto = {
      id: entity.id.value,
      checkTypeId: entity.checkTypeId,
      checkTypeName,
      completedAt: entity.completedAt.value,
      notes: entity.notes,
      nextDueAt: entity.nextDueAt,
      createdAt: entity.createdAt
    }

    return Object.assign(new GetCheckLogDto(), dto)
  }

  static toCheckStatusSummaryDto(
    checkType: GetCheckTypeDto,
    latestLog: CheckLogEntity | null
  ): CheckStatusSummaryDto {
    const base = {
      checkTypeId: checkType.id,
      checkTypeName: checkType.name,
      intervalDays: checkType.intervalDays
    }

    if (!latestLog) {
      return Object.assign(new CheckStatusSummaryDto(), {
        ...base,
        status: 'never' as CheckStatus,
        lastCompletedAt: null,
        nextDueAt: null
      })
    }

    return Object.assign(new CheckStatusSummaryDto(), {
      ...base,
      status: computeStatus(latestLog.nextDueAt),
      lastCompletedAt: latestLog.completedAt.value,
      nextDueAt: latestLog.nextDueAt
    })
  }
}

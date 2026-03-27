import { Injectable } from '@nestjs/common'

import type { CreateCheckLogDto, GetCheckLogDto } from '~/check-logs/application/dtos'
import { CheckLogMapper } from '~/check-logs/application/mappers'
import { CheckLogEntity } from '~/check-logs/domain/entities'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'
import type { CheckTypeService } from '~/check-types/application/services'

@Injectable()
export class CreateCheckLogUseCase {
  constructor(
    private readonly checkLogRepository: ICheckLogRepository,
    private readonly checkTypeService: CheckTypeService
  ) {}

  async execute(dto: CreateCheckLogDto, vehicleId: string): Promise<GetCheckLogDto> {
    const checkType = await this.checkTypeService.getCheckType(dto.checkTypeId, vehicleId)
    const completedAt = new CompletedAtValueObject(dto.completedAt)

    const completedAtDate = completedAt.toDate()
    const nextDueAtDate = new Date(completedAtDate)
    nextDueAtDate.setUTCDate(nextDueAtDate.getUTCDate() + checkType.intervalDays)
    const nextDueAt = nextDueAtDate.toISOString().split('T')[0]

    const entity = new CheckLogEntity(
      CheckLogIdValueObject.generate(),
      dto.checkTypeId,
      completedAt,
      dto.notes ?? null,
      nextDueAt,
      new Date(),
      new Date()
    )
    const created = await this.checkLogRepository.create(entity)

    return CheckLogMapper.toGetCheckLogDto(created, checkType.name)
  }
}

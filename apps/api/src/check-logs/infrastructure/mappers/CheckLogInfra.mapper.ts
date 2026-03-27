import type { CheckLog as PrismaCheckLog } from '@generated'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'

export class CheckLogInfrastructureMapper {
  static toDomain(prismaCheckLog: PrismaCheckLog): CheckLogEntity {
    return new CheckLogEntity(
      new CheckLogIdValueObject(prismaCheckLog.id),
      prismaCheckLog.checkTypeId,
      new CompletedAtValueObject(prismaCheckLog.completedAt),
      prismaCheckLog.notes ?? null,
      prismaCheckLog.nextDueAt,
      prismaCheckLog.createdAt,
      prismaCheckLog.updatedAt
    )
  }

  static toPrisma(entity: CheckLogEntity): Omit<PrismaCheckLog, 'checkType'> {
    return {
      id: entity.id.value,
      checkTypeId: entity.checkTypeId,
      completedAt: entity.completedAt.value,
      notes: entity.notes ?? null,
      nextDueAt: entity.nextDueAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}

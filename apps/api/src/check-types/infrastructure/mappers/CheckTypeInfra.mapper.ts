import type { CheckType as PrismaCheckType } from '@generated'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

export class CheckTypeInfrastructureMapper {
  static toDomain(prismaCheckType: PrismaCheckType): CheckTypeEntity {
    const checkTypeEntity = new CheckTypeEntity(
      new CheckTypeIdValueObject(prismaCheckType.id),
      prismaCheckType.vehicleId,
      new CheckTypeNameValueObject(prismaCheckType.name),
      prismaCheckType.description ?? null,
      new IntervalDaysValueObject(prismaCheckType.intervalDays),
      prismaCheckType.createdAt,
      prismaCheckType.updatedAt
    )

    return checkTypeEntity
  }

  static toPrisma(entity: CheckTypeEntity): Omit<PrismaCheckType, 'vehicle'> {
    const prismaCheckType: Omit<PrismaCheckType, 'vehicle'> = {
      id: entity.id.value,
      vehicleId: entity.vehicleId,
      name: entity.name.value,
      description: entity.description ?? null,
      intervalDays: entity.intervalDays.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }

    return prismaCheckType
  }
}

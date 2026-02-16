import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '../validation'
import type { CheckTypeIdValueObject } from '../value-objects/CheckTypeId.vo'
import type { CheckTypeNameValueObject } from '../value-objects/CheckTypeName.vo'
import type { IntervalDaysValueObject } from '../value-objects/IntervalDays.vo'

export class CheckTypeEntity {
  constructor(
    public readonly id: CheckTypeIdValueObject,
    public readonly vehicleId: string,
    public name: CheckTypeNameValueObject,
    public description: string | null,
    public intervalDays: IntervalDaysValueObject,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    if (
      this.description !== null &&
      this.description.length > checkTypeValidation.DESCRIPTION.MAX_LENGTH
    ) {
      throw new Error(
        `Description cannot exceed ${checkTypeValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    }
  }

  updateDetails(
    name?: CheckTypeNameValueObject,
    description?: string | null,
    intervalDays?: IntervalDaysValueObject
  ): void {
    if (name !== undefined) {
      this.name = name
    }

    if (intervalDays !== undefined) {
      this.intervalDays = intervalDays
    }

    if (description !== undefined) {
      if (description !== null && description.length > checkTypeValidation.DESCRIPTION.MAX_LENGTH) {
        throw new Error(
          `Description cannot exceed ${checkTypeValidation.DESCRIPTION.MAX_LENGTH} characters`
        )
      }
      this.description = description
    }
  }
}

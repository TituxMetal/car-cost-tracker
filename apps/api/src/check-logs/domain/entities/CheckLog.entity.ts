import { InvalidCheckLogException } from '../exceptions'
import { CHECK_LOG_VALIDATION } from '../validation'
import type { CheckLogIdValueObject, CompletedAtValueObject } from '../value-objects'

export class CheckLogEntity {
  constructor(
    public readonly id: CheckLogIdValueObject,
    public readonly checkTypeId: string,
    public readonly completedAt: CompletedAtValueObject,
    public readonly notes: string | null,
    public readonly nextDueAt: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    if (notes && notes.length > CHECK_LOG_VALIDATION.NOTES.MAX_LENGTH) {
      throw new InvalidCheckLogException(
        `Notes cannot exceed ${CHECK_LOG_VALIDATION.NOTES.MAX_LENGTH} characters`
      )
    }
  }
}

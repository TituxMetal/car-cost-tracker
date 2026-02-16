import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '../validation'

export class IntervalDaysValueObject {
  private readonly _value: number

  constructor(value: number) {
    if (!Number.isInteger(value) || value < checkTypeValidation.INTERVAL_DAYS.MIN) {
      throw new Error(
        `IntervalDays must be an integer of at least ${checkTypeValidation.INTERVAL_DAYS.MIN}`
      )
    }

    this._value = value
  }

  get value(): number {
    return this._value
  }

  equals(other: IntervalDaysValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value.toString()
  }
}

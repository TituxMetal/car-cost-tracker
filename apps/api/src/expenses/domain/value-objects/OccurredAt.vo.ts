import { EXPENSE_VALIDATION } from '../validation'

export class OccurredAtValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!EXPENSE_VALIDATION.OCCURRED_AT.PATTERN.test(value)) {
      throw new Error(EXPENSE_VALIDATION.OCCURRED_AT.MESSAGE)
    }

    const timestamp = Date.parse(value)

    if (isNaN(timestamp)) {
      throw new Error(EXPENSE_VALIDATION.OCCURRED_AT.MESSAGE)
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const input = new Date(value + 'T00:00:00Z')
    if (input > today) {
      throw new Error(EXPENSE_VALIDATION.OCCURRED_AT.FUTURE_MESSAGE)
    }

    this._value = value
  }

  get value(): string {
    return this._value
  }

  toDate(): Date {
    return new Date(this._value + 'T00:00:00Z')
  }

  equals(other: OccurredAtValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}

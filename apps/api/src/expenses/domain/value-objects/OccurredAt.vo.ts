const OCCURRED_AT_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const OCCURRED_AT_MESSAGE = 'Occurred date must be in YYYY-MM-DD format'
const OCCURRED_AT_FUTURE_MESSAGE = 'Occurred date cannot be in the future'

export class OccurredAtValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!OCCURRED_AT_PATTERN.test(value)) {
      throw new Error(OCCURRED_AT_MESSAGE)
    }

    const timestamp = Date.parse(value)

    if (isNaN(timestamp)) {
      throw new Error(OCCURRED_AT_MESSAGE)
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const input = new Date(value + 'T00:00:00Z')
    if (input > today) {
      throw new Error(OCCURRED_AT_FUTURE_MESSAGE)
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

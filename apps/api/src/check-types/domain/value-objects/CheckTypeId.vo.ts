import { randomUUID } from 'crypto'

export class CheckTypeIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('CheckTypeId must be a non-empty string')
    }

    if (!this.isValidCheckTypeIdFormat(value)) {
      throw new Error('CheckTypeId must be a valid UUID')
    }

    this._value = value
  }

  static generate(): CheckTypeIdValueObject {
    return new CheckTypeIdValueObject(randomUUID())
  }

  get value(): string {
    return this._value
  }

  equals(other: CheckTypeIdValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  private isValidCheckTypeIdFormat(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    return uuidRegex.test(value)
  }
}

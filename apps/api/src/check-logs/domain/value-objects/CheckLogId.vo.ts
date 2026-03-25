import { randomUUID } from 'crypto'

export class CheckLogIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('CheckLogId must be a non-empty string')
    }

    if (!this.isValidCheckLogIdFormat(value)) {
      throw new Error('CheckLogId must be a valid UUID')
    }

    this._value = value
  }

  static generate(): CheckLogIdValueObject {
    return new CheckLogIdValueObject(randomUUID())
  }

  get value(): string {
    return this._value
  }

  equals(other: CheckLogIdValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  private isValidCheckLogIdFormat(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    return uuidRegex.test(value)
  }
}

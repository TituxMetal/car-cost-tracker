export class CheckTypeIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('CheckTypeId must be a non-empty string')
    }

    this._value = value
  }

  static generate(): CheckTypeIdValueObject {
    return new CheckTypeIdValueObject(crypto.randomUUID())
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
}

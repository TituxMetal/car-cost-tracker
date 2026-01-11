/**
 * Vehicle Year Value Object
 *
 * Validation rules:
 * - Must be a valid integer
 * - Range: 1900 to 2030
 */
export class YearValueObject {
  private readonly _value: number

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value) || !Number.isInteger(value)) {
      throw new Error('Year must be an integer.')
    }

    if (value < 1900 || value > 2030) {
      throw new Error('Year must be between 1900 and 2030.')
    }

    this._value = value
  }

  get value(): number {
    return this._value
  }

  equals(other: YearValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value.toString()
  }
}

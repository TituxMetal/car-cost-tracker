/**
 * Vehicle Mileage Value Object
 *
 * Validation rules:
 * - Must be a valid integer
 * - Must be non-negative (>= 0)
 */
export class MileageValueObject {
  private readonly _value: number

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value) || !Number.isInteger(value) || value < 0) {
      throw new Error('Mileage must be a non-negative integer.')
    }

    this._value = value
  }

  get value(): number {
    return this._value
  }

  equals(other: MileageValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value.toString()
  }
}

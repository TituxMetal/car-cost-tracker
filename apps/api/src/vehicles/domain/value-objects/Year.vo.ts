import { VEHICLE_VALIDATION as VehicleValidation } from '../validation'

/**
 * Vehicle Year Value Object
 *
 * Validation rules:
 * - Must be a valid integer
 * - Range: VehicleValidation.YEAR.MIN to current year (dynamically determined)
 */
export class YearValueObject {
  private readonly _value: number

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value) || !Number.isInteger(value)) {
      throw new Error('Year must be an integer.')
    }

    if (value < VehicleValidation.YEAR.MIN || value > VehicleValidation.YEAR.MAX) {
      throw new Error(VehicleValidation.YEAR.MESSAGE)
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

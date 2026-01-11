/**
 * Vehicle Identification Number (VIN) Value Object
 *
 * Validation rules:
 * - Exactly 17 characters
 * - Alphanumeric only (A-Z, 0-9)
 * - No I, O, Q (often confused with 1, 0)
 * - Optional (can be null/undefined at entity level)
 */
export class VinValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('VIN must be a non-empty string.')
    }

    if (value.length !== 17) {
      throw new Error('VIN must be exactly 17 characters long.')
    }

    if (!this.isValidVinFormat(value)) {
      throw new Error('VIN must be alphanumeric and cannot contain I, O, or Q.')
    }

    this._value = value.toUpperCase()
  }

  get value(): string {
    return this._value
  }

  equals(other: VinValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  private isValidVinFormat(value: string): boolean {
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i

    return vinPattern.test(value)
  }
}

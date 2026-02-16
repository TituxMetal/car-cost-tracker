import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '../validation'

export class CheckTypeNameValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('CheckTypeName must be a non-empty string')
    }

    if (value.trim().length < checkTypeValidation.NAME.MIN_LENGTH) {
      throw new Error(
        `CheckTypeName must be at least ${checkTypeValidation.NAME.MIN_LENGTH} characters long`
      )
    }

    if (value.trim().length > checkTypeValidation.NAME.MAX_LENGTH) {
      throw new Error(
        `CheckTypeName must not exceed ${checkTypeValidation.NAME.MAX_LENGTH} characters`
      )
    }

    this._value = value.trim()
  }

  get value(): string {
    return this._value
  }

  equals(other: CheckTypeNameValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}

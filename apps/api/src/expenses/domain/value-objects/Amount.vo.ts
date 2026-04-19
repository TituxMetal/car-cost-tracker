import { EXPENSE_VALIDATION } from '../validation'

export class AmountValueObject {
  private readonly _cents: number

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error(EXPENSE_VALIDATION.AMOUNT.INTEGER_MESSAGE)
    }

    if (cents < EXPENSE_VALIDATION.AMOUNT.MIN_CENTS) {
      throw new Error(EXPENSE_VALIDATION.AMOUNT.MIN_MESSAGE)
    }

    if (cents > EXPENSE_VALIDATION.AMOUNT.MAX_CENTS) {
      throw new Error(EXPENSE_VALIDATION.AMOUNT.MAX_MESSAGE)
    }

    this._cents = cents
  }

  static fromCents(cents: number): AmountValueObject {
    return new AmountValueObject(cents)
  }

  static fromEuros(euros: number): AmountValueObject {
    return AmountValueObject.fromCents(Math.round(euros * 100))
  }

  get value(): number {
    return this._cents
  }

  toCents(): number {
    return this._cents
  }

  toEuros(): number {
    return this._cents / 100
  }

  equals(other: AmountValueObject): boolean {
    return this._cents === other._cents
  }
}

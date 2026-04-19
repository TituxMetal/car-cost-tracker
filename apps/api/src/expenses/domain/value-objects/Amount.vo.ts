export class AmountValueObject {
  private readonly _cents: number

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error('Amount must be an integer number of cents')
    }

    if (cents <= 0) {
      throw new Error('Amount must be strictly positive')
    }

    if (cents > 100_000_000) {
      throw new Error('Amount exceeds the maximum allowed (1 000 000 €)')
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

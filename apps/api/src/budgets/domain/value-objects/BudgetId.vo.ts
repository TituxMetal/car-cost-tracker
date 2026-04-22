import { randomUUID } from 'crypto'

export class BudgetIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('BudgetId must be a non-empty string')
    }

    if (!this.isValidBudgetIdFormat(value)) {
      throw new Error('BudgetId must be a valid UUID')
    }

    this._value = value
  }

  static generate(): BudgetIdValueObject {
    return new BudgetIdValueObject(randomUUID())
  }

  get value(): string {
    return this._value
  }

  equals(other: BudgetIdValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  private isValidBudgetIdFormat(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    return uuidRegex.test(value)
  }
}

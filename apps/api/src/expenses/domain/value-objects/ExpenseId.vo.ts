import { randomUUID } from 'crypto'

export class ExpenseIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('ExpenseId must be a non-empty string')
    }

    if (!this.isValidExpenseIdFormat(value)) {
      throw new Error('ExpenseId must be a valid UUID')
    }

    this._value = value
  }

  static generate(): ExpenseIdValueObject {
    return new ExpenseIdValueObject(randomUUID())
  }

  get value(): string {
    return this._value
  }

  equals(other: ExpenseIdValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  private isValidExpenseIdFormat(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    return uuidRegex.test(value)
  }
}

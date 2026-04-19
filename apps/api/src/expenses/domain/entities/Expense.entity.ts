import { InvalidExpenseException } from '../exceptions'
import { EXPENSE_VALIDATION as expenseValidation } from '../validation'
import type {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '../value-objects'

export enum ExpenseCategory {
  SERVICE = 'SERVICE',
  PARTS = 'PARTS',
  LABOR = 'LABOR',
  OTHER = 'OTHER'
}

export class ExpenseEntity {
  constructor(
    public readonly id: ExpenseIdValueObject,
    public readonly vehicleId: string,
    public occurredAt: OccurredAtValueObject,
    public amount: AmountValueObject,
    public category: ExpenseCategory,
    public description: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    if (
      this.description !== null &&
      this.description.length > expenseValidation.DESCRIPTION.MAX_LENGTH
    ) {
      throw new InvalidExpenseException(
        `Description cannot exceed ${expenseValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    }

    if (!Object.values(ExpenseCategory).includes(this.category)) {
      throw new InvalidExpenseException(
        `Category must be one of: ${Object.values(ExpenseCategory).join(', ')}`
      )
    }
  }

  updateOccurredAt(next: OccurredAtValueObject): void {
    this.occurredAt = next
    this.updatedAt = new Date()
  }

  updateAmount(next: AmountValueObject): void {
    this.amount = next
    this.updatedAt = new Date()
  }

  updateCategory(next: ExpenseCategory): void {
    const validCategories = Object.values(ExpenseCategory)

    if (!validCategories.includes(next)) {
      throw new InvalidExpenseException(`Category must be one of: ${validCategories.join(', ')}`)
    }

    this.category = next
    this.updatedAt = new Date()
  }

  updateDescription(next: string | null): void {
    if (next !== null && next.length > expenseValidation.DESCRIPTION.MAX_LENGTH) {
      throw new InvalidExpenseException(
        `Description cannot exceed ${expenseValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    }

    this.description = next
    this.updatedAt = new Date()
  }
}

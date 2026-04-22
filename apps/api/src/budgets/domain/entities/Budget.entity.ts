import type { AmountValueObject } from '~/shared/domain/value-objects'

import { InvalidBudgetException } from '../exceptions'
import { BUDGET_VALIDATION as budgetValidation } from '../validation'
import type { BudgetIdValueObject } from '../value-objects'

export enum BudgetPeriod {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

export class BudgetEntity {
  constructor(
    public readonly id: BudgetIdValueObject,
    public readonly vehicleId: string,
    public amount: AmountValueObject,
    public period: BudgetPeriod,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    if (!budgetValidation.PERIOD.VALUES.includes(this.period)) {
      throw new InvalidBudgetException('Invalid budget period')
    }
  }

  updateAmount(next: AmountValueObject): void {
    this.amount = next
    this.updatedAt = new Date()
  }

  updatePeriod(next: BudgetPeriod): void {
    if (!budgetValidation.PERIOD.VALUES.includes(next)) {
      throw new InvalidBudgetException('Invalid budget period')
    }
    this.period = next
    this.updatedAt = new Date()
  }

  updateBoth(next: { amount?: AmountValueObject; period?: BudgetPeriod }): void {
    let updated = false

    if (next.amount !== undefined) {
      this.amount = next.amount
      updated = true
    }

    if (next.period !== undefined) {
      if (!budgetValidation.PERIOD.VALUES.includes(next.period)) {
        throw new InvalidBudgetException('Invalid budget period')
      }
      this.period = next.period
      updated = true
    }

    if (updated) {
      this.updatedAt = new Date()
    }
  }
}

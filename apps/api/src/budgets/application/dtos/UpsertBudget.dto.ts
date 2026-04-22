import { IsEnum, IsInt, IsPositive, Max } from 'class-validator'

import { BudgetPeriod } from '~/budgets/domain/entities'
import { BUDGET_VALIDATION } from '~/budgets/domain/validation'
import { AMOUNT_VALIDATION } from '~/shared/domain/validation'

export class UpsertBudgetDto {
  @IsInt({ message: AMOUNT_VALIDATION.INTEGER_MESSAGE })
  @IsPositive({ message: AMOUNT_VALIDATION.MIN_MESSAGE })
  @Max(AMOUNT_VALIDATION.MAX_CENTS, { message: AMOUNT_VALIDATION.MAX_MESSAGE })
  amountCents!: number

  @IsEnum(BudgetPeriod, { message: BUDGET_VALIDATION.PERIOD.MESSAGE })
  period!: BudgetPeriod
}

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength
} from 'class-validator'

import { ExpenseCategory } from '~/expenses/domain/entities'
import { EXPENSE_VALIDATION as expenseValidation } from '~/expenses/domain/validation'
import { AMOUNT_VALIDATION } from '~/shared/domain/validation'

export class CreateExpenseDto {
  @IsString()
  @Matches(expenseValidation.OCCURRED_AT.PATTERN, {
    message: expenseValidation.OCCURRED_AT.MESSAGE
  })
  occurredAt!: string

  @IsInt({ message: AMOUNT_VALIDATION.INTEGER_MESSAGE })
  @IsPositive({ message: AMOUNT_VALIDATION.MIN_MESSAGE })
  @Max(AMOUNT_VALIDATION.MAX_CENTS, { message: AMOUNT_VALIDATION.MAX_MESSAGE })
  amountCents!: number

  @IsEnum(ExpenseCategory, { message: expenseValidation.CATEGORY_MESSAGE })
  category!: ExpenseCategory

  @IsOptional()
  @IsString()
  @MaxLength(expenseValidation.DESCRIPTION.MAX_LENGTH, {
    message: expenseValidation.DESCRIPTION.MESSAGE
  })
  description?: string
}

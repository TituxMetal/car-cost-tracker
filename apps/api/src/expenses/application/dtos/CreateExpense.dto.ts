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

export class CreateExpenseDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'OccurredAt must be in YYYY-MM-DD format' })
  occurredAt!: string

  @IsInt({ message: 'AmountCents must be an integer' })
  @IsPositive({ message: expenseValidation.AMOUNT.MIN_MESSAGE })
  @Max(expenseValidation.AMOUNT.MAX_CENTS, { message: expenseValidation.AMOUNT.MAX_MESSAGE })
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

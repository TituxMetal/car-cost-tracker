import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator'

import { EXPENSE_VALIDATION as expenseValidation } from '~/expenses/domain/validation'

import { CreateExpenseDto } from './CreateExpense.dto'

export class UpdateExpenseDto extends PartialType(
  OmitType(CreateExpenseDto, ['description'] as const)
) {
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(expenseValidation.DESCRIPTION.MAX_LENGTH, {
    message: expenseValidation.DESCRIPTION.MESSAGE
  })
  description?: string | null
}

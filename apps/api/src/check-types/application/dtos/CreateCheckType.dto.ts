import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'

import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '~/check-types/domain/validation'

export class CreateCheckTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MinLength(checkTypeValidation.NAME.MIN_LENGTH, { message: checkTypeValidation.NAME.MESSAGE })
  @MaxLength(checkTypeValidation.NAME.MAX_LENGTH, { message: checkTypeValidation.NAME.MESSAGE })
  name!: string

  @IsInt()
  @Min(checkTypeValidation.INTERVAL_DAYS.MIN, {
    message: checkTypeValidation.INTERVAL_DAYS.MESSAGE
  })
  intervalDays!: number

  @IsOptional()
  @IsString()
  @MaxLength(checkTypeValidation.DESCRIPTION.MAX_LENGTH, {
    message: checkTypeValidation.DESCRIPTION.MESSAGE
  })
  description?: string
}

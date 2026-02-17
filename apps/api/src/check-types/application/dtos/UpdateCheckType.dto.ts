import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator'

import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '~/check-types/domain/validation'

import { CreateCheckTypeDto } from './CreateCheckType.dto'

export class UpdateCheckTypeDto extends PartialType(
  OmitType(CreateCheckTypeDto, ['description'] as const)
) {
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(checkTypeValidation.DESCRIPTION.MAX_LENGTH, {
    message: checkTypeValidation.DESCRIPTION.MESSAGE
  })
  description?: string | null
}

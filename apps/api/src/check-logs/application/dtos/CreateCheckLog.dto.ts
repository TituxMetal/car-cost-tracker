import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator'

import { CHECK_LOG_VALIDATION as checkLogValidation } from '~/check-logs/domain/validation'

export class CreateCheckLogDto {
  @IsNotEmpty({ message: 'CheckTypeId cannot be empty' })
  @IsUUID('4', { message: 'CheckTypeId must be a valid UUID' })
  checkTypeId!: string

  @IsString()
  @IsNotEmpty({ message: 'CompletedAt cannot be empty' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: checkLogValidation.COMPLETED_AT.MESSAGE })
  completedAt!: string

  @IsOptional()
  @IsString()
  @MaxLength(checkLogValidation.NOTES.MAX_LENGTH, { message: checkLogValidation.NOTES.MESSAGE })
  notes?: string
}

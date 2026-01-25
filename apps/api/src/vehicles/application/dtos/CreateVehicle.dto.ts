import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min
} from 'class-validator'

import { FuelType } from '~/vehicles/domain/entities'
import { VEHICLE_VALIDATION } from '~/vehicles/domain/validation'

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({ message: 'Make cannot be empty' })
  @MaxLength(VEHICLE_VALIDATION.MAKE.MAX_LENGTH, { message: VEHICLE_VALIDATION.MAKE.MESSAGE })
  make!: string

  @IsString()
  @IsNotEmpty({ message: 'Model cannot be empty' })
  @MaxLength(VEHICLE_VALIDATION.MODEL.MAX_LENGTH, { message: VEHICLE_VALIDATION.MODEL.MESSAGE })
  model!: string

  @IsInt()
  @Min(VEHICLE_VALIDATION.YEAR.MIN, { message: VEHICLE_VALIDATION.YEAR.MESSAGE })
  @Max(VEHICLE_VALIDATION.YEAR.MAX, { message: VEHICLE_VALIDATION.YEAR.MESSAGE })
  year!: number

  @IsOptional()
  @IsString()
  @MaxLength(VEHICLE_VALIDATION.ENGINE_TYPE.MAX_LENGTH, {
    message: VEHICLE_VALIDATION.ENGINE_TYPE.MESSAGE
  })
  engineType?: string

  @IsOptional()
  @IsEnum(FuelType, { message: 'Fuel type must be a valid enum value' })
  fuelType?: FuelType

  @IsOptional()
  @IsString()
  @Matches(VEHICLE_VALIDATION.VIN.PATTERN, { message: VEHICLE_VALIDATION.VIN.MESSAGE })
  vin?: string

  @IsOptional()
  @IsString()
  @MaxLength(VEHICLE_VALIDATION.LICENSE_PLATE.MAX_LENGTH, {
    message: VEHICLE_VALIDATION.LICENSE_PLATE.MESSAGE
  })
  licensePlate?: string

  @IsOptional()
  @IsISO8601({}, { message: 'Purchase date must be a valid ISO 8601 date string' })
  purchaseDate?: string

  @IsOptional()
  @IsInt({ message: 'Mileage must be an integer' })
  @Min(VEHICLE_VALIDATION.MILEAGE.MIN, { message: VEHICLE_VALIDATION.MILEAGE.MESSAGE })
  mileage?: number
}

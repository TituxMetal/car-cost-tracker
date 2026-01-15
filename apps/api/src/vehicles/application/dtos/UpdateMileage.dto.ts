import { IsInt, Min } from 'class-validator'

import { VEHICLE_VALIDATION } from '~/vehicles/domain/validation'

export class UpdateMileageDto {
  @IsInt({ message: VEHICLE_VALIDATION.MILEAGE.MESSAGE })
  @Min(VEHICLE_VALIDATION.MILEAGE.MIN, {
    message: VEHICLE_VALIDATION.MILEAGE.MESSAGE
  })
  mileage!: number
}

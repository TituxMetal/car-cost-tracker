import { OmitType, PartialType } from '@nestjs/mapped-types'

import { CreateVehicleDto } from './CreateVehicle.dto'

export class UpdateVehicleDto extends PartialType(
  OmitType(CreateVehicleDto, ['mileage'] as const)
) {}

import { PartialType } from '@nestjs/mapped-types'

import { CreateVehicleDto } from './CreateVehicle.dto'

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

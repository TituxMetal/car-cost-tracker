import type { FuelType } from '~/vehicles/domain/entities'

export class GetVehicleDto {
  id!: string
  userId!: string
  make!: string
  model!: string
  year!: number
  engineType!: string | null
  fuelType!: FuelType
  vin!: string | null
  licensePlate!: string | null
  purchaseDate!: Date | null
  mileage!: number
  createdAt!: Date
  updatedAt!: Date
}

export class GetCheckTypeDto {
  id!: string
  vehicleId!: string
  name!: string
  description!: string | null
  intervalDays!: number
  createdAt!: Date
  updatedAt!: Date
}

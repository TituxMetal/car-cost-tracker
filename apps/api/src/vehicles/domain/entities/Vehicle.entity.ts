import type {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '../value-objects'

export enum FuelType {
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL',
  LPG = 'LPG',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID'
}

export class VehicleEntity {
  constructor(
    public readonly id: VehicleIdValueObject,
    public readonly userId: string,
    public make: string,
    public model: string,
    public year: YearValueObject,
    public engineType: string | null,
    public fuelType: FuelType | null,
    public vin: VinValueObject | null,
    public licensePlate: string | null,
    public purchaseDate: Date | null,
    public mileage: MileageValueObject,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  updateMileage(newMileage: MileageValueObject): void {
    if (newMileage.value < this.mileage.value) {
      throw new Error('New mileage cannot be lower than current mileage.')
    }

    this.mileage = newMileage
  }

  updateDetails(
    make?: string,
    model?: string,
    year?: YearValueObject,
    engineType?: string | null,
    fuelType?: FuelType | null,
    vin?: VinValueObject | null,
    licensePlate?: string | null,
    purchaseDate?: Date | null
  ): void {
    if (make !== undefined) {
      if (make.trim() === '') {
        throw new Error('Make cannot be an empty string.')
      }

      this.make = make
    }

    if (model !== undefined) {
      if (model.trim() === '') {
        throw new Error('Model cannot be an empty string.')
      }

      this.model = model
    }

    if (year !== undefined) {
      this.year = year
    }

    if (engineType !== undefined) {
      this.engineType = engineType
    }

    if (fuelType !== undefined) {
      this.fuelType = fuelType
    }

    if (vin !== undefined) {
      this.vin = vin
    }

    if (licensePlate !== undefined) {
      this.licensePlate = licensePlate
    }

    if (purchaseDate !== undefined) {
      this.purchaseDate = purchaseDate
    }
  }
}

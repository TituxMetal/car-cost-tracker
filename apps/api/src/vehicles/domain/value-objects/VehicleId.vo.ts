import { randomUUID } from 'crypto'

export class VehicleIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Vehicle ID cannot be empty')
    }

    const isValidVehicleIdFormat = this.isValidVehicleIdFormat(value)
    if (!isValidVehicleIdFormat) {
      throw new Error('Invalid vehicle ID format')
    }

    this._value = value
  }

  get value(): string {
    return this._value
  }

  equals(other: VehicleIdValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  static generate(): VehicleIdValueObject {
    return new VehicleIdValueObject(randomUUID())
  }

  private isValidVehicleIdFormat(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    return uuidRegex.test(value)
  }
}

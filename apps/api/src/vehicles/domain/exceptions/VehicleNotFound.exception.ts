/**
 * Thrown when a vehicle cannot be found by ID
 */
export class VehicleNotFoundException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `Vehicle not found: ${identifier}` : 'Vehicle not found')

    this.name = 'VehicleNotFoundException'
  }
}

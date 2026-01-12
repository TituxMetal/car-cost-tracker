/**
 * Thrown when vehicle data is invalid (validation errors)
 */
export class InvalidVehicleException extends Error {
  constructor(message?: string) {
    super(message ? `Invalid vehicle: ${message}` : 'Invalid vehicle data')

    this.name = 'InvalidVehicleException'
  }
}

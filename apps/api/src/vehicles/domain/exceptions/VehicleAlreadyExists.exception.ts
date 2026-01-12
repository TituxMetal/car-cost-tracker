/**
 * Thrown when user tries to create a second vehicle (single-vehicle constraint)
 */
export class VehicleAlreadyExistsException extends Error {
  constructor(message?: string) {
    super(message ? `Vehicle already exists: ${message}` : 'Vehicle already exists')

    this.name = 'VehicleAlreadyExistsException'
  }
}

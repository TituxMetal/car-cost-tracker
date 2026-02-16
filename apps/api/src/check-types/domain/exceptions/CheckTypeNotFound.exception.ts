/**
 * @description Thrown when attempting to access a check type that does not exist for the specified vehicle.
 */
export class CheckTypeNotFoundException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `Check type not found: ${identifier}` : 'Check type not found')
    this.name = 'CheckTypeNotFoundException'
  }
}

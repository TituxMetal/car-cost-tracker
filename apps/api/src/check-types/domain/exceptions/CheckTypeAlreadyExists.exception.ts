/**
 * @description Thrown when attempting to create a check type that already exists for the same vehicle with the same name.
 */
export class CheckTypeAlreadyExistsException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `Check type already exists: ${identifier}` : 'Check type already exists')
    this.name = 'CheckTypeAlreadyExistsException'
  }
}

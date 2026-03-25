/**
 * @description Thrown when attempting to access a check log that does not exist.
 */
export class CheckLogNotFoundException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `Check log not found: ${identifier}` : 'Check log not found')
    this.name = 'CheckLogNotFoundException'
  }
}

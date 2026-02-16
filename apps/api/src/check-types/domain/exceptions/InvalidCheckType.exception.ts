/**
 * @description Thrown when attempting to perform an operation on an invalid check type.
 */
export class InvalidCheckTypeException extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid check type')
    this.name = 'InvalidCheckTypeException'
  }
}

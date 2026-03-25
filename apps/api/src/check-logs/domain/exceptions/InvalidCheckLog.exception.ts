/**
 * @description Thrown when attempting to perform an operation on an invalid check log.
 */
export class InvalidCheckLogException extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid check log')
    this.name = 'InvalidCheckLogException'
  }
}

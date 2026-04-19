/**
 * @description Thrown when attempting to perform an operation on an invalid expense.
 */
export class InvalidExpenseException extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid expense')
    this.name = 'InvalidExpenseException'
  }
}

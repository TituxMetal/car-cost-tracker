/**
 * @description Thrown when attempting to perform an operation on an invalid budget.
 */
export class InvalidBudgetException extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid budget')
    this.name = 'InvalidBudgetException'
  }
}

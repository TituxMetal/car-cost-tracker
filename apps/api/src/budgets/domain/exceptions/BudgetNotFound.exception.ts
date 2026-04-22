/**
 * @description Thrown when attempting to access a budget that does not exist.
 */
export class BudgetNotFoundException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `Budget not found: ${identifier}` : 'Budget not found')
    this.name = 'BudgetNotFoundException'
  }
}

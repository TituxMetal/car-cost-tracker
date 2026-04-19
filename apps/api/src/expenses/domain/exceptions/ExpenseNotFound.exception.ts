/**
 * @description Thrown when attempting to access an expense that does not exist.
 */
export class ExpenseNotFoundException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `Expense not found: ${identifier}` : 'Expense not found')
    this.name = 'ExpenseNotFoundException'
  }
}

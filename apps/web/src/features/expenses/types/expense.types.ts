export type ExpenseCategory = 'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER'

export interface Expense {
  id: string
  vehicleId: string
  occurredAt: string
  amountCents: number
  category: ExpenseCategory
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseInput {
  occurredAt: string
  amountCents: number
  category: ExpenseCategory
  description?: string
}

export interface UpdateExpenseInput {
  occurredAt?: string
  amountCents?: number
  category?: ExpenseCategory
  description?: string
}

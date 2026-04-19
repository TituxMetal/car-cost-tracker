import type { ExpenseCategory } from '~/expenses/domain/entities'

export class GetExpenseDto {
  id!: string
  vehicleId!: string
  occurredAt!: string
  amountCents!: number
  category!: ExpenseCategory
  description!: string | null
  createdAt!: Date
  updatedAt!: Date
}

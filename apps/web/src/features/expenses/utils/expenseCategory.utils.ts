import type { ExpenseCategory } from '../types'

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  SERVICE: 'Entretien',
  PARTS: 'Pièces',
  LABOR: `Main-d'œuvre`,
  OTHER: 'Autre'
}

export const CATEGORY_OPTIONS: Array<{ value: ExpenseCategory; label: string }> = [
  { value: 'SERVICE', label: CATEGORY_LABELS.SERVICE },
  { value: 'PARTS', label: CATEGORY_LABELS.PARTS },
  { value: 'LABOR', label: CATEGORY_LABELS.LABOR },
  { value: 'OTHER', label: CATEGORY_LABELS.OTHER }
]

export const CATEGORY_BADGE_CLASS: Record<ExpenseCategory, string> = {
  SERVICE: 'badge-primary',
  PARTS: 'badge-info',
  LABOR: 'badge-warning',
  OTHER: 'badge-neutral'
}

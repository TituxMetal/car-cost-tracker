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

export const CATEGORY_TINT_BASE =
  'inline-flex shrink-0 items-center border px-2 py-0.5 font-display text-[10px] tracking-wider uppercase'

export const CATEGORY_TINT_CLASS: Record<ExpenseCategory, string> = {
  SERVICE: 'border-accent/40 bg-accent/10 text-accent',
  PARTS: 'border-info/40 bg-info/10 text-info',
  LABOR: 'border-secondary/40 bg-secondary/10 text-secondary',
  OTHER: 'border-primary/40 bg-primary/10 text-primary'
}

import { describe, expect, it } from 'bun:test'

import type { ExpenseCategory } from '../types'

import { CATEGORY_LABELS, CATEGORY_OPTIONS } from './expenseCategory.utils'

describe('CATEGORY_LABELS', () => {
  it('provides a French label for every ExpenseCategory', () => {
    expect(CATEGORY_LABELS.SERVICE).toBe('Entretien')
    expect(CATEGORY_LABELS.PARTS).toBe('Pièces')
    expect(CATEGORY_LABELS.LABOR).toBe(`Main-d'œuvre`)
    expect(CATEGORY_LABELS.OTHER).toBe('Autre')
  })

  it('covers exactly four categories', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(4)
  })
})

describe('CATEGORY_OPTIONS', () => {
  it('lists every category with matching label', () => {
    const expected: Array<{ value: ExpenseCategory; label: string }> = [
      { value: 'SERVICE', label: 'Entretien' },
      { value: 'PARTS', label: 'Pièces' },
      { value: 'LABOR', label: `Main-d'œuvre` },
      { value: 'OTHER', label: 'Autre' }
    ]

    expect(CATEGORY_OPTIONS).toEqual(expected)
  })

  it('preserves a stable order for the select UI', () => {
    expect(CATEGORY_OPTIONS.map(option => option.value)).toEqual([
      'SERVICE',
      'PARTS',
      'LABOR',
      'OTHER'
    ])
  })
})

import { describe, expect, it } from 'bun:test'

import { PERIOD_LABELS, PERIOD_OPTIONS } from './budgetPeriod.utils'

describe('PERIOD_LABELS', () => {
  it('maps MONTHLY to "Mensuel"', () => {
    expect(PERIOD_LABELS.MONTHLY).toBe('Mensuel')
  })

  it('maps ANNUAL to "Annuel"', () => {
    expect(PERIOD_LABELS.ANNUAL).toBe('Annuel')
  })
})

describe('PERIOD_OPTIONS', () => {
  it('exposes two options in MONTHLY → ANNUAL order', () => {
    expect(PERIOD_OPTIONS).toHaveLength(2)
    expect(PERIOD_OPTIONS[0].value).toBe('MONTHLY')
    expect(PERIOD_OPTIONS[1].value).toBe('ANNUAL')
  })

  it('uses PERIOD_LABELS for each label', () => {
    expect(PERIOD_OPTIONS[0].label).toBe(PERIOD_LABELS.MONTHLY)
    expect(PERIOD_OPTIONS[1].label).toBe(PERIOD_LABELS.ANNUAL)
  })
})

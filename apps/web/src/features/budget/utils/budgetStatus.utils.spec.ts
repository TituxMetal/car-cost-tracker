import { describe, expect, it } from 'bun:test'

import type { Budget } from '../types'

import {
  NEAR_LIMIT_THRESHOLD,
  OVERSPENT_THRESHOLD,
  computeBudgetStatus,
  computeProgressState,
  deriveAnnualTargetCents,
  deriveMonthlyTargetCents
} from './budgetStatus.utils'

const mockBudget = (overrides: Partial<Budget> = {}): Budget => ({
  id: 'b1',
  vehicleId: 'v1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides
})

describe('thresholds', () => {
  it('NEAR_LIMIT_THRESHOLD is 0.80', () => {
    expect(NEAR_LIMIT_THRESHOLD).toBe(0.8)
  })

  it('OVERSPENT_THRESHOLD is 1.00', () => {
    expect(OVERSPENT_THRESHOLD).toBe(1.0)
  })
})

describe('deriveMonthlyTargetCents', () => {
  it('returns amountCents as-is for a MONTHLY budget', () => {
    const budget = mockBudget({ period: 'MONTHLY', amountCents: 25000 })

    expect(deriveMonthlyTargetCents(budget)).toBe(25000)
  })

  it('divides amountCents by 12 (rounded) for an ANNUAL budget', () => {
    const budget = mockBudget({ period: 'ANNUAL', amountCents: 100000 })

    expect(deriveMonthlyTargetCents(budget)).toBe(Math.round(100000 / 12))
  })

  it('rounds 100000 cents/year down → 8333 cents/month (8333.33 → 8333)', () => {
    const budget = mockBudget({ period: 'ANNUAL', amountCents: 100000 })

    expect(deriveMonthlyTargetCents(budget)).toBe(8333)
  })

  it('rounds 100006 cents/year up → 8334 cents/month (8333.83 → 8334)', () => {
    const budget = mockBudget({ period: 'ANNUAL', amountCents: 100006 })

    expect(deriveMonthlyTargetCents(budget)).toBe(8334)
  })
})

describe('deriveAnnualTargetCents', () => {
  it('returns amountCents as-is for an ANNUAL budget', () => {
    const budget = mockBudget({ period: 'ANNUAL', amountCents: 100000 })

    expect(deriveAnnualTargetCents(budget)).toBe(100000)
  })

  it('multiplies amountCents by 12 for a MONTHLY budget', () => {
    const budget = mockBudget({ period: 'MONTHLY', amountCents: 8500 })

    expect(deriveAnnualTargetCents(budget)).toBe(102000)
  })
})

describe('computeProgressState', () => {
  it('returns ON_TRACK when ratio is 0', () => {
    expect(computeProgressState(0, 100)).toBe('ON_TRACK')
  })

  it('returns ON_TRACK just below the NEAR_LIMIT threshold (ratio = 0.79)', () => {
    expect(computeProgressState(79, 100)).toBe('ON_TRACK')
  })

  it('returns NEAR_LIMIT exactly at the NEAR_LIMIT threshold (ratio = 0.80)', () => {
    expect(computeProgressState(80, 100)).toBe('NEAR_LIMIT')
  })

  it('returns NEAR_LIMIT just below the OVERSPENT threshold (ratio = 0.99)', () => {
    expect(computeProgressState(99, 100)).toBe('NEAR_LIMIT')
  })

  it('returns OVERSPENT exactly at the OVERSPENT threshold (ratio = 1.00)', () => {
    expect(computeProgressState(100, 100)).toBe('OVERSPENT')
  })

  it('returns OVERSPENT well above the threshold (ratio = 2.00)', () => {
    expect(computeProgressState(200, 100)).toBe('OVERSPENT')
  })

  it('returns ON_TRACK when targetCents is 0 (zero-guard)', () => {
    expect(computeProgressState(50, 0)).toBe('ON_TRACK')
  })

  it('returns ON_TRACK when targetCents is negative (defensive zero-guard)', () => {
    expect(computeProgressState(50, -10)).toBe('ON_TRACK')
  })
})

describe('computeBudgetStatus', () => {
  it('assembles the full status object for an on-track budget', () => {
    const result = computeBudgetStatus(3000, 10000)

    expect(result).toEqual({
      spentCents: 3000,
      targetCents: 10000,
      remainingCents: 7000,
      progressRatio: 0.3,
      state: 'ON_TRACK'
    })
  })

  it('returns a negative remainingCents when overspent', () => {
    const result = computeBudgetStatus(15000, 10000)

    expect(result.remainingCents).toBe(-5000)
    expect(result.state).toBe('OVERSPENT')
  })

  it('sets progressRatio to 0 when targetCents is 0 (zero-guard)', () => {
    const result = computeBudgetStatus(500, 0)

    expect(result.progressRatio).toBe(0)
    expect(result.state).toBe('ON_TRACK')
  })

  it('classifies NEAR_LIMIT at exactly 0.80 ratio inside the status object', () => {
    const result = computeBudgetStatus(8000, 10000)

    expect(result.progressRatio).toBe(0.8)
    expect(result.state).toBe('NEAR_LIMIT')
  })
})

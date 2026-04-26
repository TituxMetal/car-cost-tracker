import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { act, cleanup, render, screen } from '~/test-utils'

import { $mileageHistoryTick } from '../store'
import type { MileageHistoryEntry } from '../utils'

import { MileageHistoryCard } from './MileageHistoryCard'

const VEHICLE_ID = 'v-card'
const KEY = `mileage-history:${VEHICLE_ID}`

const buildEntry = (overrides: Partial<MileageHistoryEntry> = {}): MileageHistoryEntry => ({
  recordedAt: '2026-04-26T10:00:00.000Z',
  mileage: 100,
  delta: 10,
  ...overrides
})

const seed = (entries: MileageHistoryEntry[]) => {
  window.localStorage.setItem(KEY, JSON.stringify(entries))
  act(() => {
    $mileageHistoryTick.set($mileageHistoryTick.get() + 1)
  })
}

describe('MileageHistoryCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    window.localStorage.clear()
    act(() => {
      $mileageHistoryTick.set(0)
    })
  })

  afterEach(() => {
    window.localStorage.clear()
    act(() => {
      $mileageHistoryTick.set(0)
    })
  })

  it('should render the kicker label', () => {
    render(<MileageHistoryCard vehicleId={VEHICLE_ID} />)

    expect(screen.getByText(/historique compteur/i)).toBeInTheDocument()
  })

  it('should render the empty state when no entries exist', () => {
    render(<MileageHistoryCard vehicleId={VEHICLE_ID} />)

    expect(screen.getByText(/aucune mise à jour/i)).toBeInTheDocument()
  })

  it('should render entries with date, mileage, and delta', () => {
    seed([
      buildEntry({
        recordedAt: '2026-04-26T10:00:00.000Z',
        mileage: 92500,
        delta: 200
      })
    ])

    render(<MileageHistoryCard vehicleId={VEHICLE_ID} />)

    expect(screen.getByText('92500 km')).toBeInTheDocument()
    expect(screen.getByText('+ 200')).toBeInTheDocument()
    const timeElement = screen.getByText('26/04/2026')
    expect(timeElement.tagName).toBe('TIME')
    expect(timeElement).toHaveAttribute('datetime', '2026-04-26T10:00:00.000Z')
  })

  it('should cap visible entries at 10 even when more are stored', () => {
    const entries = Array.from({ length: 15 }, (_, index) =>
      buildEntry({ mileage: 1000 + index, recordedAt: `2026-04-${10 + index}T10:00:00.000Z` })
    )
    seed(entries)

    render(<MileageHistoryCard vehicleId={VEHICLE_ID} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(10)
  })

  it('should not render the empty state once entries exist', () => {
    seed([buildEntry()])

    render(<MileageHistoryCard vehicleId={VEHICLE_ID} />)

    expect(screen.queryByText(/aucune mise à jour/i)).not.toBeInTheDocument()
  })
})

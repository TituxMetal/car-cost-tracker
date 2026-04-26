import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import type { MileageHistoryEntry } from './mileageHistory.utils'
import { appendMileageHistory, getMileageHistory } from './mileageHistory.utils'

const VEHICLE_ID = 'v1'
const KEY = `mileage-history:${VEHICLE_ID}`

const buildEntry = (overrides: Partial<MileageHistoryEntry> = {}): MileageHistoryEntry => ({
  recordedAt: '2026-04-26T10:00:00.000Z',
  mileage: 100,
  delta: 10,
  ...overrides
})

describe('mileageHistory.utils', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  describe('getMileageHistory', () => {
    it('should return an empty array when no key exists', () => {
      expect(getMileageHistory(VEHICLE_ID)).toEqual([])
    })

    it('should return the parsed array for valid JSON', () => {
      const entries = [buildEntry({ mileage: 200 }), buildEntry({ mileage: 100 })]
      window.localStorage.setItem(KEY, JSON.stringify(entries))

      expect(getMileageHistory(VEHICLE_ID)).toEqual(entries)
    })

    it('should return an empty array and warn when JSON is malformed', () => {
      const warn = spyOn(console, 'warn').mockImplementation(mock(() => {}))
      window.localStorage.setItem(KEY, '{not-json')

      expect(getMileageHistory(VEHICLE_ID)).toEqual([])
      expect(warn).toHaveBeenCalled()

      warn.mockRestore()
    })

    it('should return an empty array when stored value is not an array', () => {
      window.localStorage.setItem(KEY, JSON.stringify({ not: 'an array' }))

      expect(getMileageHistory(VEHICLE_ID)).toEqual([])
    })

    it('should keep histories isolated per vehicleId', () => {
      const v1Entries = [buildEntry({ mileage: 100 })]
      const v2Entries = [buildEntry({ mileage: 999 })]
      window.localStorage.setItem('mileage-history:v1', JSON.stringify(v1Entries))
      window.localStorage.setItem('mileage-history:v2', JSON.stringify(v2Entries))

      expect(getMileageHistory('v1')).toEqual(v1Entries)
      expect(getMileageHistory('v2')).toEqual(v2Entries)
    })
  })

  describe('appendMileageHistory', () => {
    it('should write valid JSON to localStorage', () => {
      const entry = buildEntry()

      appendMileageHistory(VEHICLE_ID, entry)

      const raw = window.localStorage.getItem(KEY)
      expect(raw).not.toBeNull()
      expect(JSON.parse(raw as string)).toEqual([entry])
    })

    it('should order entries most-recent-first', () => {
      const first = buildEntry({ mileage: 100, recordedAt: '2026-04-26T08:00:00.000Z' })
      const second = buildEntry({ mileage: 200, recordedAt: '2026-04-26T10:00:00.000Z' })

      appendMileageHistory(VEHICLE_ID, first)
      appendMileageHistory(VEHICLE_ID, second)

      expect(getMileageHistory(VEHICLE_ID)).toEqual([second, first])
    })

    it('should cap stored entries at 20 (drops oldest)', () => {
      for (let i = 0; i < 25; i = i + 1) {
        appendMileageHistory(VEHICLE_ID, buildEntry({ mileage: i }))
      }

      const stored = getMileageHistory(VEHICLE_ID)
      expect(stored).toHaveLength(20)
      expect(stored[0]?.mileage).toBe(24)
      expect(stored[19]?.mileage).toBe(5)
    })
  })
})

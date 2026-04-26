import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { act, renderHook } from '~/test-utils'

import { $mileageHistoryTick } from '../store'
import type { MileageHistoryEntry } from '../utils'

import { useMileageHistory } from './useMileageHistory'

const buildEntry = (overrides: Partial<MileageHistoryEntry> = {}): MileageHistoryEntry => ({
  recordedAt: '2026-04-26T10:00:00.000Z',
  mileage: 100,
  delta: 10,
  ...overrides
})

describe('useMileageHistory', () => {
  beforeEach(() => {
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

  it('should return an empty entries array for a fresh vehicleId', () => {
    const { result } = renderHook(() => useMileageHistory('v-fresh'))

    expect(result.current.entries).toEqual([])
  })

  it('should append an entry, persist it, and re-render with the new entry', () => {
    const { result } = renderHook(() => useMileageHistory('v1'))
    const entry = buildEntry()

    act(() => {
      result.current.append(entry)
    })

    expect(result.current.entries).toEqual([entry])
    const stored = window.localStorage.getItem('mileage-history:v1')
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored as string)).toEqual([entry])
  })

  it('should keep histories isolated per vehicleId', () => {
    const v1Hook = renderHook(() => useMileageHistory('v1'))
    const v2Hook = renderHook(() => useMileageHistory('v2'))

    act(() => {
      v1Hook.result.current.append(buildEntry({ mileage: 100 }))
    })
    act(() => {
      v2Hook.result.current.append(buildEntry({ mileage: 999 }))
    })

    expect(v1Hook.result.current.entries.map(entry => entry.mileage)).toEqual([100])
    expect(v2Hook.result.current.entries.map(entry => entry.mileage)).toEqual([999])
  })

  it('should return an empty entries array and a no-op append when vehicleId is undefined', () => {
    const { result } = renderHook(() => useMileageHistory(undefined))

    expect(result.current.entries).toEqual([])

    act(() => {
      result.current.append(buildEntry())
    })

    expect(result.current.entries).toEqual([])
    expect(window.localStorage.length).toBe(0)
  })

  it('should propagate appends across hook instances via the tick atom', () => {
    const reader = renderHook(() => useMileageHistory('v-shared'))
    const writer = renderHook(() => useMileageHistory('v-shared'))

    expect(reader.result.current.entries).toEqual([])

    act(() => {
      writer.result.current.append(buildEntry({ mileage: 555 }))
    })

    expect(reader.result.current.entries.map(entry => entry.mileage)).toEqual([555])
  })
})

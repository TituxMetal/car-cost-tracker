import { describe, expect, it } from 'bun:test'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'
import { GetCheckTypeDto } from '~/check-types/application/dtos'

import { CheckStatusSummaryDto, GetCheckLogDto } from '../dtos'

import { CheckLogMapper } from './CheckLog.mapper'

describe('CheckLogMapper', () => {
  const makeCheckType = (overrides: Partial<GetCheckTypeDto> = {}): GetCheckTypeDto =>
    Object.assign(new GetCheckTypeDto(), {
      id: '660e8400-e29b-41d4-a716-446655440000',
      vehicleId: '770e8400-e29b-41d4-a716-446655440000',
      name: 'Vidange',
      description: null,
      intervalDays: 7,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      ...overrides
    })

  const makeEntity = (
    completedAt: string,
    nextDueAt: string,
    notes: string | null = 'All good'
  ): CheckLogEntity =>
    new CheckLogEntity(
      new CheckLogIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      '660e8400-e29b-41d4-a716-446655440000',
      new CompletedAtValueObject(completedAt),
      notes,
      nextDueAt,
      new Date('2026-03-15T10:00:00Z'),
      new Date('2026-03-15T10:00:00Z')
    )

  const toDateStr = (date: Date): string => {
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, '0')
    const d = String(date.getUTCDate()).padStart(2, '0')

    return `${y}-${m}-${d}`
  }

  describe('toGetCheckLogDto', () => {
    it('should map entity to DTO with all fields', () => {
      const entity = makeEntity('2026-03-14', '2026-03-21')
      const dto = CheckLogMapper.toGetCheckLogDto(entity, 'Vidange')

      expect(dto).toBeInstanceOf(GetCheckLogDto)
      expect(dto.id).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(dto.checkTypeId).toBe('660e8400-e29b-41d4-a716-446655440000')
      expect(dto.checkTypeName).toBe('Vidange')
      expect(dto.completedAt).toBe('2026-03-14')
      expect(dto.notes).toBe('All good')
      expect(dto.nextDueAt).toBe('2026-03-21')
      expect(dto.createdAt).toEqual(new Date('2026-03-15T10:00:00Z'))
    })

    it('should map entity with null notes', () => {
      const entity = makeEntity('2026-03-14', '2026-03-21', null)
      const dto = CheckLogMapper.toGetCheckLogDto(entity, 'Vidange')

      expect(dto).toBeInstanceOf(GetCheckLogDto)
      expect(dto.notes).toBeNull()
    })

    it('should return a GetCheckLogDto instance', () => {
      const entity = makeEntity('2026-03-14', '2026-03-21')
      const dto = CheckLogMapper.toGetCheckLogDto(entity, 'Vidange')

      expect(dto).toBeInstanceOf(GetCheckLogDto)
    })
  })

  describe('toCheckStatusSummaryDto', () => {
    it('should return "never" when no log exists', () => {
      const checkType = makeCheckType()
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, null)

      expect(summary).toBeInstanceOf(CheckStatusSummaryDto)
      expect(summary.status).toBe('never')
      expect(summary.lastCompletedAt).toBeNull()
      expect(summary.nextDueAt).toBeNull()
      expect(summary.checkTypeId).toBe(checkType.id)
      expect(summary.checkTypeName).toBe(checkType.name)
      expect(summary.intervalDays).toBe(checkType.intervalDays)
    })

    it('should return "overdue" when nextDueAt is in the past', () => {
      const checkType = makeCheckType()
      const entity = makeEntity('2020-01-01', '2020-01-08')
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary).toBeInstanceOf(CheckStatusSummaryDto)
      expect(summary.status).toBe('overdue')
    })

    it('should return "due-soon" when nextDueAt is today (boundary: 0 days)', () => {
      const checkType = makeCheckType()
      const entity = makeEntity('2020-01-01', toDateStr(new Date()))
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary.status).toBe('due-soon')
    })

    it('should return "due-soon" when nextDueAt is tomorrow', () => {
      const checkType = makeCheckType()
      const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      const entity = makeEntity('2020-01-01', toDateStr(tomorrow))
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary.status).toBe('due-soon')
    })

    it('should return "due-soon" when nextDueAt is exactly 2 days away (boundary)', () => {
      const checkType = makeCheckType()
      const inTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      const entity = makeEntity('2020-01-01', toDateStr(inTwoDays))
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary.status).toBe('due-soon')
    })

    it('should return "on-time" when nextDueAt is exactly 3 days away (boundary)', () => {
      const checkType = makeCheckType()
      const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      const entity = makeEntity('2020-01-01', toDateStr(inThreeDays))
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary.status).toBe('on-time')
    })

    it('should return "on-time" when nextDueAt is far in the future', () => {
      const checkType = makeCheckType()
      const entity = makeEntity('2026-03-14', '2099-01-01')
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary).toBeInstanceOf(CheckStatusSummaryDto)
      expect(summary.status).toBe('on-time')
    })

    it('should include checkType fields in the summary', () => {
      const checkType = makeCheckType({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Check',
        intervalDays: 14
      })
      const entity = makeEntity('2026-03-14', '2099-01-01')
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary).toBeInstanceOf(CheckStatusSummaryDto)
      expect(summary.checkTypeId).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(summary.checkTypeName).toBe('Test Check')
      expect(summary.intervalDays).toBe(14)
    })

    it('should return a CheckStatusSummaryDto instance', () => {
      const checkType = makeCheckType()
      const entity = makeEntity('2026-03-14', '2099-01-01')
      const summary = CheckLogMapper.toCheckStatusSummaryDto(checkType, entity)

      expect(summary).toBeInstanceOf(CheckStatusSummaryDto)
    })
  })
})

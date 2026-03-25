import { describe, expect, it } from 'bun:test'

import { CHECK_LOG_VALIDATION } from '../validation'
import { CheckLogIdValueObject, CompletedAtValueObject } from '../value-objects'

import { CheckLogEntity } from './CheckLog.entity'

describe('CheckLogEntity', () => {
  const defaultProps = {
    id: new CheckLogIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
    checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
    completedAt: new CompletedAtValueObject('2026-03-15'),
    notes: 'All good',
    nextDueAt: '2026-03-22',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('should create a valid entity with all fields', () => {
    const entity = new CheckLogEntity(
      defaultProps.id,
      defaultProps.checkTypeId,
      defaultProps.completedAt,
      defaultProps.notes,
      defaultProps.nextDueAt,
      defaultProps.createdAt,
      defaultProps.updatedAt
    )

    expect(entity).toBeInstanceOf(CheckLogEntity)
    expect(entity.id).toBe(defaultProps.id)
    expect(entity.checkTypeId).toBe(defaultProps.checkTypeId)
    expect(entity.completedAt).toBe(defaultProps.completedAt)
    expect(entity.notes).toBe(defaultProps.notes)
    expect(entity.nextDueAt).toBe(defaultProps.nextDueAt)
    expect(entity.createdAt).toBe(defaultProps.createdAt)
    expect(entity.updatedAt).toBe(defaultProps.updatedAt)
  })

  it('should create a valid entity with null notes', () => {
    const entity = new CheckLogEntity(
      defaultProps.id,
      defaultProps.checkTypeId,
      defaultProps.completedAt,
      null, // notes is null
      defaultProps.nextDueAt,
      defaultProps.createdAt,
      defaultProps.updatedAt
    )

    expect(entity).toBeInstanceOf(CheckLogEntity)
    expect(entity.notes).toBeNull()
  })

  it('should reject notes exceeding max length', () => {
    const longNotes = 'a'.repeat(CHECK_LOG_VALIDATION.NOTES.MAX_LENGTH + 1)

    expect(() => {
      new CheckLogEntity(
        defaultProps.id,
        defaultProps.checkTypeId,
        defaultProps.completedAt,
        longNotes, // Exceeds max length
        defaultProps.nextDueAt,
        defaultProps.createdAt,
        defaultProps.updatedAt
      )
    }).toThrow(`Notes cannot exceed ${CHECK_LOG_VALIDATION.NOTES.MAX_LENGTH} characters`)
  })

  it('should have all properties readonly (no update method)', () => {
    const entity = new CheckLogEntity(
      defaultProps.id,
      defaultProps.checkTypeId,
      defaultProps.completedAt,
      defaultProps.notes,
      defaultProps.nextDueAt,
      defaultProps.createdAt,
      defaultProps.updatedAt
    )

    expect(entity).toBeInstanceOf(CheckLogEntity)
    expect(entity.id).toBe(defaultProps.id)
    expect(entity.checkTypeId).toBe(defaultProps.checkTypeId)
    expect(entity.completedAt).toBe(defaultProps.completedAt)
    expect(entity.notes).toBe(defaultProps.notes)
    expect(entity.nextDueAt).toBe(defaultProps.nextDueAt)
    expect(entity.createdAt).toBe(defaultProps.createdAt)
    expect(entity.updatedAt).toBe(defaultProps.updatedAt)

    // Verify no update methods exist (this is more of a TypeScript compile-time check, but we can at least verify no methods are present)
    const entityKeys = Object.keys(entity)
    expect(entityKeys).toEqual(
      expect.arrayContaining([
        'id',
        'checkTypeId',
        'completedAt',
        'notes',
        'nextDueAt',
        'createdAt',
        'updatedAt'
      ])
    )
    const entityMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(entity)).filter(
      prop =>
        typeof (entity as unknown as Record<string, unknown>)[prop] === 'function' &&
        prop !== 'constructor'
    )
    expect(entityMethods).toEqual([])
  })
})

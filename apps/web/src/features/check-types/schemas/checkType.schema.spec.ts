import { describe, expect, it } from 'bun:test'

import { createCheckTypeSchema, updateCheckTypeSchema } from './checkType.schema'

describe('createCheckTypeSchema', () => {
  it('should validate with all fields', () => {
    const validCheckType = {
      name: 'Oil Level Check',
      intervalDays: 7,
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(validCheckType)

    expect(result.success).toBe(true)
  })

  it('should validate with only required fields (name + intervalDays)', () => {
    const validCheckType = {
      name: 'Oil Level Check',
      intervalDays: 7
    }

    const result = createCheckTypeSchema.safeParse(validCheckType)

    expect(result.success).toBe(true)
  })

  it('should reject missing name', () => {
    const invalidCheckType = {
      intervalDays: 7,
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)

    expect(result.error?.issues[0].message).toBe(`Le nom est requis.`)
  })

  it('should reject name shorter than 5 characters', () => {
    const invalidCheckType = {
      name: 'Oil',
      intervalDays: 7,
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`Le nom doit comporter au moins 5 caractères.`)
  })

  it('should reject name longer than 100 characters', () => {
    const invalidCheckType = {
      name: 'O'.repeat(101),
      intervalDays: 7,
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`Le nom doit comporter au maximum 100 caractères.`)
  })

  it('should reject missing intervalDays', () => {
    const invalidCheckType = {
      name: 'Oil Level Check',
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`L'intervalle en jours est requis.`)
  })

  it('should reject intervalDays less than 1', () => {
    const invalidCheckType = {
      name: 'Oil Level Check',
      intervalDays: 0,
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`L'intervalle en jours doit être au moins de 1.`)
  })

  it('should reject non-integer intervalDays', () => {
    const invalidCheckType = {
      name: 'Oil Level Check',
      intervalDays: 7.5,
      description: 'Check the oil level every week to ensure proper engine function.'
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`L'intervalle en jours doit être un entier.`)
  })

  it('should reject description longer than 500 characters', () => {
    const invalidCheckType = {
      name: 'Oil Level Check',
      intervalDays: 7,
      description: 'D'.repeat(501)
    }

    const result = createCheckTypeSchema.safeParse(invalidCheckType)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      `La description doit comporter au maximum 500 caractères.`
    )
  })
})

describe('updateCheckTypeSchema', () => {
  it('should accept empty object (all fields optional)', () => {
    const validUpdate = {}

    const result = updateCheckTypeSchema.safeParse(validUpdate)

    expect(result.success).toBe(true)
  })

  it('should accept partial update with single field', () => {
    const validUpdate = { name: 'Updated Name' }

    const result = updateCheckTypeSchema.safeParse(validUpdate)

    expect(result.success).toBe(true)
  })

  it('should accept null description in update', () => {
    const validUpdate = { description: null }

    const result = updateCheckTypeSchema.safeParse(validUpdate)

    expect(result.success).toBe(true)
  })

  it('should still validate field constraints', () => {
    const invalidUpdate = { name: 'Up' }

    const result = updateCheckTypeSchema.safeParse(invalidUpdate)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`Le nom doit comporter au moins 5 caractères.`)
  })
})

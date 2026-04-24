import { describe, expect, it } from 'bun:test'

import { createUserSchema } from './createUser.schema'

describe('createUserSchema', () => {
  it('validates a complete payload', () => {
    const result = createUserSchema.safeParse({
      username: 'newtester',
      email: 'tester@example.com',
      password: 'secret123',
      firstName: 'New',
      lastName: 'Tester'
    })

    expect(result.success).toBe(true)
  })

  it('validates a minimal payload (no firstName / lastName)', () => {
    const result = createUserSchema.safeParse({
      username: 'newtester',
      email: 'tester@example.com',
      password: 'secret123'
    })

    expect(result.success).toBe(true)
  })

  it('rejects a username shorter than 3 chars', () => {
    const result = createUserSchema.safeParse({
      username: 'ab',
      email: 'tester@example.com',
      password: 'secret123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects a username with disallowed characters', () => {
    const result = createUserSchema.safeParse({
      username: 'bad name!',
      email: 'tester@example.com',
      password: 'secret123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = createUserSchema.safeParse({
      username: 'newtester',
      email: 'not-an-email',
      password: 'secret123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than 8 chars', () => {
    const result = createUserSchema.safeParse({
      username: 'newtester',
      email: 'tester@example.com',
      password: 'short'
    })

    expect(result.success).toBe(false)
  })
})

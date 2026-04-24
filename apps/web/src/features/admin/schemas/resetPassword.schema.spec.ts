import { describe, expect, it } from 'bun:test'

import { resetPasswordSchema } from './resetPassword.schema'

describe('resetPasswordSchema', () => {
  it('validates an 8-char password', () => {
    const result = resetPasswordSchema.safeParse({ password: 'secret12' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty password', () => {
    const result = resetPasswordSchema.safeParse({ password: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than 8 chars', () => {
    const result = resetPasswordSchema.safeParse({ password: 'short' })
    expect(result.success).toBe(false)
  })
})

import { describe, expect, it } from 'bun:test'

import { changePasswordSchema } from './changePassword.schema'

describe('changePasswordSchema', () => {
  it('should validate valid change password request', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    })
    expect(result.success).toBe(true)
  })

  it('should reject when new passwords do not match', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmPassword: 'different123'
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    })
    expect(result.success).toBe(false)
  })
})

import { describe, expect, it } from 'bun:test'

import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from './auth.schema'

describe('loginSchema', () => {
  it('should validate a valid login request', () => {
    const validLogin = {
      email: 'test@example.com',
      password: 'password123'
    }

    const result = loginSchema.safeParse(validLogin)

    expect(result.success).toBe(true)
  })

  it('should reject invalid email format', () => {
    const invalidLogin = {
      email: 'not-an-email',
      password: 'password123'
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Adresse email invalide')
    }
  })

  it('should reject empty password', () => {
    const invalidLogin = {
      email: 'test@example.com',
      password: ''
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Mot de passe requis')
    }
  })

  it('should reject short password', () => {
    const invalidLogin = {
      email: 'test@example.com',
      password: 'pass'
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le mot de passe doit contenir au moins 8 caractères'
      )
    }
  })
})

describe('signupSchema', () => {
  it('should validate a valid signup request', () => {
    const validSignup = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(validSignup)

    expect(result.success).toBe(true)
  })

  it('should reject empty username', () => {
    const invalidSignup = {
      username: '',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nom d'utilisateur requis")
    }
  })

  it('should reject short username', () => {
    const invalidSignup = {
      username: 'ab',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le nom d'utilisateur doit contenir au moins 3 caractères"
      )
    }
  })

  it('should reject too long username', () => {
    const invalidSignup = {
      username: 'a'.repeat(51),
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le nom d'utilisateur ne doit pas dépasser 50 caractères"
      )
    }
  })

  it('should reject invalid email format', () => {
    const invalidSignup = {
      username: 'testuser',
      email: 'not-an-email',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Adresse email invalide')
    }
  })

  it('should reject empty password', () => {
    const invalidSignup = {
      username: 'testuser',
      email: 'test@example.com',
      password: ''
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Mot de passe requis')
    }
  })

  it('should reject short password', () => {
    const invalidSignup = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'pass'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le mot de passe doit contenir au moins 8 caractères'
      )
    }
  })
})

describe('forgotPasswordSchema', () => {
  it('should validate a valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('should validate matching passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'password123',
      confirmPassword: 'password123'
    })
    expect(result.success).toBe(true)
  })

  it('should reject non-matching passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'password123',
      confirmPassword: 'different123'
    })
    expect(result.success).toBe(false)
  })

  it('should reject short password', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'short',
      confirmPassword: 'short'
    })
    expect(result.success).toBe(false)
  })
})

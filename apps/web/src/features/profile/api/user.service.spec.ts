import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup } from '~/test-utils'
import type { ApiResponse } from '~/types/api.types'
import type { User } from '~/types/user.types'

import type { UpdateProfileSchema } from '../schemas/user.schema'

const mockPatch = mock<() => Promise<ApiResponse>>(() => Promise.resolve({ success: true }))

mock.module('~/lib/apiRequest', () => ({
  api: {
    get: mock(() => Promise.resolve({})),
    post: mock(() => Promise.resolve({})),
    patch: mockPatch,
    put: mock(() => Promise.resolve({})),
    delete: mock(() => Promise.resolve({}))
  },
  apiRequest: mock(() => Promise.resolve({}))
}))

import { updateProfile } from './user.service'

describe('updateProfile', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    mockPatch.mockClear()
  })

  it('calls api.patch with correct endpoint and data', async () => {
    const data: UpdateProfileSchema = {
      username: 'valid_user',
      firstName: 'John',
      lastName: 'Doe'
    }
    const mockUser: User = {
      id: '1',
      username: 'valid_user',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true,
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    mockPatch.mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await updateProfile(data)

    expect(mockPatch).toHaveBeenCalledWith('/api/users/me', data)
    expect(result).toEqual(mockUser)
  })

  it('handles partial updates', async () => {
    const data: UpdateProfileSchema = { firstName: 'Jane' }
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      emailVerified: true,
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    mockPatch.mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await updateProfile(data)

    expect(mockPatch).toHaveBeenCalledWith('/api/users/me', data)
    expect(result).toEqual(mockUser)
  })

  it('throws error on failed update', async () => {
    const data: UpdateProfileSchema = {
      username: 'invalid_user',
      firstName: 'John',
      lastName: 'Doe'
    }

    mockPatch.mockResolvedValueOnce({
      success: false,
      message: 'Validation failed'
    })

    await expect(updateProfile(data)).rejects.toThrow('Validation failed')
  })

  it('handles network errors', async () => {
    const data: UpdateProfileSchema = {
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe'
    }

    mockPatch.mockImplementation(() => Promise.reject(new Error('Network error')))

    await expect(updateProfile(data)).rejects.toThrow('Network error')
  })
})

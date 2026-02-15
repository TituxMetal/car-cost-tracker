import { describe, expect, it } from 'bun:test'

import { handleApiResponse } from './handleApiResponse'

describe('handleApiResponse', () => {
  it('should return data when response is successful with data', () => {
    const mockResponse = {
      success: true,
      data: { id: '123', name: 'Test Vehicle' }
    }

    const result = handleApiResponse(mockResponse)

    expect(result).toEqual({ id: '123', name: 'Test Vehicle' })
  })

  it('should throw with response message when response fails', () => {
    const mockResponse = {
      success: false,
      message: 'Unauthorized access'
    }

    expect(() => handleApiResponse(mockResponse)).toThrow('Unauthorized access')
  })

  it('should throw with default message when response fails without message', () => {
    const mockResponse = {
      success: false
    }

    expect(() => handleApiResponse(mockResponse)).toThrow('API request failed')
  })

  it('should throw when response is successful but has no data', () => {
    const mockResponse = {
      success: true,
      data: null
    }

    expect(() => handleApiResponse(mockResponse)).toThrow('API request failed')
  })
})

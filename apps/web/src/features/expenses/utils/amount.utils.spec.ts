import { describe, expect, it } from 'bun:test'

import { formatEuros, parseEurosToCents } from './amount.utils'

describe('formatEuros', () => {
  it('formats 0 cents as zero euros', () => {
    const result = formatEuros(0)

    expect(result).toMatch(/^0,00\s*€/)
  })

  it('formats 100 cents as one euro', () => {
    const result = formatEuros(100)

    expect(result).toMatch(/^1,00\s*€/)
  })

  it('formats sub-euro amounts with a comma decimal', () => {
    const result = formatEuros(8950)

    expect(result).toMatch(/^89,50\s*€/)
  })

  it('formats large amounts with a thousands separator', () => {
    const result = formatEuros(123456789)

    expect(result).toMatch(/^1\s234\s567,89\s*€/)
  })
})

describe('parseEurosToCents', () => {
  it('parses French notation with a comma', () => {
    const result = parseEurosToCents('89,50')

    expect(result).toBe(8950)
  })

  it('parses English notation with a dot', () => {
    const result = parseEurosToCents('89.50')

    expect(result).toBe(8950)
  })

  it('parses an integer string without separator', () => {
    const result = parseEurosToCents('89')

    expect(result).toBe(8900)
  })

  it('parses values greater than one thousand', () => {
    const result = parseEurosToCents('1234,56')

    expect(result).toBe(123456)
  })

  it('rounds sub-cent values to the nearest cent', () => {
    const result = parseEurosToCents('2,995')

    expect(result).toBe(300)
  })

  it('throws on an empty string', () => {
    expect(() => parseEurosToCents('')).toThrow('Invalid euro amount: ""')
  })

  it('throws on non-numeric input', () => {
    expect(() => parseEurosToCents('abc')).toThrow('Invalid euro amount: "abc"')
  })

  it('throws on a negative sign', () => {
    expect(() => parseEurosToCents('-5')).toThrow('Negative euro amounts are not allowed: "-5"')
  })

  it('throws when more than one separator is present', () => {
    expect(() => parseEurosToCents('89,,50')).toThrow(
      'Invalid euro amount with multiple separators: "89,,50"'
    )
    expect(() => parseEurosToCents('8.9.5')).toThrow(
      'Invalid euro amount with multiple separators: "8.9.5"'
    )
  })
})

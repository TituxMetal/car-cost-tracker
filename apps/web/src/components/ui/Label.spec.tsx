import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render } from '~/test-utils'

import { Label } from './Label'

describe('Label', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a label element with children', () => {
    const { getByText } = render(<Label>Test Label</Label>)

    const label = getByText('Test Label')

    expect(label).toBeInTheDocument()
  })

  it('should apply base styling classes', () => {
    const { getByText } = render(<Label>Test Label</Label>)

    const label = getByText('Test Label')

    expect(label).toHaveClass('font-medium')
    expect(label).toHaveClass('text-zinc-300')
  })

  it('should show required indicator when required is true', () => {
    const { getByText } = render(<Label required>Test Label</Label>)

    const label = getByText('Test Label')
    const requiredIndicator = getByText('*')

    expect(label).toBeInTheDocument()
    expect(requiredIndicator).toBeInTheDocument()
  })

  it('should not show required indicator when required is false', () => {
    const { queryByText } = render(<Label>Test Label</Label>)

    const label = queryByText('Test Label')
    const requiredIndicator = queryByText('*')

    expect(label).toBeInTheDocument()
    expect(requiredIndicator).not.toBeInTheDocument()
  })

  it('should append custom className', () => {
    const { getByText } = render(<Label className='custom-class'>Test Label</Label>)

    const label = getByText('Test Label')

    expect(label).toHaveClass('custom-class')
  })

  it('should forward ref to label element', () => {
    const ref = { current: null }
    const { getByText } = render(<Label ref={ref}>Test Label</Label>)

    const label = getByText('Test Label')

    expect(ref.current === label).toBe(true)
  })

  it('should pass htmlFor to the label element', () => {
    const { getByText } = render(<Label htmlFor='test-id'>Test Label</Label>)

    const label = getByText('Test Label')

    expect(label).toHaveAttribute('for', 'test-id')
  })
})

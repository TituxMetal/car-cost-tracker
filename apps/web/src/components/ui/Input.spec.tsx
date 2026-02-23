import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render } from '~/test-utils'

import { Input } from './Input'

describe('Input', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render an input element', () => {
    const { getByRole } = render(<Input />)

    const input = getByRole('textbox')

    expect(input).toBeInTheDocument()
  })

  it('should render with a label when provided', () => {
    const { getByLabelText } = render(<Input label='Test Label' />)

    const input = getByLabelText('Test Label')

    expect(input).toBeInTheDocument()
  })

  it('should use default type of text', () => {
    const { getByRole } = render(<Input />)

    const input = getByRole('textbox')

    expect(input).toHaveAttribute('type', 'text')
  })

  it('should accept custom type prop', () => {
    const { getByRole } = render(<Input type='email' />)

    const input = getByRole('textbox')

    expect(input).toHaveAttribute('type', 'email')
  })

  it('should display error message when error prop is provided', () => {
    const { getByText } = render(<Input error='Test Error' />)

    const errorMessage = getByText('Test Error')

    expect(errorMessage).toBeInTheDocument()
  })

  it('should set aria-invalid when error is present', () => {
    const { getByRole } = render(<Input error='Test Error' />)

    const input = getByRole('textbox')

    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('should not set aria-invalid when no error is present', () => {
    const { getByRole } = render(<Input />)

    const input = getByRole('textbox')

    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('should link error message via aria-describedby', () => {
    const { getByRole, getByText } = render(<Input error='Test Error' />)

    const input = getByRole('textbox')
    const errorMessage = getByText('Test Error')

    expect(input).toHaveAttribute('aria-describedby', errorMessage.id)
  })

  it('should apply fullWidth class when fullWidth is true', () => {
    const { getByRole } = render(<Input fullWidth />)

    const input = getByRole('textbox')

    expect(input).toHaveClass('w-full')
  })

  it('should forward ref to input element', () => {
    const ref = { current: null }

    render(<Input ref={ref} />)

    expect(ref.current).not.toBeNull()
  })

  it('should call onChange when text is entered', () => {
    const handleChange = mock(() => {})
    const { getByRole } = render(<Input onChange={handleChange} />)

    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test' } })

    expect(handleChange).toHaveBeenCalled()
  })
})

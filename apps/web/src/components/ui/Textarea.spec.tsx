import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render } from '~/test-utils'

import { Textarea } from './Textarea'

describe('Textarea', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a textarea element', () => {
    const { getByRole } = render(<Textarea />)

    const textarea = getByRole('textbox')

    expect(textarea).toBeInTheDocument()
  })

  it('should render with a label when provided', () => {
    const { getByLabelText } = render(<Textarea label='Description' />)

    const textarea = getByLabelText('Description')

    expect(textarea).toBeInTheDocument()
  })

  it('should display error message when error prop is provided', () => {
    const { getByText } = render(<Textarea error='This field is required' />)

    const errorMessage = getByText('This field is required')

    expect(errorMessage).toBeInTheDocument()
  })

  it('should set aria-invalid when error is present', () => {
    const { getByRole } = render(<Textarea error='This field is required' />)

    const textarea = getByRole('textbox')

    expect(textarea).toHaveAttribute('aria-invalid', 'true')
  })

  it('should link error message via aria-describedby', () => {
    const { getByRole, getByText } = render(<Textarea error='This field is required' />)

    const textarea = getByRole('textbox')
    const errorMessage = getByText('This field is required')

    expect(textarea).toHaveAttribute('aria-describedby', errorMessage.id)
  })

  it('should apply fullWidth class when fullWidth is true', () => {
    const { getByRole } = render(<Textarea fullWidth />)

    const textarea = getByRole('textbox')

    expect(textarea).toHaveClass('w-full')
  })

  it('should use default rows of 3', () => {
    const { getByRole } = render(<Textarea />)

    const textarea = getByRole('textbox')

    expect(textarea).toHaveAttribute('rows', '3')
  })

  it('should accept custom rows prop', () => {
    const { getByRole } = render(<Textarea rows={5} />)

    const textarea = getByRole('textbox')

    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('should forward ref to textarea element', () => {
    const ref = { current: null }
    const { getByRole } = render(<Textarea ref={ref} />)

    const textarea = getByRole('textbox')

    expect(ref.current === textarea).toBe(true)
  })

  it('should call onChange when text is entered', () => {
    const handleChange = mock(() => {})
    const { getByRole } = render(<Textarea onChange={handleChange} />)

    const textarea = getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'New text' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})

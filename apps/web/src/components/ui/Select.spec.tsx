import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render } from '~/test-utils'

import type { SelectOption } from './Select'
import { Select } from './Select'

const mockOptions: SelectOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' }
]

describe('Select', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render all options', () => {
    const { getByText, getByRole } = render(
      <Select options={mockOptions} placeholder='Select an option' />
    )

    mockOptions.forEach(option => {
      expect(getByText(option.label)).toBeInTheDocument()
    })

    const select = getByRole('combobox')
    expect(select).toHaveClass('select')
  })

  it('should render with a label when provided', () => {
    const label = 'Choose an option'

    const { getByText } = render(
      <Select options={mockOptions} placeholder='Select an option' label={label} />
    )

    expect(getByText(label)).toBeInTheDocument()
  })

  it('should render placeholder option when provided', () => {
    const placeholder = 'Select an option'

    const { getByText } = render(<Select options={mockOptions} placeholder={placeholder} />)

    expect(getByText(placeholder)).toBeInTheDocument()
  })

  it('should display error message when error prop is provided', () => {
    const error = 'This field is required'

    const { getByText } = render(
      <Select options={mockOptions} placeholder='Select an option' error={error} />
    )

    expect(getByText(error)).toBeInTheDocument()
  })

  it('should link error message via aria-describedby', () => {
    const error = 'This field is required'

    const { getByRole, getByText } = render(
      <Select options={mockOptions} placeholder='Select an option' error={error} />
    )

    const select = getByRole('combobox')
    const errorMessage = getByText(error)

    expect(select).toHaveAttribute('aria-describedby', errorMessage.id)
  })

  it('should set aria-invalid when error is present', () => {
    const error = 'This field is required'

    const { getByRole } = render(
      <Select options={mockOptions} placeholder='Select an option' error={error} />
    )

    const select = getByRole('combobox')

    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveClass('select-error')
  })

  it('should not set aria-invalid when no error is present', () => {
    const { getByRole } = render(<Select options={mockOptions} placeholder='Select an option' />)

    const select = getByRole('combobox')

    expect(select).not.toHaveAttribute('aria-invalid')
  })

  it('should call onChange when selection changes', () => {
    const handleChange = mock(() => {})

    const { getByRole } = render(
      <Select options={mockOptions} placeholder='Select an option' onChange={handleChange} />
    )

    const select = getByRole('combobox')
    fireEvent.change(select, { target: { value: mockOptions[1].value } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should apply w-full by default', () => {
    const { getByRole } = render(<Select options={mockOptions} placeholder='Select an option' />)

    const select = getByRole('combobox')

    expect(select).toHaveClass('w-full')
  })

  it('should not apply w-full when fullWidth is false', () => {
    const { getByRole } = render(
      <Select options={mockOptions} placeholder='Select an option' fullWidth={false} />
    )

    const select = getByRole('combobox')

    expect(select).not.toHaveClass('w-full')
  })

  it('should forward ref to select element', () => {
    const ref = { current: null }

    const { getByRole } = render(
      <Select options={mockOptions} placeholder='Select an option' ref={ref} />
    )

    const select = getByRole('combobox')

    expect(ref.current === select).toBe(true)
  })
})

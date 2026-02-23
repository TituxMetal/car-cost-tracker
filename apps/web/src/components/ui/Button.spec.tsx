import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render } from '~/test-utils'

import { Button } from './Button'

describe('Button', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a button element with children', () => {
    const { getByRole } = render(<Button>Click Me</Button>)

    const button = getByRole('button', { name: 'Click Me' })

    expect(button).toBeInTheDocument()
  })

  it('should use default variant styling', () => {
    const { getByRole } = render(<Button>Default</Button>)

    const button = getByRole('button', { name: 'Default' })

    expect(button).toHaveClass('bg-sky-400')
  })

  it('should apply outline variant styling', () => {
    const { getByRole } = render(<Button variant='outline'>Outline</Button>)

    const button = getByRole('button', { name: 'Outline' })

    expect(button).toHaveClass('border-zinc-700')
  })

  it('should apply ghost variant styling', () => {
    const { getByRole } = render(<Button variant='ghost'>Ghost</Button>)

    const button = getByRole('button', { name: 'Ghost' })

    expect(button).toHaveClass('hover:bg-zinc-800')
  })

  it('should apply destructive variant styling', () => {
    const { getByRole } = render(<Button variant='destructive'>Destructive</Button>)

    const button = getByRole('button', { name: 'Destructive' })

    expect(button).toHaveClass('bg-red-900')
  })

  it('should be disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>)

    const button = getByRole('button', { name: 'Disabled' })

    expect(button).toBeDisabled()
  })

  it('should call onClick when clicked', () => {
    const handleClick = mock(() => {})
    const { getByRole } = render(<Button onClick={handleClick}>Click Me</Button>)

    const button = getByRole('button', { name: 'Click Me' })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', () => {
    const handleClick = mock(() => {})
    const { getByRole } = render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    )

    const button = getByRole('button', { name: 'Click Me' })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render as anchor element when as="a" is provided', () => {
    const { getByRole } = render(
      <Button as='a' href='https://example.com'>
        Link
      </Button>
    )
    const link = getByRole('link', { name: 'Link' })

    expect(link.tagName).toBe('A')
  })

  it('should forward ref to button element', () => {
    const ref = { current: null }
    const { getByRole } = render(<Button ref={ref}>Click Me</Button>)

    const button = getByRole('button', { name: 'Click Me' })

    expect(ref.current === button).toBe(true)
  })

  it('should append custom className', () => {
    const { getByRole } = render(<Button className='custom-class'>Click Me</Button>)

    const button = getByRole('button', { name: 'Click Me' })

    expect(button).toHaveClass('custom-class')
  })
})

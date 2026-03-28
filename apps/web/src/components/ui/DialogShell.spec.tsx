import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { DialogShell } from './DialogShell'

describe('DialogShell', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the title', () => {
    render(
      <DialogShell title='Test Title' onClose={() => {}}>
        <p>Content</p>
      </DialogShell>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should render children', () => {
    render(
      <DialogShell title='Test' onClose={() => {}}>
        <p>Child content</p>
      </DialogShell>
    )

    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(
      <DialogShell title='Test' onClose={() => {}} description='A description'>
        <p>Content</p>
      </DialogShell>
    )

    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    render(
      <DialogShell title='Test' onClose={() => {}}>
        <p>Content</p>
      </DialogShell>
    )

    expect(screen.queryByText('A description')).toBeNull()
  })

  it('should call onClose when backdrop is clicked', () => {
    const onClose = mock(() => {})

    render(
      <DialogShell title='Test' onClose={onClose}>
        <p>Content</p>
      </DialogShell>
    )

    const overlay = document.querySelector('.fixed.inset-0')
    fireEvent.click(overlay!)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    const onClose = mock(() => {})

    render(
      <DialogShell title='Test' onClose={onClose}>
        <p>Content</p>
      </DialogShell>
    )

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should use DaisyUI modal classes', () => {
    render(
      <DialogShell title='Test' onClose={() => {}}>
        <p>Content</p>
      </DialogShell>
    )

    const dialog = screen.getByRole('dialog')

    expect(dialog).toHaveClass('modal')
    expect(dialog).toHaveClass('modal-open')
    expect(dialog.querySelector('.modal-box')).toBeInTheDocument()
  })
})

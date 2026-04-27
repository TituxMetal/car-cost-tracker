import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { CheckStatusBadge } from './CheckStatusBadge'

describe('CheckStatusBadge', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render "À jour" with badge-success for on-time status', () => {
    render(<CheckStatusBadge status='on-time' />)

    const badge = screen.getByText('À jour')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('badge-success')
  })

  it('should render "Bientôt" with badge-warning for due-soon status', () => {
    render(<CheckStatusBadge status='due-soon' />)

    const badge = screen.getByText('Bientôt')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('badge-warning')
  })

  it('should render "En retard" with badge-error for overdue status', () => {
    render(<CheckStatusBadge status='overdue' />)

    const badge = screen.getByText('En retard')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('badge-error')
  })

  it('should render "Jamais" with badge-info for never status', () => {
    render(<CheckStatusBadge status='never' />)

    const badge = screen.getByText('Jamais')

    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('badge-info')
  })

  it('should prefix the label with an aria-hidden telltale dot', () => {
    const { container } = render(<CheckStatusBadge status='on-time' />)

    const telltale = container.querySelector('[aria-hidden="true"]')

    expect(telltale).not.toBeNull()
    expect(telltale).toHaveClass('rounded-full')
    expect(telltale).toHaveClass('bg-current')
  })
})

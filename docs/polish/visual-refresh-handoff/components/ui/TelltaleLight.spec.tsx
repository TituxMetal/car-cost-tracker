import { render, screen } from '@testing-library/react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { describe, expect, it } from 'bun:test'

import { TelltaleLight } from './TelltaleLight'

describe('TelltaleLight', () => {
  it('uses role="status" for non-critical statuses', () => {
    render(<TelltaleLight icon={CheckCircle} status='ok' label='À jour' />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses role="alert" + assertive live region for critical status', () => {
    render(<TelltaleLight icon={AlertTriangle} status='critical' label='Contrôle expiré' />)
    const el = screen.getByRole('alert')
    expect(el).toHaveAttribute('aria-live', 'assertive')
  })

  it('combines label and description for screen readers', () => {
    render(
      <TelltaleLight
        icon={AlertTriangle}
        status='critical'
        label='Contrôle technique'
        description='en retard de 32 jours'
      />
    )
    expect(screen.getByText('Contrôle technique, en retard de 32 jours')).toBeInTheDocument()
  })

  it('marks the icon aria-hidden so color is never sole carrier', () => {
    const { container } = render(
      <TelltaleLight icon={CheckCircle} status='ok' label='OK' />
    )
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})

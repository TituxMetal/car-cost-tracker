import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { HealthSummary } from './HealthSummary'

const counts = { onTime: 4, dueSoon: 2, overdue: 1, never: 1 }

describe('HealthSummary', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the section landmark with the cluster kicker', () => {
    render(<HealthSummary score={72} counts={counts} />)

    expect(screen.getByRole('region', { name: /santé globale/i })).toBeInTheDocument()
  })

  it('renders the score in font-mono followed by the /100 suffix', () => {
    render(<HealthSummary score={72} counts={counts} />)

    const scoreCell = screen.getByText('72')
    expect(scoreCell).toHaveClass('font-mono')
    expect(scoreCell).toHaveClass('text-warning')
    expect(screen.getByText('/100')).toBeInTheDocument()
  })

  it('renders the four status cells with the right values and colour classes', () => {
    render(<HealthSummary score={72} counts={counts} />)

    expect(screen.getByText('EN RETARD').nextElementSibling).toHaveTextContent('1')
    expect(screen.getByText('EN RETARD').nextElementSibling).toHaveClass('text-error')
    expect(screen.getByText('BIENTÔT').nextElementSibling).toHaveTextContent('2')
    expect(screen.getByText('BIENTÔT').nextElementSibling).toHaveClass('text-warning')
    expect(screen.getByText('À JOUR').nextElementSibling).toHaveTextContent('4')
    expect(screen.getByText('À JOUR').nextElementSibling).toHaveClass('text-success')
    expect(screen.getByText('JAMAIS').nextElementSibling).toHaveTextContent('1')
    expect(screen.getByText('JAMAIS').nextElementSibling).toHaveClass('text-info')
  })

  it('renders 40 segment cells in the health bar', () => {
    render(<HealthSummary score={72} counts={counts} />)

    const bar = screen.getByTestId('health-bar')
    expect(bar.children.length).toBe(40)
  })

  it('includes a screen-reader narration with the score and four counts', () => {
    render(<HealthSummary score={42} counts={counts} />)

    expect(
      screen.getByText(
        /Score de santé : 42 sur 100\. 1 contrôle\(s\) en retard, 2 bientôt dus, 4 à jour, 1 jamais effectués\./
      )
    ).toBeInTheDocument()
  })
})

import { useId } from 'react'
import type { LabelHTMLAttributes } from 'react'

import { Label } from './Label'

export interface GaugeSpecs {
  value: number
  max: number
  label: string
}

/* Existing components from your kit — not included here. This file is the
 * new version of the tests/spec for Gauge. */
/* KNOWN ISSUES (to address at integration time, not here):
 *   - lines 1-10 above are orphan imports that leaked from another file and
 *     should be removed
 *   - Gauge.tsx has inline style={{…}} which violates HANDOFF.md rule #4;
 *     migrate to CSS vars or @apply utilities before copying into apps/web/
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { Gauge } from './Gauge'

describe('Gauge', () => {
  it('exposes role="meter" with correct ARIA values', () => {
    render(<Gauge value={85} max={100} label='HUILE MOTEUR' status='due-soon' />)
    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '85')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
  })

  it('uses description as aria-label when provided', () => {
    render(
      <Gauge
        value={10}
        max={100}
        label='BATTERIE'
        description='Batterie à 10%, critique'
        status='overdue'
      />
    )
    expect(screen.getByRole('meter')).toHaveAttribute('aria-label', 'Batterie à 10%, critique')
  })

  it('falls back to synthesised label without description', () => {
    render(<Gauge value={50} max={200} label='FREINS' />)
    expect(screen.getByRole('meter')).toHaveAttribute('aria-label', 'FREINS, 50 sur 200')
  })

  it('clamps out-of-range values', () => {
    render(<Gauge value={150} max={100} label='TEST' />)
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders the label text visible for sighted users', () => {
    render(<Gauge value={0} max={100} label='CONTRÔLE TECHNIQUE' />)
    expect(screen.getByText('CONTRÔLE TECHNIQUE')).toBeInTheDocument()
  })

  it('hides SVG from screen readers', () => {
    const { container } = render(<Gauge value={0} max={100} label='X' />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})

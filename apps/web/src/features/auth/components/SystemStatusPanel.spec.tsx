import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { SystemStatusPanel } from './SystemStatusPanel'

describe('SystemStatusPanel', () => {
  beforeEach(() => {
    cleanup()
  })

  afterEach(() => {
    cleanup()
  })

  it('should expose the panel as a status landmark with an accessible name', () => {
    render(<SystemStatusPanel />)

    const panel = screen.getByRole('status', { name: /état système/i })
    expect(panel).toBeInTheDocument()
  })

  it('should render the cluster heading', () => {
    render(<SystemStatusPanel />)

    expect(screen.getByText(/état système/i)).toBeInTheDocument()
  })

  it('should display the API status with the current date computed at render time', () => {
    render(<SystemStatusPanel />)

    const today = new Date()
      .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .replace(/\//g, '.')

    expect(screen.getByText(new RegExp(`api en ligne · ${today}`, 'i'))).toBeInTheDocument()
  })

  it('should list Better Auth as OK without lying about a hardcoded version', () => {
    render(<SystemStatusPanel />)

    expect(screen.getByText(/better auth · ok/i)).toBeInTheDocument()
  })

  it('should list Prisma as OK without lying about a hardcoded version', () => {
    render(<SystemStatusPanel />)

    expect(screen.getByText(/prisma · ok/i)).toBeInTheDocument()
  })
})

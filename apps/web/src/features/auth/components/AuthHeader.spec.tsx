import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { AuthHeader } from './AuthHeader'

describe('AuthHeader', () => {
  beforeEach(() => {
    cleanup()
  })

  it('should render the kicker', () => {
    render(<AuthHeader kicker='// ACCÈS PILOTE' heading='Connexion' headingId='auth-heading' />)

    expect(screen.getByText('// ACCÈS PILOTE')).toBeInTheDocument()
  })

  it('should render the heading as h1 with the provided id', () => {
    render(<AuthHeader kicker='// ACCÈS PILOTE' heading='Connexion' headingId='auth-heading' />)

    const heading = screen.getByRole('heading', { level: 1, name: /connexion/i })
    expect(heading).toHaveAttribute('id', 'auth-heading')
  })

  it('should render the cluster typography on the heading', () => {
    render(<AuthHeader kicker='// ACCÈS PILOTE' heading='Connexion' headingId='auth-heading' />)

    const heading = screen.getByRole('heading', { level: 1, name: /connexion/i })
    expect(heading).toHaveClass('font-display')
    expect(heading).toHaveClass('font-semibold')
  })
})

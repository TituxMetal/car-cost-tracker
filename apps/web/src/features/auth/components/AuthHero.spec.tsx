import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { AuthHero } from './AuthHero'

describe('AuthHero', () => {
  beforeEach(() => {
    cleanup()
  })

  it('should render the COST.LOG brand link to the home page', () => {
    render(<AuthHero />)

    const brandLink = screen.getByRole('link')
    expect(brandLink).toHaveAttribute('href', '/')
    expect(brandLink).toHaveTextContent(/cost\.log/i)
  })

  it('should render the editorial kicker and headline', () => {
    render(<AuthHero />)

    expect(screen.getByText(/\/\/ ignition/i)).toBeInTheDocument()
    expect(screen.getByText(/démarrer votre/i)).toBeInTheDocument()
    expect(screen.getByText(/tableau de bord\./i)).toBeInTheDocument()
  })

  it('should render the editorial tagline', () => {
    render(<AuthHero />)

    expect(
      screen.getByText(/chaque contrôle, chaque kilomètre, chaque vidange/i)
    ).toBeInTheDocument()
  })

  it('should render the version footer with the current year', () => {
    render(<AuthHero />)

    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(`COST\\.LOG · ${currentYear}`))).toBeInTheDocument()
  })

  it('should expose the aside as a complementary landmark', () => {
    render(<AuthHero />)

    expect(
      screen.getByRole('complementary', { name: /présentation cost\.log/i })
    ).toBeInTheDocument()
  })
})

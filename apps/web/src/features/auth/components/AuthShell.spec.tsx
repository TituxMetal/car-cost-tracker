import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { AuthShell } from './AuthShell'

describe('AuthShell', () => {
  beforeEach(() => {
    cleanup()
  })

  it('should render the main landmark and embed the hero', () => {
    render(
      <AuthShell headingId='test-heading'>
        <h1 id='test-heading'>Connexion</h1>
      </AuthShell>
    )

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(
      screen.getByRole('complementary', { name: /présentation cost\.log/i })
    ).toBeInTheDocument()
  })

  it('should expose the form column as a region labelled by the provided heading id', () => {
    render(
      <AuthShell headingId='custom-heading'>
        <h1 id='custom-heading'>Connexion</h1>
      </AuthShell>
    )

    const region = screen.getByRole('region', { name: /connexion/i })
    expect(region).toBeInTheDocument()
  })

  it('should render the children inside the form column', () => {
    render(
      <AuthShell headingId='test-heading'>
        <h1 id='test-heading'>Connexion</h1>
        <p>Form contents</p>
      </AuthShell>
    )

    expect(screen.getByText('Form contents')).toBeInTheDocument()
  })
})

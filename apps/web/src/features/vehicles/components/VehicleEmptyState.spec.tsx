import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { VehicleEmptyState } from './VehicleEmptyState'

describe('VehicleEmptyState', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a heading message', () => {
    const action = mock(() => {})
    render(<VehicleEmptyState onCreateClick={action} />)

    expect(screen.getByText('Aucun véhicule enregistré')).toBeInTheDocument()
  })

  it('should render a descriptive text', () => {
    const action = mock(() => {})
    render(<VehicleEmptyState onCreateClick={action} />)

    expect(screen.getByText('Ajoutez votre premier véhicule pour commencer.')).toBeInTheDocument()
  })

  it('should render a create button', () => {
    const action = mock(() => {})
    render(<VehicleEmptyState onCreateClick={action} />)

    expect(screen.getByRole('button', { name: /Ajouter mon véhicule/i })).toBeInTheDocument()
  })

  it('should call onCreateClick when button is clicked', () => {
    const action = mock(() => {})
    render(<VehicleEmptyState onCreateClick={action} />)

    const button = screen.getByRole('button', { name: /Ajouter mon véhicule/i })
    button.click()

    expect(action).toHaveBeenCalledTimes(1)
  })
})

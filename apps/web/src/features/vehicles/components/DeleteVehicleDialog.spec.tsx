import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { DeleteVehicleDialog } from './DeleteVehicleDialog'

describe('DeleteVehicleDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the delete title', () => {
    render(<DeleteVehicleDialog vehicleName='206 CC' onConfirm={() => {}} onCancel={() => {}} />)

    expect(screen.getByText('Supprimer le véhicule')).toBeInTheDocument()
  })

  it('should include the vehicle name in the warning message', () => {
    render(<DeleteVehicleDialog vehicleName='206 CC' onConfirm={() => {}} onCancel={() => {}} />)

    expect(
      screen.getByText(
        'Êtes-vous sûr de vouloir supprimer le véhicule "206 CC" ? Cette action est irréversible.'
      )
    ).toBeInTheDocument()
  })

  it('should render Supprimer and Annuler buttons', () => {
    render(<DeleteVehicleDialog vehicleName='206 CC' onConfirm={() => {}} onCancel={() => {}} />)

    expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument()
  })

  it('should call onConfirm when Supprimer is clicked', () => {
    const onConfirm = mock(() => {})
    render(<DeleteVehicleDialog vehicleName='206 CC' onConfirm={onConfirm} onCancel={() => {}} />)

    const deleteButton = screen.getByRole('button', { name: /Supprimer/i })
    deleteButton.click()

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when Annuler is clicked', () => {
    const onCancel = mock(() => {})
    render(<DeleteVehicleDialog vehicleName='206 CC' onConfirm={() => {}} onCancel={onCancel} />)

    const cancelButton = screen.getByRole('button', { name: /Annuler/i })
    cancelButton.click()

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})

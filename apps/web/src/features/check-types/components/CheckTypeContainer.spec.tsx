import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

// Direct store imports: bun:test mock.module leaks globally across files,
// so mocking ~/features/vehicles breaks the vehicles feature's own tests.
// Using internal paths for test state setup is the pragmatic workaround.
import type { Vehicle } from '~/features/vehicles'
import {
  $isLoading as $isVehicleLoading,
  $vehicle,
  vehicleActions
} from '~/features/vehicles/store'
import { cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { $checkTypes, $error, $isLoading, checkTypeActions } from '../store'
import type { CheckType } from '../types'

import { CheckTypeContainer } from './CheckTypeContainer'

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

const mockVehicle: Vehicle = {
  id: 'v-1',
  userId: 'u-1',
  make: 'Mini',
  model: 'Cooper',
  year: 2020,
  engineType: '1.5L Turbo',
  fuelType: 'GASOLINE',
  vin: null,
  licensePlate: 'AB-123-CD',
  purchaseDate: null,
  mileage: 45000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

const mockCheckTypes: CheckType[] = [
  {
    id: 'ct-1',
    vehicleId: 'v-1',
    name: `Niveau d'huile`,
    description: `Vérifier le niveau d'huile moteur`,
    intervalDays: 7,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ct-2',
    vehicleId: 'v-1',
    name: 'Pression des pneus',
    description: null,
    intervalDays: 14,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z'
  }
]

describe('CheckTypeContainer', () => {
  let fetchCheckTypesSpy: ReturnType<typeof spyOn>
  let fetchVehicleSpy: ReturnType<typeof spyOn>
  let createSpy: ReturnType<typeof spyOn>
  let updateSpy: ReturnType<typeof spyOn>
  let removeSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $vehicle.set(null)
    $isVehicleLoading.set(false)
    $checkTypes.set([])
    $isLoading.set(false)
    $error.set(null)

    fetchCheckTypesSpy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(undefined)
    fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    createSpy = spyOn(checkTypeActions, 'create').mockResolvedValue(mockCheckTypes[0])
    updateSpy = spyOn(checkTypeActions, 'update').mockResolvedValue(mockCheckTypes[0])
    removeSpy = spyOn(checkTypeActions, 'remove').mockResolvedValue(undefined)
  })

  afterEach(() => {
    fetchCheckTypesSpy.mockRestore()
    fetchVehicleSpy.mockRestore()
    createSpy.mockRestore()
    updateSpy.mockRestore()
    removeSpy.mockRestore()
  })

  describe('loading + initial fetch', () => {
    it('should show loading state', async () => {
      $isVehicleLoading.set(true)
      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(screen.getByText('Chargement...')).toBeVisible()
    })

    it('should redirect when no vehicle exists', async () => {
      $vehicle.set(null)
      $isVehicleLoading.set(false)

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      await waitFor(() => expect(navigationUtils.redirect).toHaveBeenCalledWith('/vehicle'))
    })

    it('should fetch check types when vehicle is available', async () => {
      $vehicle.set(mockVehicle)

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(fetchCheckTypesSpy).toHaveBeenCalledWith(mockVehicle.id)
    })

    it('should render check type list when data is loaded', async () => {
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
      expect(screen.getByText('Pression des pneus')).toBeVisible()
    })

    it('should show add button when no check types exist', async () => {
      $vehicle.set(mockVehicle)
      $checkTypes.set([])

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(screen.getByRole('button', { name: 'Ajouter un contrôle' })).toBeVisible()
    })
  })

  describe('create mode', () => {
    it('should show create form when clicking "Ajouter un contrôle"', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Ajouter un contrôle' }))

      expect(screen.getByLabelText('Nom')).toBeVisible()
      expect(screen.getByLabelText('Intervalle (jours)')).toBeVisible()
      expect(screen.getByLabelText('Description')).toBeVisible()
    })

    it('should call create and return to list on form submit', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Ajouter un contrôle' }))

      await user.type(screen.getByLabelText('Nom'), 'Test Check Type')
      await user.type(screen.getByLabelText('Intervalle (jours)'), '30')
      await user.type(screen.getByLabelText('Description'), 'This is a test check type.')

      fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

      await waitFor(() => {
        expect(createSpy).toHaveBeenCalledWith(mockVehicle.id, {
          name: 'Test Check Type',
          intervalDays: 30,
          description: 'This is a test check type.'
        })
      })
      expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
      expect(screen.getByText('Pression des pneus')).toBeVisible()
    })

    it('should return to list when clicking "Annuler"', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Ajouter un contrôle' }))
      fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

      expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
      expect(screen.getByText('Pression des pneus')).toBeVisible()
    })

    it('should display server error when create fails', async () => {
      const errorMessage = 'Failed to create check type'
      createSpy.mockRejectedValueOnce(new Error(errorMessage))

      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Ajouter un contrôle' }))

      await user.type(screen.getByLabelText('Nom'), 'Test Check Type')
      await user.type(screen.getByLabelText('Intervalle (jours)'), '30')
      await user.type(screen.getByLabelText('Description'), 'This is a test check type.')

      fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

      await waitFor(() => expect(screen.getByText(errorMessage)).toBeVisible())
    })
  })

  describe('edit mode', () => {
    it('should show edit form pre-populated when clicking "Modifier"', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Modifier' })[0])

      expect(screen.getByLabelText('Nom')).toHaveValue(`Niveau d'huile`)
      expect(screen.getByLabelText('Intervalle (jours)')).toHaveValue(7)
      expect(screen.getByLabelText('Description')).toHaveValue(`Vérifier le niveau d'huile moteur`)
    })

    it('should call update on form submit', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Modifier' })[0])
      await user.clear(screen.getByLabelText('Nom'))
      await user.type(screen.getByLabelText('Nom'), 'Updated Check Type')
      fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith(mockVehicle.id, mockCheckTypes[0].id, {
          name: 'Updated Check Type',
          intervalDays: 7,
          description: `Vérifier le niveau d'huile moteur`
        })
      })
    })

    it('should return to list when clicking "Annuler" in edit mode', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Modifier' })[0])
      fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

      expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
      expect(screen.getByText('Pression des pneus')).toBeVisible()
    })

    it('should display server error when update fails', async () => {
      const errorMessage = 'Failed to update check type'
      updateSpy.mockRejectedValueOnce(new Error(errorMessage))

      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Modifier' })[0])
      await user.clear(screen.getByLabelText('Nom'))
      await user.type(screen.getByLabelText('Nom'), 'Updated Check Type')
      fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

      await waitFor(() => expect(screen.getByText(errorMessage)).toBeVisible())
    })
  })

  describe('delete flow', () => {
    it('should not show DeleteCheckTypeDialog by default', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(screen.queryByText('Supprimer le type de contrôle')).not.toBeInTheDocument()
    })

    it('should show confirmation dialog when clicking "Supprimer"', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])

      expect(screen.getByText('Supprimer le type de contrôle')).toBeVisible()
      expect(
        screen.getByText(
          `Êtes-vous sûr de vouloir supprimer le type de contrôle "${mockCheckTypes[0].name}" ? Cette action est irréversible.`
        )
      ).toBeVisible()
    })

    it('should call remove and close dialog on confirm', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])
      const deleteButtons = screen.getAllByRole('button', { name: 'Supprimer' })
      await user.click(deleteButtons[deleteButtons.length - 1]) // Click the confirm button in the dialog

      await waitFor(() => {
        expect(removeSpy).toHaveBeenCalledWith(mockVehicle.id, mockCheckTypes[0].id)
        expect(screen.queryByText('Supprimer le type de contrôle')).not.toBeInTheDocument()
      })
    })

    it('should close dialog without removing on cancel', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])
      await user.click(screen.getByRole('button', { name: 'Annuler' }))

      await waitFor(() => {
        expect(removeSpy).not.toHaveBeenCalled()
        expect(screen.queryByText('Supprimer le type de contrôle')).not.toBeInTheDocument()
        expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
        expect(screen.getByText('Pression des pneus')).toBeVisible()
      })
    })
  })

  describe('suggested check types', () => {
    it('should show all suggestions when no check types exist', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set([])

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
      expect(screen.getByText('Pression des pneus')).toBeVisible()
      expect(screen.getByText('Niveau de liquide de refroidissement')).toBeVisible()
    })

    it('should filter out suggestions that match existing check type names', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      const addButtons = screen.getAllByRole('button', { name: /^\+/ })
      expect(addButtons).toHaveLength(1)
    })

    it('should not show suggestions when all have been added', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set([
        ...mockCheckTypes,
        {
          ...mockCheckTypes[0],
          id: 'ct-3',
          name: 'Niveau de liquide de refroidissement',
          intervalDays: 30
        }
      ])

      await act(async () => {
        render(<CheckTypeContainer />)
      })

      expect(screen.queryByRole('button', { name: /^\+/ })).not.toBeInTheDocument()
    })

    it('should call create with suggestion data when clicking add button', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)

      const user = userEvent.setup()
      await act(async () => {
        render(<CheckTypeContainer />)
      })
      const addButtons = screen.getAllByRole('button', { name: /^\+/ })
      await user.click(addButtons[0])

      await waitFor(() => {
        expect(createSpy).toHaveBeenCalledWith(mockVehicle.id, {
          name: `Niveau de liquide de refroidissement`,
          description: 'Vérifier le niveau entre les repères min et max, moteur froid',
          intervalDays: 30
        })
      })
    })
  })

  describe('error handling', () => {
    it('should display server error when an action fails', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      $checkTypes.set(mockCheckTypes)
      const errorMessage = 'Server error'
      updateSpy.mockRejectedValueOnce(new Error(errorMessage))

      render(<CheckTypeContainer />)
      fireEvent.click(screen.getAllByRole('button', { name: 'Modifier' })[0])
      fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

      await waitFor(() => expect(screen.getByText(errorMessage)).toBeVisible())
    })
  })
})

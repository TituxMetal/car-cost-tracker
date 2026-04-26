import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { act, cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'

import { $error, $isLoading, $mileageHistoryTick, $vehicle, vehicleActions } from '../store'
import type { Vehicle } from '../types'

import { VehicleContainer } from './VehicleContainer'

const mockVehicle: Vehicle = {
  id: 'v1',
  userId: 'u1',
  make: 'Mini',
  model: 'Cooper S Coupé',
  year: 2012,
  engineType: '1.6l Turbo',
  fuelType: 'GASOLINE',
  vin: 'WMWZC3C5XCTU12345',
  licensePlate: 'AB-123-CD',
  purchaseDate: '2025-07-08',
  mileage: 92300,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('VehicleContainer', () => {
  let fetchSpy: ReturnType<typeof spyOn>
  let createSpy: ReturnType<typeof spyOn>
  let updateSpy: ReturnType<typeof spyOn>
  let updateMileageSpy: ReturnType<typeof spyOn>
  let removeSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    window.localStorage.clear()

    $vehicle.set(null)
    $isLoading.set(true)
    $error.set(null)
    act(() => {
      $mileageHistoryTick.set(0)
    })

    fetchSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    createSpy = spyOn(vehicleActions, 'create').mockResolvedValue(mockVehicle)
    updateSpy = spyOn(vehicleActions, 'update').mockResolvedValue(mockVehicle)
    updateMileageSpy = spyOn(vehicleActions, 'updateMileage').mockResolvedValue({
      ...mockVehicle,
      mileage: 92500
    })
    removeSpy = spyOn(vehicleActions, 'remove').mockResolvedValue(undefined)
  })

  afterEach(() => {
    fetchSpy.mockRestore()
    createSpy.mockRestore()
    updateSpy.mockRestore()
    updateMileageSpy.mockRestore()
    removeSpy.mockRestore()
    window.localStorage.clear()
  })

  describe('loading + empty mode', () => {
    it('should call fetchVehicle on mount', () => {
      render(<VehicleContainer />)

      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })

    it('should show loading state when isLoading is true', () => {
      render(<VehicleContainer />)

      expect(screen.getByText('Chargement...')).toBeInTheDocument()
    })

    it('should show VehicleEmptyState when no vehicle exists', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)

      expect(screen.getByText('Aucun véhicule enregistré')).toBeInTheDocument()
    })
  })

  describe('create mode', () => {
    it('should display the create-mode kicker and heading', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter mon véhicule/i }))

      expect(screen.getByText(/créer votre fiche/i)).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ajouter mon véhicule/i)
    })

    it('should switch to create form when "Ajouter" is clicked', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter mon véhicule/i }))

      expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument()
    })

    it('should render all form fields in create mode', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter mon véhicule/i }))

      expect(screen.getByLabelText('Marque', { exact: false })).toBeInTheDocument()
      expect(screen.getByLabelText('Modèle', { exact: false })).toBeInTheDocument()
      expect(screen.getByLabelText('Année', { exact: false })).toBeInTheDocument()
      expect(screen.getByLabelText('Type de moteur')).toBeInTheDocument()
      expect(screen.getByLabelText('Carburant')).toBeInTheDocument()
      expect(screen.getByLabelText('VIN')).toBeInTheDocument()
      expect(screen.getByLabelText("Plaque d'immatriculation")).toBeInTheDocument()
      expect(screen.getByLabelText("Date d'achat")).toBeInTheDocument()
      expect(screen.getByLabelText('Kilométrage')).toBeInTheDocument()
    })

    it('should return to empty state when cancel is clicked', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter mon véhicule/i }))
      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

      expect(screen.getByText('Aucun véhicule enregistré')).toBeInTheDocument()
    })

    it('should call createVehicle on form submit', async () => {
      $isLoading.set(false)

      const user = userEvent.setup()
      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /ajouter mon véhicule/i }))

      await user.type(screen.getByLabelText('Marque', { exact: false }), 'Mini')
      await user.type(screen.getByLabelText('Modèle', { exact: false }), 'Cooper S Coupé')
      await user.type(screen.getByLabelText('Année', { exact: false }), '2012')
      await user.type(screen.getByLabelText('Type de moteur'), '1.6l Turbo')
      fireEvent.change(screen.getByLabelText('Carburant'), { target: { value: 'GASOLINE' } })
      await user.type(screen.getByLabelText('VIN'), 'WMWZC3C5XCTU12345')
      await user.type(screen.getByLabelText("Plaque d'immatriculation"), 'AB-123-CD')
      await user.type(screen.getByLabelText("Date d'achat"), '2025-07-08')
      await user.type(screen.getByLabelText('Kilométrage'), '92300')

      fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

      await waitFor(() => expect(createSpy).toHaveBeenCalled())
    })
  })

  describe('view mode', () => {
    it('should render the view-mode heading inside the profile (no year suffix)', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent(/mini cooper s coupé/i)
      expect(heading).not.toHaveTextContent(/\(2012\)/)
    })

    it('should show VehicleProfile when vehicle exists', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.getByText('Marque')).toBeInTheDocument()
      expect(screen.getByText('Modèle')).toBeInTheDocument()
      expect(screen.getByText('Année')).toBeInTheDocument()
    })

    it('should show QuickMileageUpdate alongside the profile', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.getByLabelText('Nouvelle valeur')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /valider/i })).toBeInTheDocument()
    })

    it('should render MileageHistoryCard with its empty state on first visit', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.getByText(/historique compteur/i)).toBeInTheDocument()
      expect(screen.getByText(/aucune mise à jour/i)).toBeInTheDocument()
    })

    it('should call updateMileage and append a history entry when a higher value is submitted', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      const user = userEvent.setup()
      render(<VehicleContainer />)

      const input = screen.getByLabelText('Nouvelle valeur')
      await user.clear(input)
      await user.type(input, '92500')
      fireEvent.click(screen.getByRole('button', { name: /valider/i }))

      await waitFor(() => expect(updateMileageSpy).toHaveBeenCalled())
      await waitFor(() => {
        expect(screen.queryByText(/aucune mise à jour/i)).not.toBeInTheDocument()
      })
      expect(screen.getByText('92500 km')).toBeInTheDocument()
      expect(screen.getByText('+ 200')).toBeInTheDocument()
    })
  })

  describe('edit mode', () => {
    it('should display vehicle name as title in edit mode', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /modifier mini cooper s coupé \(2012\)/i
      )
    })

    it('should switch to edit form when "Modifier fiche" is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))

      expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument()
    })

    it('should pre-fill form with vehicle data', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))

      expect(screen.getByDisplayValue('Mini')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Cooper S Coupé')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2012')).toBeInTheDocument()
    })

    it('should hide mileage field in edit mode', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))

      expect(screen.queryByLabelText('Kilométrage')).not.toBeInTheDocument()
    })

    it('should return to view when cancel is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))
      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

      expect(screen.getByText('Marque')).toBeInTheDocument()
      expect(screen.getByText('Modèle')).toBeInTheDocument()
      expect(screen.getByText('Année')).toBeInTheDocument()
    })

    it('should call updateVehicle on form submit', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      const user = userEvent.setup()
      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))

      await user.type(screen.getByLabelText('Type de moteur'), '1.6l Turbo')
      fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

      await waitFor(() => expect(updateSpy).toHaveBeenCalled())
    })
  })

  describe('delete flow', () => {
    it('should not show DeleteVehicleDialog initially', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.queryByText('Supprimer le véhicule')).not.toBeInTheDocument()
    })

    it('should show DeleteVehicleDialog when "Supprimer" is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /^supprimer$/i }))

      expect(screen.getByText('Supprimer le véhicule')).toBeInTheDocument()
    })

    it('should hide dialog when cancel is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /^supprimer$/i }))
      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

      expect(screen.queryByText('Supprimer le véhicule')).not.toBeInTheDocument()
    })

    it('should call deleteVehicle and return to empty on confirm', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /^supprimer$/i }))
      const confirmButtons = screen.getAllByRole('button', { name: /^supprimer$/i })
      fireEvent.click(confirmButtons[confirmButtons.length - 1] as HTMLElement)

      await waitFor(() => expect(removeSpy).toHaveBeenCalled())
    })
  })

  describe('error handling', () => {
    it('should display server error when an action fails', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      updateSpy.mockRejectedValueOnce(new Error('Update failed'))

      render(<VehicleContainer />)
      fireEvent.click(screen.getByRole('button', { name: /modifier fiche/i }))
      fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

      await waitFor(() => expect(screen.getByText('Update failed')).toBeInTheDocument())
    })

    it('should display server error when updateMileage fails', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      updateMileageSpy.mockRejectedValueOnce(new Error('Mileage update failed'))

      const user = userEvent.setup()
      render(<VehicleContainer />)

      const input = screen.getByLabelText('Nouvelle valeur')
      await user.clear(input)
      await user.type(input, '92500')
      fireEvent.click(screen.getByRole('button', { name: /valider/i }))

      await waitFor(() => expect(screen.getByText('Mileage update failed')).toBeInTheDocument())
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'

import { $error, $isLoading, $vehicle, vehicleActions } from '../store'
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

    // Reset store atoms to default loading state
    $vehicle.set(null)
    $isLoading.set(true)
    $error.set(null)

    // Spy on vehicleActions to prevent real API calls
    fetchSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    createSpy = spyOn(vehicleActions, 'create').mockResolvedValue(mockVehicle)
    updateSpy = spyOn(vehicleActions, 'update').mockResolvedValue(mockVehicle)
    updateMileageSpy = spyOn(vehicleActions, 'updateMileage').mockResolvedValue(mockVehicle)
    removeSpy = spyOn(vehicleActions, 'remove').mockResolvedValue(undefined)
  })

  afterEach(() => {
    fetchSpy.mockRestore()
    createSpy.mockRestore()
    updateSpy.mockRestore()
    updateMileageSpy.mockRestore()
    removeSpy.mockRestore()
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
    it('should display a title in create mode', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Ajouter mon véhicule'))

      expect(screen.getByText('Ajouter mon véhicule')).toBeInTheDocument()
    })

    it('should switch to create form when "Ajouter" is clicked', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Ajouter mon véhicule'))

      expect(screen.getByText('Enregistrer')).toBeInTheDocument()
      expect(screen.getByText('Annuler')).toBeInTheDocument()
    })

    it('should render all form fields in create mode', () => {
      $isLoading.set(false)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Ajouter mon véhicule'))

      expect(screen.getByLabelText('Marque')).toBeInTheDocument()
      expect(screen.getByLabelText('Modèle')).toBeInTheDocument()
      expect(screen.getByLabelText('Année')).toBeInTheDocument()
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
      fireEvent.click(screen.getByText('Ajouter mon véhicule'))
      fireEvent.click(screen.getByText('Annuler'))

      expect(screen.getByText('Aucun véhicule enregistré')).toBeInTheDocument()
    })

    it('should call createVehicle on form submit', async () => {
      $isLoading.set(false)

      const user = userEvent.setup()
      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Ajouter mon véhicule'))

      await user.type(screen.getByLabelText('Marque'), 'Mini')
      await user.type(screen.getByLabelText('Modèle'), 'Cooper S Coupé')
      await user.type(screen.getByLabelText('Année'), '2012')
      await user.type(screen.getByLabelText('Type de moteur'), '1.6l Turbo')
      fireEvent.change(screen.getByLabelText('Carburant'), { target: { value: 'GASOLINE' } })
      await user.type(screen.getByLabelText('VIN'), 'WMWZC3C5XCTU12345')
      await user.type(screen.getByLabelText("Plaque d'immatriculation"), 'AB-123-CD')
      await user.type(screen.getByLabelText("Date d'achat"), '2025-07-08')
      await user.type(screen.getByLabelText('Kilométrage'), '92300')

      fireEvent.click(screen.getByText('Enregistrer'))

      await waitFor(() => expect(createSpy).toHaveBeenCalled())
    })
  })

  describe('view mode', () => {
    it('should display vehicle name as title in view mode', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.getByText('Mini Cooper S Coupé (2012)')).toBeInTheDocument()
    })

    it('should show VehicleProfile when vehicle exists', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.getByText('Marque')).toBeInTheDocument()
      expect(screen.getByText('Modèle')).toBeInTheDocument()
      expect(screen.getByText('Année')).toBeInTheDocument()
    })

    it('should show QuickMileageUpdate below the profile', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)

      expect(screen.getByLabelText('Kilométrage')).toBeInTheDocument()
      expect(screen.getByText('Mettre à jour')).toBeInTheDocument()
    })

    it('should call updateMileage when mileage form is submitted', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      const user = userEvent.setup()
      render(<VehicleContainer />)

      await user.type(screen.getByLabelText('Kilométrage'), '92305')
      fireEvent.click(screen.getByText('Mettre à jour'))

      await waitFor(() => expect(updateMileageSpy).toHaveBeenCalled())
    })
  })

  describe('edit mode', () => {
    it('should display vehicle name as title in edit mode', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))

      expect(screen.getByText('Modifier Mini Cooper S Coupé (2012)')).toBeInTheDocument()
    })

    it('should switch to edit form when "Modifier" is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))

      expect(screen.getByText('Enregistrer')).toBeInTheDocument()
      expect(screen.getByText('Annuler')).toBeInTheDocument()
    })

    it('should pre-fill form with vehicle data', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))

      expect(screen.getByDisplayValue('Mini')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Cooper S Coupé')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2012')).toBeInTheDocument()
    })

    it('should hide mileage field in edit mode', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))

      expect(screen.queryByLabelText('Kilométrage')).not.toBeInTheDocument()
    })

    it('should return to view when cancel is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))
      fireEvent.click(screen.getByText('Annuler'))

      expect(screen.getByText('Marque')).toBeInTheDocument()
      expect(screen.getByText('Modèle')).toBeInTheDocument()
      expect(screen.getByText('Année')).toBeInTheDocument()
    })

    it('should call updateVehicle on form submit', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      const user = userEvent.setup()
      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))

      await user.type(screen.getByLabelText('Type de moteur'), '1.6l Turbo')
      fireEvent.click(screen.getByText('Enregistrer'))

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
      fireEvent.click(screen.getByText('Supprimer'))

      expect(screen.getByText('Supprimer le véhicule')).toBeInTheDocument()
    })

    it('should hide dialog when cancel is clicked', () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Supprimer'))
      fireEvent.click(screen.getByText('Annuler'))

      expect(screen.queryByText('Supprimer le véhicule')).not.toBeInTheDocument()
    })

    it('should call deleteVehicle and return to empty on confirm', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Supprimer'))
      const dialogDeleteButton = screen.getAllByText('Supprimer')[1]
      fireEvent.click(dialogDeleteButton)

      await waitFor(() => expect(removeSpy).toHaveBeenCalled())
    })
  })

  describe('error handling', () => {
    it('should display server error when an action fails', async () => {
      $isLoading.set(false)
      $vehicle.set(mockVehicle)
      updateSpy.mockRejectedValueOnce(new Error('Update failed'))

      render(<VehicleContainer />)
      fireEvent.click(screen.getByText('Modifier'))
      fireEvent.click(screen.getByText('Enregistrer'))

      await waitFor(() => expect(screen.getByText('Update failed')).toBeInTheDocument())
    })
  })
})

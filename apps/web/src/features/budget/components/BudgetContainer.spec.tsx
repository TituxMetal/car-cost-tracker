import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { expenseActions } from '~/features/expenses/store'
import type { Vehicle } from '~/features/vehicles'
import {
  $isLoading as $isVehicleLoading,
  $vehicle,
  vehicleActions
} from '~/features/vehicles/store'
import { act, cleanup, fireEvent, render, screen, userEvent, waitFor, within } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { $budget, $error, $isLoading, budgetActions } from '../store'
import type { Budget } from '../types'

import { BudgetContainer } from './BudgetContainer'

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

const mockBudget: Budget = {
  id: 'b-1',
  vehicleId: 'v-1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z'
}

describe('BudgetContainer', () => {
  let fetchVehicleSpy: ReturnType<typeof spyOn>
  let fetchExpensesSpy: ReturnType<typeof spyOn>
  let fetchBudgetSpy: ReturnType<typeof spyOn>
  let upsertBudgetSpy: ReturnType<typeof spyOn>
  let deleteBudgetSpy: ReturnType<typeof spyOn>
  let redirectSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $vehicle.set(null)
    $isVehicleLoading.set(false)
    $budget.set(null)
    $isLoading.set(false)
    $error.set(null)

    fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    fetchExpensesSpy = spyOn(expenseActions, 'fetchExpenses').mockResolvedValue(undefined)
    fetchBudgetSpy = spyOn(budgetActions, 'fetchBudget').mockResolvedValue(null)
    upsertBudgetSpy = spyOn(budgetActions, 'upsertBudget').mockResolvedValue(mockBudget)
    deleteBudgetSpy = spyOn(budgetActions, 'deleteBudget').mockResolvedValue(undefined)
    redirectSpy = spyOn(navigationUtils, 'redirect').mockImplementation(() => {})
  })

  afterEach(() => {
    fetchVehicleSpy.mockRestore()
    fetchExpensesSpy.mockRestore()
    fetchBudgetSpy.mockRestore()
    upsertBudgetSpy.mockRestore()
    deleteBudgetSpy.mockRestore()
    redirectSpy.mockRestore()
  })

  describe('initial render', () => {
    it('shows the loading state while the vehicle fetch is pending', async () => {
      fetchVehicleSpy.mockImplementation(() => new Promise<void>(() => {}))

      await act(async () => {
        render(<BudgetContainer />)
      })

      expect(screen.getByText(/Chargement/i)).toBeInTheDocument()
    })

    it('redirects to /vehicle when no vehicle exists after the fetch resolves', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      expect(redirectSpy).toHaveBeenCalledWith('/vehicle')
    })
  })

  describe('with a vehicle', () => {
    beforeEach(() => {
      $vehicle.set(mockVehicle)
    })

    it('fetches expenses and budget once the vehicle is available', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      expect(fetchExpensesSpy).toHaveBeenCalledWith(mockVehicle.id)
      expect(fetchBudgetSpy).toHaveBeenCalledWith(mockVehicle.id)
    })

    it('renders the empty state when no budget is defined', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      expect(screen.getByText(/Aucun budget défini/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Définir un budget' })).toBeInTheDocument()
    })

    it('renders the status panels when a budget exists', async () => {
      $budget.set(mockBudget)

      await act(async () => {
        render(<BudgetContainer />)
      })

      expect(screen.getByRole('heading', { level: 2, name: 'Ce mois' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Cette année' })).toBeInTheDocument()
    })

    it('renders the error alert when $error is set', async () => {
      $error.set('Boom')

      await act(async () => {
        render(<BudgetContainer />)
      })

      expect(screen.getByRole('alert')).toHaveTextContent('Boom')
    })
  })

  describe('create flow', () => {
    beforeEach(() => {
      $vehicle.set(mockVehicle)
    })

    it('opens the create dialog when the empty-state CTA is clicked', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: 'Définir un budget' }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
      expect(screen.getByLabelText('Montant (€)')).toBeInTheDocument()
      expect(screen.getByLabelText('Période')).toBeInTheDocument()
    })

    it('submits a valid budget, closes the dialog and shows success feedback', async () => {
      const user = userEvent.setup()

      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: 'Définir un budget' }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await user.type(screen.getByLabelText('Montant (€)'), '250')
      await user.selectOptions(screen.getByLabelText('Période'), 'MONTHLY')

      fireEvent.click(screen.getByRole('button', { name: /^enregistrer$/i }))

      await waitFor(() => {
        expect(upsertBudgetSpy).toHaveBeenCalledWith(mockVehicle.id, {
          amountCents: 25000,
          period: 'MONTHLY'
        })
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })

      expect(screen.getByRole('status')).toHaveTextContent('Budget enregistré')
    })
  })

  describe('edit flow', () => {
    beforeEach(() => {
      $vehicle.set(mockVehicle)
      $budget.set(mockBudget)
    })

    it('opens the edit dialog pre-filled when "Modifier le budget" is clicked', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /Modifier le budget/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      expect(screen.getByLabelText('Montant (€)')).toHaveValue('250,00')
      expect(screen.getByLabelText('Période')).toHaveValue('MONTHLY')
      expect(screen.getByRole('button', { name: /Mettre à jour/i })).toBeInTheDocument()
    })

    it('submits the updated budget and shows the "Budget modifié" feedback', async () => {
      const user = userEvent.setup()

      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /Modifier le budget/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await user.clear(screen.getByLabelText('Montant (€)'))
      await user.type(screen.getByLabelText('Montant (€)'), '500')

      fireEvent.click(screen.getByRole('button', { name: /Mettre à jour/i }))

      await waitFor(() => {
        expect(upsertBudgetSpy).toHaveBeenCalledWith(mockVehicle.id, {
          amountCents: 50000,
          period: 'MONTHLY'
        })
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })

      expect(screen.getByRole('status')).toHaveTextContent('Budget modifié')
    })
  })

  describe('delete flow', () => {
    beforeEach(() => {
      $vehicle.set(mockVehicle)
      $budget.set(mockBudget)
    })

    it('opens the delete confirmation when "Supprimer" is clicked', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /^Supprimer$/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      expect(screen.getByText('Supprimer le budget')).toBeInTheDocument()
    })

    it('calls deleteBudget on confirm and transitions back to the empty state', async () => {
      deleteBudgetSpy.mockImplementation(async () => {
        $budget.set(null)
      })

      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /^Supprimer$/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const dialog = screen.getByRole('dialog')
      fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

      await waitFor(() => {
        expect(deleteBudgetSpy).toHaveBeenCalledWith(mockVehicle.id)
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })

      expect(screen.getByRole('status')).toHaveTextContent('Budget supprimé')
      expect(screen.getByText(/Aucun budget défini/i)).toBeInTheDocument()
    })

    it('closes the confirmation when Annuler is clicked', async () => {
      await act(async () => {
        render(<BudgetContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /^Supprimer$/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })

      expect(deleteBudgetSpy).not.toHaveBeenCalled()
    })
  })
})

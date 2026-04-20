import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import type { Vehicle } from '~/features/vehicles'
import {
  $isLoading as $isVehicleLoading,
  $vehicle,
  vehicleActions
} from '~/features/vehicles/store'
import { act, cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { $categoryFilter, $error, $expenses, $isLoading, expenseActions } from '../store'
import type { Expense } from '../types'

import { ExpensesContainer } from './ExpensesContainer'

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

const mockExpenses: Expense[] = [
  {
    id: 'e-1',
    vehicleId: 'v-1',
    occurredAt: '2026-03-15',
    amountCents: 8950,
    category: 'SERVICE',
    description: 'Vidange',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 'e-2',
    vehicleId: 'v-1',
    occurredAt: '2026-03-10',
    amountCents: 12000,
    category: 'PARTS',
    description: null,
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-10T10:00:00Z'
  }
]

describe('ExpensesContainer', () => {
  let fetchVehicleSpy: ReturnType<typeof spyOn>
  let fetchExpensesSpy: ReturnType<typeof spyOn>
  let createSpy: ReturnType<typeof spyOn>
  let updateSpy: ReturnType<typeof spyOn>
  let removeSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $vehicle.set(null)
    $isVehicleLoading.set(false)
    $expenses.set([])
    $categoryFilter.set(null)
    $isLoading.set(false)
    $error.set(null)

    fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    fetchExpensesSpy = spyOn(expenseActions, 'fetchExpenses').mockResolvedValue(undefined)
    createSpy = spyOn(expenseActions, 'create').mockResolvedValue(mockExpenses[0])
    updateSpy = spyOn(expenseActions, 'update').mockResolvedValue(mockExpenses[0])
    removeSpy = spyOn(expenseActions, 'remove').mockResolvedValue(undefined)
  })

  afterEach(() => {
    fetchVehicleSpy.mockRestore()
    fetchExpensesSpy.mockRestore()
    createSpy.mockRestore()
    updateSpy.mockRestore()
    removeSpy.mockRestore()
  })

  describe('loading + initial fetch', () => {
    it('should show loading state initially', async () => {
      await act(async () => {
        render(<ExpensesContainer />)
      })

      expect(screen.getByText(/Chargement/i)).toBeInTheDocument()
    })

    it('should redirect to /vehicle when no vehicle exists', async () => {
      $vehicle.set(null)
      $isLoading.set(false)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => expect(navigationUtils.redirect).toHaveBeenCalledWith('/vehicle'))
    })

    it('should call fetchExpenses with vehicle.id once the vehicle is available', async () => {
      $vehicle.set(mockVehicle)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => expect(fetchExpensesSpy).toHaveBeenCalledWith(mockVehicle.id))
    })

    it('should render the page title once loaded', async () => {
      $vehicle.set(mockVehicle)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() =>
        expect(screen.getByRole('heading', { name: /Mes dépenses/i })).toBeInTheDocument()
      )
    })
  })

  describe('list rendering', () => {
    it('should render a card for each expense', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set(mockExpenses)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getAllByText('89,50 €').length).toBeGreaterThan(0)
        expect(screen.getAllByText('120,00 €').length).toBeGreaterThan(0)
      })
    })

    it('should render the default empty state when no expenses exist', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([])

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(
          screen.getByText('Aucune dépense enregistrée — ajoutez votre première dépense !')
        ).toBeInTheDocument()
      })
    })

    it('should render the filtered empty state when a filter yields no match', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set(mockExpenses)
      $categoryFilter.set('LABOR')

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByText('Aucune dépense dans cette catégorie')).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('should display $error as an alert', async () => {
      $vehicle.set(mockVehicle)
      $error.set('Une erreur est survenue')

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
        expect(alert.textContent).toContain('Une erreur est survenue')
      })
    })
  })

  describe('create flow', () => {
    it('should render the "Ajouter une dépense" button in the header', async () => {
      $vehicle.set(mockVehicle)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ajouter une dépense/i })).toBeInTheDocument()
      })
    })

    it('should open the create dialog when the button is clicked', async () => {
      $vehicle.set(mockVehicle)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ajouter une dépense/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /ajouter une dépense/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Ajouter une dépense', { selector: '.modal-box h2' }))
      })
    })

    it('should call create and close the dialog on successful submit', async () => {
      $vehicle.set(mockVehicle)

      const user = userEvent.setup()

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ajouter une dépense/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /ajouter une dépense/i }))

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

      await user.clear(screen.getByLabelText('Date'))
      await user.type(screen.getByLabelText('Date'), '2026-03-15')
      await user.type(screen.getByLabelText('Montant (€)'), '89,50')
      await user.selectOptions(screen.getByLabelText('Catégorie'), 'SERVICE')

      fireEvent.click(screen.getByRole('button', { name: /^enregistrer$/i }))

      await waitFor(() => {
        expect(createSpy).toHaveBeenCalledWith(mockVehicle.id, {
          occurredAt: '2026-03-15',
          amountCents: 8950,
          category: 'SERVICE',
          description: undefined
        })
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByText('Dépense enregistrée')).toBeInTheDocument()
      })
    })

    it('should close the dialog when "Annuler" is clicked', async () => {
      $vehicle.set(mockVehicle)

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ajouter une dépense/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /ajouter une dépense/i }))

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('edit flow', () => {
    it('should open the edit dialog pre-filled when "Modifier" is clicked', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([mockExpenses[0]])

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /modifier/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByLabelText('Date')).toHaveValue(mockExpenses[0].occurredAt)
        expect(screen.getByLabelText('Montant (€)')).toHaveValue('89,50')
        expect(screen.getByLabelText('Catégorie')).toHaveValue('SERVICE')
      })
    })

    it('should call update and close the dialog on successful submit', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([mockExpenses[0]])

      const user = userEvent.setup()

      await act(async () => {
        render(<ExpensesContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /modifier/i }))

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

      await user.clear(screen.getByLabelText('Montant (€)'))
      await user.type(screen.getByLabelText('Montant (€)'), '120,00')

      fireEvent.click(screen.getByRole('button', { name: /^enregistrer$/i }))

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith(mockVehicle.id, mockExpenses[0].id, {
          occurredAt: mockExpenses[0].occurredAt,
          amountCents: 12000,
          category: mockExpenses[0].category,
          description: mockExpenses[0].description
        })
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByText('Dépense mise à jour')).toBeInTheDocument()
      })
    })

    it('should send an empty description string when the user clears the field', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([mockExpenses[0]])

      const user = userEvent.setup()

      await act(async () => {
        render(<ExpensesContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /modifier/i }))

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

      await user.clear(screen.getByLabelText('Description'))

      fireEvent.click(screen.getByRole('button', { name: /^enregistrer$/i }))

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith(mockVehicle.id, mockExpenses[0].id, {
          occurredAt: mockExpenses[0].occurredAt,
          amountCents: mockExpenses[0].amountCents,
          category: mockExpenses[0].category,
          description: ''
        })
      })
    })
  })

  describe('delete flow', () => {
    it('should open the delete confirmation when "Supprimer" is clicked', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([mockExpenses[0]])

      await act(async () => {
        render(<ExpensesContainer />)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

      await waitFor(() => {
        expect(screen.getByText('Supprimer la dépense')).toBeInTheDocument()
        expect(screen.getByText(/irréversible/i)).toBeInTheDocument()
      })
    })

    it('should call remove and close the dialog on confirm', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([mockExpenses[0]])

      await act(async () => {
        render(<ExpensesContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

      await waitFor(() => expect(screen.getByText('Supprimer la dépense')).toBeInTheDocument())

      const confirmButtons = screen.getAllByRole('button', { name: 'Supprimer' })
      // The last "Supprimer" button is the one inside the dialog (confirm)
      fireEvent.click(confirmButtons[confirmButtons.length - 1])

      await waitFor(() => {
        expect(removeSpy).toHaveBeenCalledWith(mockVehicle.id, mockExpenses[0].id)
      })

      await waitFor(() => {
        expect(screen.queryByText('Supprimer la dépense')).not.toBeInTheDocument()
        expect(screen.getByText('Dépense supprimée')).toBeInTheDocument()
      })
    })

    it('should close the dialog without deleting when "Annuler" is clicked', async () => {
      $vehicle.set(mockVehicle)
      $expenses.set([mockExpenses[0]])

      await act(async () => {
        render(<ExpensesContainer />)
      })

      fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

      await waitFor(() => expect(screen.getByText('Supprimer la dépense')).toBeInTheDocument())

      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

      await waitFor(() => {
        expect(screen.queryByText('Supprimer la dépense')).not.toBeInTheDocument()
        expect(removeSpy).not.toHaveBeenCalled()
      })
    })
  })
})

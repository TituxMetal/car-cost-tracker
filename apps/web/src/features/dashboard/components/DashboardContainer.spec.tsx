import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { $budget, budgetActions } from '~/features/budget/store'
import {
  $checkLogs,
  $checkStatuses,
  $error as $checkLogsError,
  $isLoading as $checkLogsLoading,
  checkLogActions
} from '~/features/check-logs/store'
import {
  $checkTypes,
  $error as $checkTypesError,
  $isLoading as $checkTypesLoading,
  checkTypeActions
} from '~/features/check-types/store'
import type { CheckType } from '~/features/check-types/types'
import { $expenses, expenseActions } from '~/features/expenses/store'
import type { Vehicle } from '~/features/vehicles'
import {
  $error as $vehicleError,
  $isLoading as $vehicleLoading,
  $vehicle,
  vehicleActions
} from '~/features/vehicles/store'
import { act, cleanup, fireEvent, render, screen, waitFor } from '~/test-utils'

import { DashboardContainer } from './DashboardContainer'

const mockVehicle: Vehicle = {
  id: 'v1',
  userId: 'u1',
  make: 'Peugeot',
  model: '205 GTI',
  year: 1990,
  engineType: '1.9L',
  fuelType: 'GASOLINE',
  vin: null,
  licensePlate: null,
  purchaseDate: null,
  mileage: 120000,
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z'
}

const mockCheckType: CheckType = {
  id: 'ct1',
  vehicleId: 'v1',
  name: 'Vidange',
  description: null,
  intervalDays: 30,
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z'
}

const resetStores = () => {
  $vehicle.set(null)
  $vehicleLoading.set(false)
  $vehicleError.set(null)
  $checkLogs.set([])
  $checkStatuses.set([])
  $checkLogsLoading.set(false)
  $checkLogsError.set(null)
  $checkTypes.set([])
  $checkTypesLoading.set(false)
  $checkTypesError.set(null)
  $budget.set(null)
  $expenses.set([])
}

const renderContainer = async () => {
  await act(async () => {
    render(<DashboardContainer />)
  })
}

describe('DashboardContainer', () => {
  let fetchVehicleSpy: ReturnType<typeof spyOn<typeof vehicleActions, 'fetchVehicle'>>
  let fetchByVehicleSpy: ReturnType<typeof spyOn<typeof checkTypeActions, 'fetchByVehicle'>>
  let fetchStatusesSpy: ReturnType<typeof spyOn<typeof checkLogActions, 'fetchStatuses'>>
  let fetchLogsSpy: ReturnType<typeof spyOn<typeof checkLogActions, 'fetchLogs'>>
  let fetchBudgetSpy: ReturnType<typeof spyOn<typeof budgetActions, 'fetchBudget'>>
  let fetchExpensesSpy: ReturnType<typeof spyOn<typeof expenseActions, 'fetchExpenses'>>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    resetStores()
    fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    fetchByVehicleSpy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(undefined)
    fetchStatusesSpy = spyOn(checkLogActions, 'fetchStatuses').mockResolvedValue(undefined)
    fetchLogsSpy = spyOn(checkLogActions, 'fetchLogs').mockResolvedValue(undefined)
    fetchBudgetSpy = spyOn(budgetActions, 'fetchBudget').mockResolvedValue(null)
    fetchExpensesSpy = spyOn(expenseActions, 'fetchExpenses').mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
    fetchVehicleSpy.mockRestore()
    fetchByVehicleSpy.mockRestore()
    fetchStatusesSpy.mockRestore()
    fetchLogsSpy.mockRestore()
    fetchBudgetSpy.mockRestore()
    fetchExpensesSpy.mockRestore()
  })

  it('renders the sr-only dashboard heading', async () => {
    await renderContainer()

    expect(screen.getByRole('heading', { name: /Tableau de bord/i, level: 1 })).toBeInTheDocument()
  })

  it('shows the loading status while initialization is in progress', async () => {
    fetchVehicleSpy.mockImplementationOnce(() => new Promise(() => {}))

    await act(async () => {
      render(<DashboardContainer />)
    })

    expect(screen.getByRole('status')).toHaveTextContent('Chargement...')
  })

  it('calls fetchVehicle on mount', async () => {
    await renderContainer()

    expect(fetchVehicleSpy).toHaveBeenCalled()
  })

  it('shows the no-vehicle empty state once initialization completes without a vehicle', async () => {
    await renderContainer()

    await waitFor(() => {
      expect(screen.getByText('Aucun véhicule enregistré')).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: /Ajouter un véhicule/i })).toHaveAttribute(
      'href',
      '/vehicle'
    )
  })

  it('shows the no-check-types empty state when a vehicle exists without check types', async () => {
    $vehicle.set(mockVehicle)

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByText('Aucun type de contrôle défini')).toBeInTheDocument()
    })
  })

  it('shows an error alert with a retry button when an error occurs', async () => {
    $vehicleError.set('Boom')

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Boom')
    })
    expect(screen.getByRole('button', { name: /Réessayer/i })).toBeInTheDocument()
  })

  it('runs the full initialization again when the retry button is clicked', async () => {
    $vehicleError.set('Boom')

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Réessayer/i })).toBeInTheDocument()
    })

    fetchVehicleSpy.mockClear()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Réessayer/i }))
    })

    expect(fetchVehicleSpy).toHaveBeenCalled()
  })

  it('renders the cluster sidebar (VehicleActivePanel + TelltaleGrid + LastEntryCard)', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])

    await renderContainer()

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 2, name: /Peugeot 205 GTI/i })
      ).toBeInTheDocument()
    })
    expect(screen.getByRole('region', { name: /voyants actifs/i })).toBeInTheDocument()
    expect(screen.getByText(/dernière entrée/i)).toBeInTheDocument()
  })

  it('renders the BudgetPanel in the sidebar when a budget exists', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $budget.set({
      id: 'b1',
      vehicleId: 'v1',
      amountCents: 30000,
      period: 'MONTHLY',
      createdAt: '2026-04-01T00:00:00.000Z',
      updatedAt: '2026-04-01T00:00:00.000Z'
    })

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Mensuel' })).toBeInTheDocument()
    })
    expect(screen.getByRole('region', { name: 'Annuel' })).toBeInTheDocument()
  })

  it('renders the RecentExpensesPanel in the main column when expenses exist', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $expenses.set([
      {
        id: 'e1',
        vehicleId: 'v1',
        occurredAt: '2026-04-15',
        amountCents: 5000,
        category: 'SERVICE',
        description: null,
        createdAt: '2026-04-15T00:00:00.000Z',
        updatedAt: '2026-04-15T00:00:00.000Z'
      }
    ])

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByTestId('recent-expenses-panel')).toBeInTheDocument()
    })
  })

  it('renders the cluster main column (HealthSummary + UpcomingChecksGrid + RecentTimeline)', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $checkStatuses.set([
      {
        checkTypeId: 'ct1',
        checkTypeName: 'Vidange',
        intervalDays: 30,
        lastCompletedAt: '2026-04-01',
        nextDueAt: '2026-05-01',
        status: 'on-time'
      }
    ])

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('region', { name: /santé globale/i })).toBeInTheDocument()
    })
    expect(screen.getByRole('region', { name: /prochains contrôles/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /timeline 30 derniers jours/i })).toBeInTheDocument()
  })

  it('renders the mobile-only ActionItemsList when overdue or due-soon statuses exist', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $checkStatuses.set([
      {
        checkTypeId: 'ct1',
        checkTypeName: 'Vidange',
        intervalDays: 30,
        lastCompletedAt: '2025-12-01',
        nextDueAt: '2025-12-31',
        status: 'overdue'
      }
    ])

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('region', { name: /à traiter/i })).toBeInTheDocument()
    })
  })

  it('does not render the ActionItemsList when no actionable statuses exist', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $checkStatuses.set([
      {
        checkTypeId: 'ct1',
        checkTypeName: 'Vidange',
        intervalDays: 30,
        lastCompletedAt: '2026-04-01',
        nextDueAt: '2099-05-01',
        status: 'on-time'
      }
    ])

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('region', { name: /santé globale/i })).toBeInTheDocument()
    })
    expect(screen.queryByRole('region', { name: /à traiter/i })).toBeNull()
  })

  it('opens the LogCheckDialog (single-type) when an action item row is clicked', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $checkStatuses.set([
      {
        checkTypeId: 'ct1',
        checkTypeName: 'Vidange',
        intervalDays: 30,
        lastCompletedAt: '2025-12-01',
        nextDueAt: '2025-12-31',
        status: 'overdue'
      }
    ])

    await renderContainer()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Enregistrer le contrôle Vidange/i })
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Enregistrer le contrôle Vidange/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 2, name: /Journaliser un contrôle/i })
      ).toBeVisible()
    })
  })

  it('opens the LogCheckDialog in picker mode from the UpcomingChecksGrid CTA', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $checkStatuses.set([
      {
        checkTypeId: 'ct1',
        checkTypeName: 'Vidange',
        intervalDays: 30,
        lastCompletedAt: '2026-04-01',
        nextDueAt: '2099-05-01',
        status: 'on-time'
      }
    ])

    await renderContainer()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /journaliser/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /journaliser/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('Type de contrôle')).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('Date du contrôle')).toBeNull()
  })

  it('shows an alert and keeps the dialog open when logCheck fails', async () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([mockCheckType])
    $checkStatuses.set([
      {
        checkTypeId: 'ct1',
        checkTypeName: 'Vidange',
        intervalDays: 30,
        lastCompletedAt: '2025-12-01',
        nextDueAt: '2025-12-31',
        status: 'overdue'
      }
    ])

    const createSpy = spyOn(checkLogActions, 'create').mockImplementation(() => {
      throw new Error('Server unavailable')
    })

    await renderContainer()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Enregistrer le contrôle Vidange/i })
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Enregistrer le contrôle Vidange/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 2, name: /Journaliser un contrôle/i })
      ).toBeVisible()
    })

    const submitButton = screen
      .getAllByRole('button', { name: /Enregistrer l'entrée/i })
      .find(button => button.getAttribute('type') === 'submit')

    if (!submitButton) throw new Error('Submit button not found in dialog')

    await act(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Server unavailable')).toBeInTheDocument()
    })
    expect(
      screen.getByRole('heading', { level: 2, name: /Journaliser un contrôle/i })
    ).toBeVisible()

    createSpy.mockRestore()
  })
})

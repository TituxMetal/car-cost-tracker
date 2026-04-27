import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { $checkTypes, checkTypeActions } from '~/features/check-types/store'
import type { CheckType } from '~/features/check-types/types'
import type { Vehicle } from '~/features/vehicles'
import {
  $isLoading as $isVehicleLoading,
  $vehicle,
  vehicleActions
} from '~/features/vehicles/store'
import { cleanup, fireEvent, render, screen, waitFor } from '~/test-utils'

import { $checkLogs, $error, $isLoading, checkLogActions } from '../store'
import type { CheckLog } from '../types'

import { CheckLogContainer } from './CheckLogContainer'

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

const mockVehicle: Vehicle = {
  id: 'v-1',
  userId: 'u-1',
  make: 'Mini',
  model: 'Cooper',
  year: 2020,
  engineType: '1.6L Turbo',
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
    name: 'Vidange',
    description: null,
    intervalDays: 7,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'ct-2',
    vehicleId: 'v-1',
    name: 'Pneus',
    description: null,
    intervalDays: 30,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  }
]

const mockCheckLogs: CheckLog[] = [
  {
    id: 'cl-1',
    checkTypeId: 'ct-1',
    checkTypeName: 'Vidange',
    completedAt: '2026-03-15',
    notes: 'All good',
    nextDueAt: '2026-03-22',
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 'cl-2',
    checkTypeId: 'ct-2',
    checkTypeName: 'Pneus',
    completedAt: '2026-03-10',
    notes: null,
    nextDueAt: '2026-04-09',
    createdAt: '2026-03-10T10:00:00Z'
  }
]

describe('CheckLogContainer', () => {
  let fetchVehicleSpy: ReturnType<typeof spyOn>
  let fetchLogsSpy: ReturnType<typeof spyOn>
  let fetchCheckTypesSpy: ReturnType<typeof spyOn>
  let removeSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $vehicle.set(null)
    $isVehicleLoading.set(false)
    $checkLogs.set([])
    $checkTypes.set([])
    $isLoading.set(false)
    $error.set(null)

    fetchVehicleSpy = spyOn(vehicleActions, 'fetchVehicle').mockResolvedValue(undefined)
    fetchLogsSpy = spyOn(checkLogActions, 'fetchLogs').mockResolvedValue(undefined)
    fetchCheckTypesSpy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(undefined)
    removeSpy = spyOn(checkLogActions, 'remove').mockResolvedValue(undefined)
  })

  afterEach(() => {
    fetchVehicleSpy.mockRestore()
    fetchLogsSpy.mockRestore()
    fetchCheckTypesSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('should show loading state initially', () => {
    $isVehicleLoading.set(true)

    render(<CheckLogContainer />)

    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('should render the list with kicker, composite h1 and filter after loading', async () => {
    $vehicle.set(mockVehicle)
    $checkLogs.set(mockCheckLogs)
    $checkTypes.set(mockCheckTypes)

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('ARCHIVES · JOURNAL DES CONTRÔLES')).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 1, name: /2 entrées · Tous les contrôles/i })
      ).toBeInTheDocument()
      expect(screen.getByText('Filtrer par type')).toBeInTheDocument()
      expect(screen.getByText('All good')).toBeInTheDocument()
    })
  })

  it('should filter logs by selected check type', async () => {
    $vehicle.set(mockVehicle)
    $checkLogs.set(mockCheckLogs)
    $checkTypes.set(mockCheckTypes)

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('15.03.2026')).toBeInTheDocument()
      expect(screen.getByText('10.03.2026')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Filtrer par type'), { target: { value: 'ct-1' } })

    await waitFor(() => {
      expect(screen.getByText('15.03.2026')).toBeInTheDocument()
      expect(screen.queryByText('10.03.2026')).not.toBeInTheDocument()
    })
  })

  it('should show all logs when "Tous les types" is selected', async () => {
    $vehicle.set(mockVehicle)
    $checkLogs.set(mockCheckLogs)
    $checkTypes.set(mockCheckTypes)

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('15.03.2026')).toBeInTheDocument()
      expect(screen.getByText('10.03.2026')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Filtrer par type'), { target: { value: 'ct-1' } })

    await waitFor(() => {
      expect(screen.queryByText('10.03.2026')).not.toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Filtrer par type'), { target: { value: '' } })

    await waitFor(() => {
      expect(screen.getByText('15.03.2026')).toBeInTheDocument()
      expect(screen.getByText('10.03.2026')).toBeInTheDocument()
    })
  })

  it('should show delete dialog when delete is clicked', async () => {
    $vehicle.set(mockVehicle)
    $checkLogs.set(mockCheckLogs)
    $checkTypes.set(mockCheckTypes)

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('All good')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Supprimer le contrôle')).toBeInTheDocument()
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer ce contrôle/)).toBeInTheDocument()
    })
  })

  it('should call remove and close dialog on delete confirm', async () => {
    $vehicle.set(mockVehicle)
    $checkLogs.set(mockCheckLogs)
    $checkTypes.set(mockCheckTypes)

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('All good')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Supprimer le contrôle')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(removeSpy).toHaveBeenCalledWith(mockVehicle.id, 'cl-1')
    })
  })

  it('should show empty state when no logs exist', async () => {
    $vehicle.set(mockVehicle)
    $checkLogs.set([])

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('Aucun contrôle enregistré')).toBeInTheDocument()
    })
  })

  it('should display error when error exists', async () => {
    $vehicle.set(mockVehicle)
    $error.set('Test error')

    render(<CheckLogContainer />)

    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })
  })
})

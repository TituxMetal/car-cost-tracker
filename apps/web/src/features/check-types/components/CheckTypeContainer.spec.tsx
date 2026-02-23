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
import { cleanup, render, screen } from '~/test-utils'
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
  })

  afterEach(() => {
    fetchCheckTypesSpy.mockRestore()
    fetchVehicleSpy.mockRestore()
  })

  it('should show loading state', () => {
    $isVehicleLoading.set(true)
    render(<CheckTypeContainer />)

    expect(screen.getByText('Chargement...')).toBeVisible()
  })

  it('should redirect when no vehicle exists', () => {
    $vehicle.set(null)
    $isVehicleLoading.set(false)

    render(<CheckTypeContainer />)

    expect(navigationUtils.redirect).toHaveBeenCalledWith('/vehicle')
  })

  it('should fetch check types when vehicle is available', () => {
    $vehicle.set(mockVehicle)

    render(<CheckTypeContainer />)

    expect(fetchCheckTypesSpy).toHaveBeenCalledWith(mockVehicle.id)
  })

  it('should render check type list when data is loaded', () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set(mockCheckTypes)

    render(<CheckTypeContainer />)

    expect(screen.getByText(`Niveau d'huile`)).toBeVisible()
    expect(screen.getByText('Pression des pneus')).toBeVisible()
  })

  it('should render empty list when no check types exist', () => {
    $vehicle.set(mockVehicle)
    $checkTypes.set([])

    render(<CheckTypeContainer />)

    expect(screen.getByText('Aucun type de contrôle trouvé. Veuillez en ajouter un.')).toBeVisible()
  })
})

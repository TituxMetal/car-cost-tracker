import { beforeEach, describe, expect, it } from 'bun:test'

import type { Vehicle } from '~/features/vehicles'
import { cleanup, render, screen } from '~/test-utils'

import { VehicleSummaryCard } from './VehicleSummaryCard'

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

describe('VehicleSummaryCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the make and model as a heading', () => {
    render(<VehicleSummaryCard vehicle={mockVehicle} />)

    expect(screen.getByRole('heading', { name: /Peugeot 205 GTI/i })).toBeInTheDocument()
  })

  it('renders the year and formatted mileage together', () => {
    render(<VehicleSummaryCard vehicle={mockVehicle} />)

    expect(screen.getByText(/1990/)).toBeInTheDocument()
    expect(screen.getByText(/120000 kms/)).toBeInTheDocument()
  })

  it('renders a details link pointing to /vehicle', () => {
    render(<VehicleSummaryCard vehicle={mockVehicle} />)

    const link = screen.getByRole('link', { name: /Détails/i })
    expect(link).toHaveAttribute('href', '/vehicle')
  })
})

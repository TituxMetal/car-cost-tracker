import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import type { Vehicle } from '~/features/vehicles'
import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { VehicleActivePanel } from './VehicleActivePanel'

const mockVehicle: Vehicle = {
  id: 'v1',
  userId: 'u1',
  make: 'Peugeot',
  model: '206 CC',
  year: 2004,
  engineType: '1.6L 16V',
  fuelType: 'GASOLINE',
  vin: null,
  licensePlate: null,
  purchaseDate: null,
  mileage: 187420,
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z'
}

const HISTORY_KEY = `mileage-history:${mockVehicle.id}`

describe('VehicleActivePanel', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('renders the kicker, make/model heading and year · engine sub line', () => {
    render(<VehicleActivePanel vehicle={mockVehicle} />)

    expect(screen.getByText(/véhicule actif/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Peugeot 206 CC/i })).toBeInTheDocument()
    expect(screen.getByText(/2004 · 1\.6L 16V/)).toBeInTheDocument()
  })

  it('falls back to em-dash when engineType is null', () => {
    render(<VehicleActivePanel vehicle={{ ...mockVehicle, engineType: null }} />)

    expect(screen.getByText(/2004 · —/)).toBeInTheDocument()
  })

  it('renders the formatted odometer reading and KM unit', () => {
    render(<VehicleActivePanel vehicle={mockVehicle} />)

    expect(screen.getByText(/187/)).toBeInTheDocument()
    expect(screen.getByText('KM')).toBeInTheDocument()
  })

  it('renders the +DEPUIS placeholder when no mileage history exists', () => {
    render(<VehicleActivePanel vehicle={mockVehicle} />)

    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders the +DEPUIS delta and recorded date when history exists', () => {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([{ recordedAt: '2026-04-12T08:00:00.000Z', mileage: 187420, delta: 440 }])
    )

    render(<VehicleActivePanel vehicle={mockVehicle} />)

    expect(screen.getByText('+440')).toBeInTheDocument()
    expect(screen.getByText('12.04.2026')).toBeInTheDocument()
  })

  it('hides the update CTA when onUpdateMileage is not provided', () => {
    render(<VehicleActivePanel vehicle={mockVehicle} />)

    expect(screen.queryByRole('button', { name: /Mettre à jour kilométrage/i })).toBeNull()
  })

  it('renders the update CTA and triggers the callback on click', () => {
    let clicked = 0
    const handleUpdate = () => {
      clicked += 1
    }

    render(<VehicleActivePanel vehicle={mockVehicle} onUpdateMileage={handleUpdate} />)

    const button = screen.getByRole('button', { name: /Mettre à jour kilométrage/i })
    fireEvent.click(button)

    expect(clicked).toBe(1)
  })
})

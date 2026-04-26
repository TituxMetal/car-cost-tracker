import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { Vehicle } from '../types'

import { VehicleProfile } from './VehicleProfile'

const mockVehicle: Vehicle = {
  id: 'v1',
  userId: 'u1',
  make: 'Mini',
  model: 'Cooper S',
  year: 2012,
  engineType: '1.6L Turbo',
  fuelType: 'GASOLINE',
  vin: '12345678901234567',
  licensePlate: 'AB-123-CD',
  purchaseDate: '2020-06-15',
  mileage: 75000,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

describe('VehicleProfile', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the cluster kicker label', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText(/fiche véhicule/i)).toBeInTheDocument()
  })

  it('should render the make and model in the level-1 heading', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/mini cooper s/i)
    expect(heading.tagName).toBe('H1')
  })

  it('should render the composed sub line with year and engine type', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('— 2012 · 1.6L Turbo')).toBeInTheDocument()
  })

  it('should drop the engine type from the sub line when null', () => {
    const actions = mock(() => {})
    const noEngine: Vehicle = { ...mockVehicle, engineType: null }
    render(<VehicleProfile vehicle={noEngine} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('— 2012')).toBeInTheDocument()
    expect(screen.queryByText(/1\.6L Turbo/i)).not.toBeInTheDocument()
  })

  it('should render the photo placeholder copy', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText(/dans les cartons/i)).toBeInTheDocument()
  })

  it('should render all vehicle fields with French labels', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('Marque')).toBeInTheDocument()
    expect(screen.getByText('Mini')).toBeInTheDocument()

    expect(screen.getByText('Modèle')).toBeInTheDocument()
    expect(screen.getByText('Cooper S')).toBeInTheDocument()

    expect(screen.getByText('Année')).toBeInTheDocument()
    // Year now appears in both the sub line and the spec grid — assert at least one is present
    expect(screen.getAllByText(/2012/).length).toBeGreaterThan(0)

    expect(screen.getByText('Type moteur')).toBeInTheDocument()
    expect(screen.getAllByText(/1\.6L Turbo/i).length).toBeGreaterThan(0)

    expect(screen.getByText('Carburant')).toBeInTheDocument()
    expect(screen.getByText('Essence')).toBeInTheDocument()

    expect(screen.getByText('VIN')).toBeInTheDocument()
    expect(screen.getByText('12345678901234567')).toBeInTheDocument()

    expect(screen.getByText('Plaque')).toBeInTheDocument()
    expect(screen.getByText('AB-123-CD')).toBeInTheDocument()

    expect(screen.getByText(`Date d'achat`)).toBeInTheDocument()
    expect(screen.getByText('15/06/2020')).toBeInTheDocument()

    expect(screen.getByText('Kilométrage')).toBeInTheDocument()
    expect(screen.getByText('75000 km')).toBeInTheDocument()
  })

  it('should display mileage with km singular or plural suffix', () => {
    const actions = mock(() => {})
    const vehicleWith1Km: Vehicle = { ...mockVehicle, mileage: 1 }
    render(<VehicleProfile vehicle={vehicleWith1Km} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('Kilométrage')).toBeInTheDocument()
    expect(screen.getByText('1 km')).toBeInTheDocument()
  })

  it('should render "-" for nullable spec fields when null', () => {
    const vehicleWithNulls: Vehicle = {
      ...mockVehicle,
      engineType: null,
      fuelType: null,
      vin: null,
      licensePlate: null,
      purchaseDate: null
    }
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={vehicleWithNulls} onEdit={actions} onDelete={actions} />)

    const dashes = screen.getAllByText('-')
    expect(dashes).toHaveLength(5)
  })

  it('should render Modifier fiche and Supprimer buttons', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument()
  })

  it('should describe the destructive button with the irreversible warning', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByRole('button', { name: /supprimer/i })).toHaveAccessibleDescription(
      /irréversible/i
    )
  })

  it('should call onEdit when the Modifier fiche button is clicked', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /modifier/i }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('should call onDelete when the Supprimer button is clicked', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('should render data in a description list format', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    const descriptionList = screen.getByRole('list')
    expect(descriptionList).toBeInTheDocument()
  })
})

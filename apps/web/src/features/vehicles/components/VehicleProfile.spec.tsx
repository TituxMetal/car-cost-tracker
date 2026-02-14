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

  it('should render all vehicle fields with French labels', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('Marque')).toBeInTheDocument()
    expect(screen.getByText('Mini')).toBeInTheDocument()

    expect(screen.getByText('Modèle')).toBeInTheDocument()
    expect(screen.getByText('Cooper S')).toBeInTheDocument()

    expect(screen.getByText('Année')).toBeInTheDocument()
    expect(screen.getByText('2012')).toBeInTheDocument()

    expect(screen.getByText('Type de moteur')).toBeInTheDocument()
    expect(screen.getByText('1.6L Turbo')).toBeInTheDocument()

    expect(screen.getByText('Type de carburant')).toBeInTheDocument()
    expect(screen.getByText('Essence')).toBeInTheDocument()

    expect(screen.getByText('VIN')).toBeInTheDocument()
    expect(screen.getByText('12345678901234567')).toBeInTheDocument()

    expect(screen.getByText(`Plaque d'immatriculation`)).toBeInTheDocument()
    expect(screen.getByText('AB-123-CD')).toBeInTheDocument()

    expect(screen.getByText(`Date d'achat`)).toBeInTheDocument()
    expect(screen.getByText('15/06/2020')).toBeInTheDocument()

    expect(screen.getByText('Kilométrage')).toBeInTheDocument()
    expect(screen.getByText('75000 kms')).toBeInTheDocument()
  })

  it('should display fuel type as translated label', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('Type de carburant')).toBeInTheDocument()
    expect(screen.getByText('Essence')).toBeInTheDocument()
  })

  it('should display mileage with km singular or plural suffix', () => {
    const actions = mock(() => {})
    const vehicleWith1Km: Vehicle = { ...mockVehicle, mileage: 1 }
    render(<VehicleProfile vehicle={vehicleWith1Km} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('Kilométrage')).toBeInTheDocument()
    expect(screen.getByText('1 km')).toBeInTheDocument()
  })

  it('should render "-" for nullable fields when null', () => {
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

  it('should render Edit and Delete buttons', () => {
    const actions = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={actions} onDelete={actions} />)

    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument()
  })

  it('should call onEdit when Edit button is clicked', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<VehicleProfile vehicle={mockVehicle} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /modifier/i }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('should call onDelete when Delete button is clicked', () => {
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

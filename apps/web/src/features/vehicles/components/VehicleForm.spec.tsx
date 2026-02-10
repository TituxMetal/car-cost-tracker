import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { CreateVehicleSchema } from '../schemas'
import { createVehicleSchema } from '../schemas'

import { VehicleForm } from './VehicleForm'

// Wrapper that creates the form and passes it to VehicleForm — same pattern as EditProfileForm.spec.tsx
const TestWrapper = ({ showMileage }: { showMileage?: boolean }) => {
  const form = useForm<CreateVehicleSchema>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      engineType: undefined,
      fuelType: undefined,
      vin: undefined,
      licensePlate: undefined,
      purchaseDate: undefined,
      mileage: undefined
    }
  })

  return <VehicleForm form={form} showMileage={showMileage} />
}

const TestWrapperWithValues = () => {
  const form = useForm<CreateVehicleSchema>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      make: 'Mini',
      model: 'Cooper S',
      year: 2012,
      engineType: '1.6L Turbo',
      vin: '12345678901234567',
      licensePlate: 'AB-123-CD',
      mileage: 50000
    }
  })

  return <VehicleForm form={form} showMileage />
}

describe('VehicleForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render all 9 form fields with French labels when showMileage is true', () => {
    render(<TestWrapper showMileage />)

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

  it('should render 8 fields without Kilométrage when showMileage is false', () => {
    render(<TestWrapper showMileage={false} />)

    expect(screen.getByLabelText('Marque')).toBeInTheDocument()
    expect(screen.getByLabelText('Modèle')).toBeInTheDocument()
    expect(screen.getByLabelText('Année')).toBeInTheDocument()
    expect(screen.getByLabelText('Type de moteur')).toBeInTheDocument()
    expect(screen.getByLabelText('Carburant')).toBeInTheDocument()
    expect(screen.getByLabelText('VIN')).toBeInTheDocument()
    expect(screen.getByLabelText("Plaque d'immatriculation")).toBeInTheDocument()
    expect(screen.getByLabelText("Date d'achat")).toBeInTheDocument()
    expect(screen.queryByLabelText('Kilométrage')).not.toBeInTheDocument()
  })

  it('should render fields with correct input types', () => {
    render(<TestWrapper showMileage />)

    expect(screen.getByLabelText('Année')).toHaveAttribute('type', 'number')
    expect(screen.getByLabelText("Date d'achat")).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Kilométrage')).toHaveAttribute('type', 'number')
    expect(screen.getByLabelText('Marque')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Modèle')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Type de moteur')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('VIN')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText("Plaque d'immatriculation")).toHaveAttribute('type', 'text')
  })

  it('should pre-fill fields when form has defaultValues', () => {
    render(<TestWrapperWithValues />)

    expect(screen.getByDisplayValue('Mini')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cooper S')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2012')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1.6L Turbo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345678901234567')).toBeInTheDocument()
    expect(screen.getByDisplayValue('AB-123-CD')).toBeInTheDocument()
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument()
  })

  it('should render fuel type options from FUEL_TYPE_LABELS', () => {
    render(<TestWrapper />)

    expect(screen.getByText('Essence')).toBeInTheDocument()
    expect(screen.getByText('Diesel')).toBeInTheDocument()
    expect(screen.getByText('GPL')).toBeInTheDocument()
    expect(screen.getByText('Électrique')).toBeInTheDocument()
    expect(screen.getByText('Hybride')).toBeInTheDocument()
  })

  it('should register form fields with correct names', () => {
    render(<TestWrapper showMileage />)

    expect(screen.getByLabelText('Marque')).toHaveAttribute('name', 'make')
    expect(screen.getByLabelText('Modèle')).toHaveAttribute('name', 'model')
    expect(screen.getByLabelText('Année')).toHaveAttribute('name', 'year')
    expect(screen.getByLabelText('Type de moteur')).toHaveAttribute('name', 'engineType')
    expect(screen.getByLabelText('Carburant')).toHaveAttribute('name', 'fuelType')
    expect(screen.getByLabelText('VIN')).toHaveAttribute('name', 'vin')
    expect(screen.getByLabelText("Plaque d'immatriculation")).toHaveAttribute(
      'name',
      'licensePlate'
    )
    expect(screen.getByLabelText("Date d'achat")).toHaveAttribute('name', 'purchaseDate')
    expect(screen.getByLabelText('Kilométrage')).toHaveAttribute('name', 'mileage')
  })
})

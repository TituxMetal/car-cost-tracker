import type { UseFormReturn } from 'react-hook-form'

import { Input, Select } from '~/components/ui'

import type { CreateVehicleSchema } from '../schemas'
import { FUEL_TYPE_LABELS } from '../types'

const fuelTypeOptions = Object.entries(FUEL_TYPE_LABELS).map(([value, label]) => ({ value, label }))

export interface VehicleFormProps {
  form: UseFormReturn<CreateVehicleSchema>
  showMileage?: boolean
}

export const VehicleForm = ({ form, showMileage = true }: VehicleFormProps) => (
  <>
    <Input label='Marque' {...form.register('make')} error={form.formState.errors.make?.message} />
    <Input
      label='Modèle'
      {...form.register('model')}
      error={form.formState.errors.model?.message}
    />
    <Input
      label='Année'
      type='number'
      {...form.register('year', { valueAsNumber: true })}
      error={form.formState.errors.year?.message}
    />
    <Input
      label='Type de moteur'
      {...form.register('engineType')}
      error={form.formState.errors.engineType?.message}
    />
    <Select
      label='Carburant'
      options={fuelTypeOptions}
      placeholder='Sélectionner'
      {...form.register('fuelType')}
      error={form.formState.errors.fuelType?.message}
    />
    <Input label='VIN' {...form.register('vin')} error={form.formState.errors.vin?.message} />
    <Input
      label="Plaque d'immatriculation"
      {...form.register('licensePlate')}
      error={form.formState.errors.licensePlate?.message}
    />
    <Input
      label="Date d'achat"
      type='date'
      {...form.register('purchaseDate')}
      error={form.formState.errors.purchaseDate?.message}
    />
    {showMileage && (
      <Input
        label='Kilométrage'
        type='number'
        {...form.register('mileage', { valueAsNumber: true })}
        error={form.formState.errors.mileage?.message}
      />
    )}
  </>
)

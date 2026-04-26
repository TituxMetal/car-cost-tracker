import type { UseFormReturn } from 'react-hook-form'

import { Input, Select } from '~/components/ui'

import type { CreateVehicleSchema } from '../schemas'
import { FUEL_TYPE_LABELS } from '../types'

const fuelTypeOptions = Object.entries(FUEL_TYPE_LABELS).map(([value, label]) => ({ value, label }))

const legendClasses =
  'text-base-content/60 col-span-full mb-3 font-mono text-xs tracking-widest uppercase'

export interface VehicleFormProps {
  form: UseFormReturn<CreateVehicleSchema>
  showMileage?: boolean
}

export const VehicleForm = ({ form, showMileage = true }: VehicleFormProps) => (
  <>
    <fieldset className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <legend className={legendClasses}>Identité du véhicule</legend>
      <Input
        label='Marque'
        required
        {...form.register('make')}
        error={form.formState.errors.make?.message}
      />
      <Input
        label='Modèle'
        required
        {...form.register('model')}
        error={form.formState.errors.model?.message}
      />
    </fieldset>

    <fieldset className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <legend className={legendClasses}>Caractéristiques techniques</legend>
      <Input
        label='Année'
        type='number'
        required
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
    </fieldset>

    <Input label='VIN' {...form.register('vin')} error={form.formState.errors.vin?.message} />

    <fieldset className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <legend className={legendClasses}>Informations administratives</legend>
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
    </fieldset>

    {showMileage && (
      <fieldset>
        <legend className={legendClasses}>Usage</legend>
        <Input
          className='font-mono text-lg'
          label='Kilométrage'
          type='number'
          {...form.register('mileage', { valueAsNumber: true })}
          error={form.formState.errors.mileage?.message}
        />
      </fieldset>
    )}
  </>
)

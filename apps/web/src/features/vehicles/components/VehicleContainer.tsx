import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper } from '~/components/ui'

import { useVehicle } from '../hooks'
import type { CreateVehicleSchema, UpdateMileageSchema } from '../schemas'
import { createVehicleSchema } from '../schemas'

import { DeleteVehicleDialog } from './DeleteVehicleDialog'
import { QuickMileageUpdate } from './QuickMileageUpdate'
import { VehicleEmptyState } from './VehicleEmptyState'
import { VehicleForm } from './VehicleForm'
import { VehicleProfile } from './VehicleProfile'

export const VehicleContainer = () => {
  const {
    isLoading,
    hasVehicle,
    vehicle,
    fetchVehicle,
    createVehicle,
    updateMileage,
    updateVehicle,
    deleteVehicle
  } = useVehicle()
  const [mode, setMode] = useState<'loading' | 'empty' | 'create' | 'view' | 'edit'>('loading')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<CreateVehicleSchema>({
    defaultValues: {},
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(createVehicleSchema)
  })

  const handleSubmit = form.handleSubmit(async values => {
    setServerError(null)

    try {
      if (mode === 'edit' && vehicle) {
        await updateVehicle(vehicle.id, values)
      }

      if (mode === 'create') {
        await createVehicle(values)
      }

      setMode('view')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  })

  const onEdit = () => {
    form.reset({
      make: vehicle?.make,
      model: vehicle?.model,
      year: vehicle?.year,
      engineType: vehicle?.engineType ?? undefined,
      fuelType: vehicle?.fuelType ?? undefined,
      vin: vehicle?.vin ?? undefined,
      licensePlate: vehicle?.licensePlate ?? undefined,
      purchaseDate: vehicle?.purchaseDate ? vehicle.purchaseDate.slice(0, 10) : undefined
    })
    setMode('edit')
  }

  const onDelete = async () => {
    try {
      await deleteVehicle(vehicle!.id)
      setShowDeleteDialog(false)
      setMode('empty')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  const onCancel = () => {
    setServerError(null)
    form.reset()
    setMode(hasVehicle ? 'view' : 'empty')
  }

  useEffect(() => {
    fetchVehicle()
  }, [])

  const handleQuickMileageSubmit = async (mileage: UpdateMileageSchema) => {
    await updateMileage(vehicle!.id, mileage)
    await fetchVehicle()
  }

  useEffect(() => {
    if (!isLoading) {
      setMode(hasVehicle ? 'view' : 'empty')
    }
  }, [isLoading, hasVehicle])

  if (mode === 'loading') {
    return <p>Chargement...</p>
  }

  if (mode === 'empty') {
    return <VehicleEmptyState onCreateClick={() => setMode('create')} />
  }

  if (mode === 'create') {
    return (
      <>
        <h1 className='mb-8 text-center text-4xl font-bold text-zinc-100'>Ajouter mon véhicule</h1>
        <FormWrapper
          onSubmit={handleSubmit}
          error={serverError}
          className='mx-auto mt-6 grid w-full max-w-lg gap-4'
        >
          <VehicleForm form={form} showMileage={true} />
          <section className='flex items-center justify-between'>
            <Button type='button' variant='destructive' onClick={onCancel}>
              Annuler
            </Button>
            <Button type='submit'>Enregistrer</Button>
          </section>
        </FormWrapper>
      </>
    )
  }

  if (mode === 'view' && vehicle) {
    return (
      <>
        <h1 className='mb-8 text-center text-4xl font-bold text-zinc-100'>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </h1>
        <VehicleProfile
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={() => setShowDeleteDialog(true)}
        />
        <QuickMileageUpdate currentMileage={vehicle.mileage} onSubmit={handleQuickMileageSubmit} />
        {showDeleteDialog && (
          <DeleteVehicleDialog
            vehicleName={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
            onCancel={() => setShowDeleteDialog(false)}
            onConfirm={onDelete}
          />
        )}
      </>
    )
  }

  if (mode === 'edit' && vehicle) {
    return (
      <>
        <h1 className='mb-8 text-center text-4xl font-bold text-zinc-100'>
          Modifier {vehicle.make} {vehicle.model} ({vehicle.year})
        </h1>
        <FormWrapper
          onSubmit={handleSubmit}
          error={serverError}
          className='mx-auto mt-6 grid w-full max-w-lg gap-4'
        >
          <VehicleForm form={form} showMileage={false} />
          <section className='flex items-center justify-between'>
            <Button type='button' variant='destructive' onClick={onCancel}>
              Annuler
            </Button>
            <Button type='submit'>Enregistrer</Button>
          </section>
        </FormWrapper>
      </>
    )
  }
}

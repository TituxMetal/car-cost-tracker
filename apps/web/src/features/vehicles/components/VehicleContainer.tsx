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
    shouldUnregister: true,
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
  }, [fetchVehicle])

  const handleQuickMileageSubmit = async (mileage: UpdateMileageSchema) => {
    await updateMileage(vehicle!.id, mileage)
  }

  useEffect(() => {
    if (!isLoading) {
      setMode(hasVehicle ? 'view' : 'empty')
    }
  }, [isLoading, hasVehicle])

  if (mode === 'loading') {
    return <p className='text-base-content/70'>Chargement...</p>
  }

  if (mode === 'empty') {
    return <VehicleEmptyState onCreateClick={() => setMode('create')} />
  }

  if (mode === 'create') {
    return (
      <>
        <h1 className='text-base-content mb-8 text-center text-4xl font-bold'>
          Ajouter mon véhicule
        </h1>
        <article className='card bg-base-200 mx-auto max-w-2xl'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='card-body gap-4'>
            <VehicleForm form={form} showMileage={true} />
            <section className='card-actions justify-between'>
              <Button type='button' variant='destructive' onClick={onCancel}>
                Annuler
              </Button>
              <Button type='submit'>Enregistrer</Button>
            </section>
          </FormWrapper>
        </article>
      </>
    )
  }

  if (mode === 'view' && vehicle) {
    return (
      <>
        <h1 className='text-base-content mb-8 text-center text-4xl font-bold'>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </h1>
        <div className='mx-auto flex max-w-2xl flex-col gap-6'>
          <VehicleProfile
            vehicle={vehicle}
            onEdit={onEdit}
            onDelete={() => setShowDeleteDialog(true)}
          />
          <QuickMileageUpdate
            currentMileage={vehicle.mileage}
            onSubmit={handleQuickMileageSubmit}
          />
        </div>
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
        <h1 className='text-base-content mb-8 text-center text-4xl font-bold'>
          Modifier {vehicle.make} {vehicle.model} ({vehicle.year})
        </h1>
        <article className='card bg-base-200 mx-auto max-w-2xl'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='card-body gap-4'>
            <VehicleForm form={form} showMileage={false} />
            <section className='card-actions justify-between'>
              <Button type='button' variant='destructive' onClick={onCancel}>
                Annuler
              </Button>
              <Button type='submit'>Enregistrer</Button>
            </section>
          </FormWrapper>
        </article>
      </>
    )
  }
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper } from '~/components/ui'

import { useMileageHistory, useVehicle } from '../hooks'
import type { CreateVehicleSchema, UpdateMileageSchema } from '../schemas'
import { createVehicleSchema } from '../schemas'

import { DeleteVehicleDialog } from './DeleteVehicleDialog'
import { MileageHistoryCard } from './MileageHistoryCard'
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
  const { append: appendMileageEntry } = useMileageHistory(vehicle?.id)
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

  const handleQuickMileageSubmit = async (input: UpdateMileageSchema) => {
    if (!vehicle) return
    setServerError(null)
    const previousMileage = vehicle.mileage
    try {
      await updateMileage(vehicle.id, input)
      const delta = input.mileage - previousMileage
      if (delta > 0) {
        appendMileageEntry({
          recordedAt: new Date().toISOString(),
          mileage: input.mileage,
          delta
        })
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
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
        <header className='mb-8'>
          <p className='text-base-content/60 font-mono text-xs tracking-widest uppercase'>
            Créer votre fiche
          </p>
          <h1 className='font-display text-3xl md:text-4xl'>Ajouter mon véhicule</h1>
        </header>
        <article className='border-base-300 bg-base-200 border p-6'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='flex flex-col gap-4'>
            <VehicleForm form={form} showMileage={true} />
            <section className='flex flex-wrap justify-between gap-3'>
              <Button
                type='button'
                variant='destructive'
                className='btn-outline w-full md:w-auto'
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button type='submit' className='w-full md:w-auto'>
                Enregistrer
              </Button>
            </section>
          </FormWrapper>
        </article>
      </>
    )
  }

  if (mode === 'view' && vehicle) {
    return (
      <>
        {serverError && (
          <p
            className='border-error bg-error/10 text-error mb-4 border p-3 font-mono text-sm'
            role='alert'
          >
            {serverError}
          </p>
        )}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <VehicleProfile
              vehicle={vehicle}
              onEdit={onEdit}
              onDelete={() => setShowDeleteDialog(true)}
            />
          </div>
          <aside className='flex flex-col gap-6 lg:col-span-1'>
            <QuickMileageUpdate
              currentMileage={vehicle.mileage}
              onSubmit={handleQuickMileageSubmit}
            />
            <MileageHistoryCard vehicleId={vehicle.id} />
          </aside>
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
        <header className='mb-8'>
          <p className='text-base-content/60 font-mono text-xs tracking-widest uppercase'>
            Modifier fiche
          </p>
          <h1 className='font-display text-3xl md:text-4xl'>
            Modifier {vehicle.make} {vehicle.model} ({vehicle.year})
          </h1>
        </header>
        <article className='border-base-300 bg-base-200 border p-6'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='flex flex-col gap-4'>
            <VehicleForm form={form} showMileage={false} />
            <section className='flex flex-wrap justify-between gap-3'>
              <Button
                type='button'
                variant='destructive'
                className='btn-outline w-full md:w-auto'
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button type='submit' className='w-full md:w-auto'>
                Enregistrer
              </Button>
            </section>
          </FormWrapper>
        </article>
      </>
    )
  }
}

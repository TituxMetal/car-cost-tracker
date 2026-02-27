import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper } from '~/components/ui'
import { useVehicle } from '~/features/vehicles'
import { redirect } from '~/utils/navigation'

import { useCheckTypes } from '../hooks'
import type { CreateCheckTypeSchema } from '../schemas'
import { createCheckTypeSchema } from '../schemas'
import type { CheckType } from '../types'

import { CheckTypeForm } from './CheckTypeForm'
import { CheckTypeList } from './CheckTypeList'
import { DeleteCheckTypeDialog } from './DeleteCheckTypeDialog'

export const CheckTypeContainer = () => {
  const [mode, setMode] = useState<'loading' | 'list' | 'create' | 'edit'>('loading')
  const [serverError, setServerError] = useState<string | null>(null)
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false)
  const [editingCheckType, setEditingCheckType] = useState<CheckType | null>(null)
  const [deletingCheckType, setDeletingCheckType] = useState<CheckType | null>(null)
  const { vehicle, fetchVehicle, hasVehicle } = useVehicle()
  const {
    checkTypes,
    isLoading: isCheckTypesLoading,
    fetchByVehicle,
    create,
    remove,
    update
  } = useCheckTypes()

  const form = useForm<CreateCheckTypeSchema>({
    defaultValues: {},
    mode: 'onTouched',
    criteriaMode: 'all',
    shouldUnregister: true,
    resolver: zodResolver(createCheckTypeSchema)
  })

  useEffect(() => {
    const load = async () => {
      await fetchVehicle()
      setHasFetchedVehicle(true)
    }
    load()
  }, [fetchVehicle])

  useEffect(() => {
    if (hasVehicle && vehicle) {
      fetchByVehicle(vehicle.id)
    }
  }, [hasVehicle, vehicle, fetchByVehicle])

  useEffect(() => {
    if (mode !== 'loading') return
    if (!hasFetchedVehicle && !hasVehicle) return

    if (!hasVehicle) {
      redirect('/vehicle')
      return
    }

    if (vehicle && !isCheckTypesLoading) {
      setMode('list')
    }
  }, [mode, hasFetchedVehicle, hasVehicle, vehicle, isCheckTypesLoading])

  const handleSubmit = form.handleSubmit(async values => {
    setServerError(null)

    if (!vehicle) return

    try {
      if (mode === 'create') {
        await create(vehicle.id, values)
        form.reset({})
        await fetchByVehicle(vehicle.id)
        setMode('list')
      }

      if (mode === 'edit' && editingCheckType) {
        await update(vehicle.id, editingCheckType.id, values)
        setEditingCheckType(null)
        form.reset({})
        setMode('list')
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  })

  const handleDeleteConfirm = async () => {
    if (!vehicle || !deletingCheckType) return

    try {
      await remove(vehicle.id, deletingCheckType.id)
      setDeletingCheckType(null)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  const onCancel = () => {
    setServerError(null)
    setEditingCheckType(null)
    form.reset({})
    setMode('list')
  }

  const onEdit = (checkType: CheckType) => {
    form.reset({
      name: checkType.name,
      intervalDays: checkType.intervalDays,
      description: checkType.description ?? undefined
    })

    setEditingCheckType(checkType)
    setMode('edit')
  }
  const onDelete = (checkType: CheckType) => {
    setDeletingCheckType(checkType)
  }

  if (mode === 'loading') {
    return <p>Chargement...</p>
  }

  if (mode === 'create') {
    return (
      <>
        <h1 className='mb-8 text-center text-4xl font-bold text-zinc-100'>
          Ajouter un type de contrôle
        </h1>
        <FormWrapper
          onSubmit={handleSubmit}
          error={serverError}
          className='mx-auto mt-6 grid w-full max-w-lg gap-4'
        >
          <CheckTypeForm form={form} />
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

  if (mode === 'edit') {
    return (
      <>
        <h1 className='mb-8 text-center text-4xl font-bold text-zinc-100'>
          Modifier le type de contrôle
        </h1>
        <FormWrapper
          onSubmit={handleSubmit}
          error={serverError}
          className='mx-auto mt-6 grid w-full max-w-lg gap-4'
        >
          <CheckTypeForm form={form} />
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

  return (
    <section className='p-4'>
      <h1 className='mb-4 text-2xl font-bold text-zinc-100'>Types de contrôle</h1>
      <Button variant='default' className='mb-4' onClick={() => setMode('create')}>
        Ajouter un contrôle
      </Button>
      <CheckTypeList checkTypes={checkTypes} onEdit={onEdit} onDelete={onDelete} />
      {deletingCheckType && (
        <DeleteCheckTypeDialog
          checkTypeName={deletingCheckType.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCheckType(null)}
        />
      )}
    </section>
  )
}

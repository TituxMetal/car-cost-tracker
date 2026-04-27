import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper } from '~/components/ui'
import type { CheckStatusSummary } from '~/features/check-logs'
import { LogCheckDialog, useCheckLogs } from '~/features/check-logs'
import type { CreateCheckLogSchema } from '~/features/check-logs/schemas'
import { useVehicle } from '~/features/vehicles'
import { redirect } from '~/utils/navigation'

import { useCheckTypes } from '../hooks'
import type { CreateCheckTypeSchema } from '../schemas'
import { createCheckTypeSchema } from '../schemas'
import type { CheckType, SuggestedCheckType } from '../types'
import { SUGGESTED_CHECK_TYPES } from '../types'

import { CheckTypeForm } from './CheckTypeForm'
import { CheckTypeList } from './CheckTypeList'
import { DeleteCheckTypeDialog } from './DeleteCheckTypeDialog'
import { SuggestedCheckTypes } from './SuggestedCheckTypes'

export const CheckTypeContainer = () => {
  const [mode, setMode] = useState<'loading' | 'list' | 'create' | 'edit'>('loading')
  const [serverError, setServerError] = useState<string | null>(null)
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false)
  const [editingCheckType, setEditingCheckType] = useState<CheckType | null>(null)
  const [deletingCheckType, setDeletingCheckType] = useState<CheckType | null>(null)
  const [loggingCheckType, setLoggingCheckType] = useState<CheckType | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { vehicle, fetchVehicle, hasVehicle } = useVehicle()
  const {
    checkTypes,
    hasCheckTypes,
    isLoading: isCheckTypesLoading,
    fetchByVehicle,
    create,
    remove,
    update
  } = useCheckTypes()
  const { statuses, fetchStatuses, create: createLog } = useCheckLogs()

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
      fetchStatuses(vehicle.id)
    }
  }, [hasVehicle, vehicle, fetchByVehicle, fetchStatuses])

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

  useEffect(
    () => () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    },
    []
  )

  const handleSubmit = form.handleSubmit(async values => {
    setServerError(null)

    if (!vehicle) return

    try {
      if (mode === 'create') {
        await create(vehicle.id, values)
        form.reset({})
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

  const handleLogSubmit = async (data: CreateCheckLogSchema) => {
    if (!vehicle || !loggingCheckType) return

    setServerError(null)
    setSuccessMessage(null)

    try {
      await createLog(vehicle.id, loggingCheckType.id, data)
      setLoggingCheckType(null)
      setSuccessMessage('Contrôle enregistré avec succès')
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!vehicle || !deletingCheckType) return

    try {
      await remove(vehicle.id, deletingCheckType.id)
      setDeletingCheckType(null)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  const onAddSuggestion = async (suggestion: SuggestedCheckType) => {
    if (!vehicle) return

    try {
      await create(vehicle.id, {
        name: suggestion.name,
        description: suggestion.description ?? undefined,
        intervalDays: suggestion.intervalDays
      })
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

  if (mode === 'create' || mode === 'edit') {
    const kicker = mode === 'create' ? '// NOUVEAU TYPE' : '// MODIFICATION'
    const heading =
      mode === 'create' ? 'Ajouter un type de contrôle' : 'Modifier le type de contrôle'

    return (
      <section className='mx-auto w-full p-6 md:max-w-2xl'>
        <header className='mb-6'>
          <p className='font-display text-base-content/60 text-xs tracking-wider uppercase'>
            {kicker}
          </p>
          <h1 className='font-display mt-1 text-3xl font-bold tracking-wider md:text-4xl'>
            {heading}
          </h1>
        </header>
        <article className='border-base-300 bg-base-200 border p-6'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='flex flex-col gap-4'>
            <CheckTypeForm form={form} />
            <footer className='mt-2 flex flex-wrap justify-between gap-3'>
              <Button
                type='button'
                variant='destructive-outline'
                className='w-full md:w-auto'
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button type='submit' className='w-full md:w-auto'>
                Enregistrer
              </Button>
            </footer>
          </FormWrapper>
        </article>
      </section>
    )
  }

  const remainingSuggestions = SUGGESTED_CHECK_TYPES.filter(
    suggestion => !checkTypes.some(checkType => checkType.name === suggestion.name)
  )

  const summariesMap = new Map<string, CheckStatusSummary>(
    statuses.map(summary => [summary.checkTypeId, summary])
  )
  const loggingSummary = loggingCheckType ? summariesMap.get(loggingCheckType.id) : undefined

  if (mode === 'list') {
    return (
      <section className='mx-auto max-w-6xl p-6'>
        <header className='mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='font-display text-base-content/60 text-xs tracking-wider uppercase'>
              CONFIGURATION · TYPES DE CONTRÔLE
            </p>
            <h1 className='font-display mt-1 text-3xl font-bold tracking-wider md:text-4xl'>
              {checkTypes.length} contrôles programmés
            </h1>
          </div>
          <Button className='w-full md:w-auto' onClick={() => setMode('create')}>
            + Nouveau type
          </Button>
        </header>
        {serverError && (
          <div className='alert alert-error mb-6' role='alert'>
            {serverError}
          </div>
        )}
        {successMessage && (
          <div className='alert alert-success mb-6' role='status'>
            {successMessage}
          </div>
        )}
        {remainingSuggestions.length > 0 && (
          <SuggestedCheckTypes suggestions={remainingSuggestions} onAdd={onAddSuggestion} />
        )}
        {hasCheckTypes && (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            <CheckTypeList
              checkTypes={checkTypes}
              onEdit={onEdit}
              onDelete={onDelete}
              summaries={summariesMap}
              onLog={setLoggingCheckType}
            />
          </div>
        )}
        {!hasCheckTypes && (
          <section className='border-base-300 bg-base-200 border p-12 text-center'>
            <p className='font-display text-base-content/70 text-lg font-medium tracking-wide'>
              Aucun type de contrôle
            </p>
            <p className='text-base-content/60 mx-auto mt-2 max-w-sm font-mono text-xs'>
              Ajoutez votre premier contrôle ou utilisez les suggestions rapides ci-dessus
            </p>
          </section>
        )}
        {deletingCheckType && (
          <DeleteCheckTypeDialog
            checkTypeName={deletingCheckType.name}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingCheckType(null)}
          />
        )}
        {loggingCheckType && (
          <LogCheckDialog
            checkTypeName={loggingCheckType.name}
            checkType={loggingCheckType}
            status={loggingSummary?.status}
            onSubmit={handleLogSubmit}
            onCancel={() => setLoggingCheckType(null)}
          />
        )}
      </section>
    )
  }
}

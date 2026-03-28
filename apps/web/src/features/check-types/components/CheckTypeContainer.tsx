import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardPlus, ListChecks, PencilLine, PlusCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper } from '~/components/ui'
import type { CheckStatus } from '~/features/check-logs'
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

  if (mode === 'create') {
    return (
      <section className='mx-auto max-w-2xl p-6'>
        <h1 className='text-base-content mb-8 flex items-center justify-center gap-3 text-center text-4xl font-bold'>
          <PlusCircle size={32} className='text-primary' />
          Ajouter un type de contrôle
        </h1>
        <article className='card bg-base-200'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='card-body gap-4'>
            <CheckTypeForm form={form} />
            <footer className='card-actions mt-2 justify-between'>
              <Button type='button' variant='destructive' onClick={onCancel}>
                Annuler
              </Button>
              <Button type='submit'>Enregistrer</Button>
            </footer>
          </FormWrapper>
        </article>
      </section>
    )
  }

  if (mode === 'edit') {
    return (
      <section className='mx-auto max-w-2xl p-6'>
        <h1 className='text-base-content mb-8 flex items-center justify-center gap-3 text-center text-4xl font-bold'>
          <PencilLine size={32} className='text-primary' />
          Modifier le type de contrôle
        </h1>
        <article className='card bg-base-200'>
          <FormWrapper onSubmit={handleSubmit} error={serverError} className='card-body gap-4'>
            <CheckTypeForm form={form} />
            <footer className='card-actions mt-2 justify-between'>
              <Button type='button' variant='destructive' onClick={onCancel}>
                Annuler
              </Button>
              <Button type='submit'>Enregistrer</Button>
            </footer>
          </FormWrapper>
        </article>
      </section>
    )
  }

  const remainingSuggestions = SUGGESTED_CHECK_TYPES.filter(
    suggestion => !checkTypes.some(checkType => checkType.name === suggestion.name)
  )

  const statusesMap = new Map<string, CheckStatus>(
    statuses.map(statusMap => [statusMap.checkTypeId, statusMap.status])
  )

  if (mode === 'list') {
    return (
      <section className='mx-auto max-w-6xl p-6'>
        <header className='mb-6 flex items-center justify-between'>
          <h1 className='text-base-content flex items-center gap-2 text-2xl font-bold'>
            <ListChecks size={24} className='text-primary' />
            Types de contrôle
          </h1>
          <Button onClick={() => setMode('create')}>Ajouter un contrôle</Button>
        </header>
        {serverError && (
          <p className='alert alert-error mb-4' role='alert'>
            {serverError}
          </p>
        )}
        {successMessage && (
          <p className='alert alert-success mb-4' role='status'>
            {successMessage}
          </p>
        )}
        {remainingSuggestions.length > 0 && (
          <SuggestedCheckTypes suggestions={remainingSuggestions} onAdd={onAddSuggestion} />
        )}
        {remainingSuggestions.length > 0 && hasCheckTypes && <hr className='divider my-4' />}
        {hasCheckTypes && (
          <CheckTypeList
            checkTypes={checkTypes}
            onEdit={onEdit}
            onDelete={onDelete}
            statuses={statusesMap}
            onLog={setLoggingCheckType}
          />
        )}
        {!hasCheckTypes && (
          <section className='flex flex-col items-center gap-3 py-16 text-center'>
            <ClipboardPlus size={48} className='text-base-content/30' />
            <p className='text-base-content/70 text-lg font-medium'>Aucun type de contrôle</p>
            <p className='text-base-content/60 max-w-sm text-sm'>
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
            onSubmit={handleLogSubmit}
            onCancel={() => setLoggingCheckType(null)}
          />
        )}
      </section>
    )
  }
}

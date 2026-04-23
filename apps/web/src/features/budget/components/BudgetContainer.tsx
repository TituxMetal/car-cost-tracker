import { useEffect, useRef, useState } from 'react'

import { useExpenses } from '~/features/expenses'
import { useVehicle } from '~/features/vehicles'
import { redirect } from '~/utils/navigation'

import { useBudget } from '../hooks'
import type { UpsertBudgetParsed } from '../schemas'

import { BudgetEmptyState } from './BudgetEmptyState'
import { BudgetFormDialog } from './BudgetFormDialog'
import { BudgetHeader } from './BudgetHeader'
import { BudgetStatus } from './BudgetStatus'
import { DeleteBudgetDialog } from './DeleteBudgetDialog'

const SUCCESS_MESSAGE_DELAY_MS = 3000

export const BudgetContainer = () => {
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { vehicle, fetchVehicle, hasVehicle } = useVehicle()
  const { fetchExpenses } = useExpenses()
  const {
    budget,
    hasBudget,
    error,
    monthlyStatus,
    annualStatus,
    fetchBudget,
    upsertBudget,
    deleteBudget
  } = useBudget()

  useEffect(() => {
    const load = async () => {
      await fetchVehicle()
      setHasFetchedVehicle(true)
    }
    load()
  }, [fetchVehicle])

  useEffect(() => {
    if (!hasFetchedVehicle) return
    if (!hasVehicle) {
      redirect('/vehicle')
      return
    }
    if (!vehicle) return
    if (hasInitialized) return

    const load = async () => {
      await Promise.all([fetchExpenses(vehicle.id), fetchBudget(vehicle.id)])
      setHasInitialized(true)
    }
    load()
  }, [hasFetchedVehicle, hasVehicle, vehicle, fetchExpenses, fetchBudget, hasInitialized])

  useEffect(
    () => () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    },
    []
  )

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), SUCCESS_MESSAGE_DELAY_MS)
  }

  const handleCreate = async (data: UpsertBudgetParsed) => {
    if (!vehicle) return

    try {
      await upsertBudget(vehicle.id, { amountCents: data.amountInput, period: data.period })
      setIsCreateDialogOpen(false)
      showSuccess('Budget enregistré')
    } catch {
      // Error is surfaced by the store via $error — no local state needed.
    }
  }

  const handleUpdate = async (data: UpsertBudgetParsed) => {
    if (!vehicle) return

    try {
      await upsertBudget(vehicle.id, { amountCents: data.amountInput, period: data.period })
      setIsEditDialogOpen(false)
      showSuccess('Budget modifié')
    } catch {
      // Error is surfaced by the store via $error.
    }
  }

  const handleDeleteConfirm = async () => {
    if (!vehicle) return

    try {
      await deleteBudget(vehicle.id)
      setIsDeleteDialogOpen(false)
      showSuccess('Budget supprimé')
    } catch {
      // Error is surfaced by the store via $error.
    }
  }

  if (!hasFetchedVehicle) {
    return (
      <section className='mx-auto max-w-6xl p-6'>
        <h1 className='text-base-content text-2xl font-bold'>Mon budget</h1>
        <p className='mt-4'>Chargement...</p>
      </section>
    )
  }

  if (!hasVehicle || !vehicle) return null

  if (!hasInitialized) {
    return (
      <section className='mx-auto max-w-6xl p-6'>
        <h1 className='text-base-content text-2xl font-bold'>Mon budget</h1>
        <p className='mt-4'>Chargement...</p>
      </section>
    )
  }

  return (
    <section className='mx-auto flex max-w-6xl flex-col gap-6 p-6'>
      <BudgetHeader
        hasBudget={hasBudget}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      {error && (
        <p className='alert alert-error' role='alert'>
          {error}
        </p>
      )}
      {successMessage && (
        <p className='alert alert-success' role='status'>
          {successMessage}
        </p>
      )}
      {!hasBudget || !budget ? (
        <BudgetEmptyState onDefine={() => setIsCreateDialogOpen(true)} />
      ) : (
        <BudgetStatus budget={budget} monthlyStatus={monthlyStatus} annualStatus={annualStatus} />
      )}
      {isCreateDialogOpen && (
        <BudgetFormDialog
          mode='create'
          onSubmit={handleCreate}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      )}
      {isEditDialogOpen && budget && (
        <BudgetFormDialog
          mode='edit'
          budget={budget}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteBudgetDialog
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </section>
  )
}

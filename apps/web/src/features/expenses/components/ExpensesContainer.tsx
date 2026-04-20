import { useEffect, useRef, useState } from 'react'

import { useVehicle } from '~/features/vehicles'
import { redirect } from '~/utils/navigation'

import { useExpenses } from '../hooks'
import type { CreateExpenseSchema } from '../schemas'
import type { CreateExpenseInput, Expense, UpdateExpenseInput } from '../types'

import { DeleteExpenseDialog } from './DeleteExpenseDialog'
import { ExpenseFormDialog } from './ExpenseFormDialog'
import { ExpensesFilter } from './ExpensesFilter'
import { ExpensesHeader } from './ExpensesHeader'
import { ExpensesList } from './ExpensesList'

const SUCCESS_MESSAGE_DELAY_MS = 3000

export const ExpensesContainer = () => {
  const [mode, setMode] = useState<'loading' | 'list'>('loading')
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { vehicle, fetchVehicle, hasVehicle } = useVehicle()
  const {
    filteredExpenses,
    totalCents,
    totalsByCategory,
    categoryFilter,
    error,
    isLoading,
    fetchExpenses,
    create,
    update,
    remove,
    setCategoryFilter
  } = useExpenses()

  useEffect(() => {
    const load = async () => {
      await fetchVehicle()
      setHasFetchedVehicle(true)
    }
    load()
  }, [fetchVehicle])

  useEffect(() => {
    if (hasVehicle && vehicle) {
      fetchExpenses(vehicle.id)
    }
  }, [hasVehicle, vehicle, fetchExpenses])

  useEffect(() => {
    if (mode !== 'loading') return
    if (!hasFetchedVehicle && !hasVehicle) return

    if (!hasVehicle) {
      redirect('/vehicle')
      return
    }

    if (vehicle && !isLoading) setMode('list')
  }, [mode, hasFetchedVehicle, hasVehicle, vehicle, isLoading])

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

  const normalizeDescription = (raw: string | undefined) => {
    const trimmed = raw?.trim()
    return trimmed ? trimmed : undefined
  }

  const handleCreateSubmit = async (data: CreateExpenseSchema) => {
    if (!vehicle) return

    setServerError(null)

    const payload: CreateExpenseInput = {
      occurredAt: data.occurredAt,
      amountCents: data.amountInput,
      category: data.category,
      description: normalizeDescription(data.description)
    }

    try {
      await create(vehicle.id, payload)
      setIsCreateDialogOpen(false)
      showSuccess('Dépense enregistrée')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleEditSubmit = async (data: CreateExpenseSchema) => {
    if (!vehicle || !editingExpense) return

    setServerError(null)

    const payload: UpdateExpenseInput = {
      occurredAt: data.occurredAt,
      amountCents: data.amountInput,
      category: data.category,
      description: (data.description ?? '').trim()
    }

    try {
      await update(vehicle.id, editingExpense.id, payload)
      setEditingExpense(null)
      showSuccess('Dépense mise à jour')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!vehicle || !deletingExpense) return

    setServerError(null)

    try {
      await remove(vehicle.id, deletingExpense.id)
      setDeletingExpense(null)
      showSuccess('Dépense supprimée')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (mode === 'loading') return <p>Chargement...</p>

  return (
    <section className='mx-auto max-w-6xl p-6'>
      <ExpensesHeader
        totalCents={totalCents}
        totalsByCategory={totalsByCategory}
        onAddExpense={() => setIsCreateDialogOpen(true)}
      />
      {error && (
        <p className='alert alert-error mb-4' role='alert'>
          {error}
        </p>
      )}
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
      <div className='mb-4'>
        <ExpensesFilter value={categoryFilter} onChange={setCategoryFilter} />
      </div>
      <ExpensesList
        expenses={filteredExpenses}
        onEdit={setEditingExpense}
        onDelete={setDeletingExpense}
        emptyVariant={categoryFilter ? 'filtered' : 'default'}
      />
      {isCreateDialogOpen && (
        <ExpenseFormDialog
          mode='create'
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      )}
      {editingExpense && (
        <ExpenseFormDialog
          mode='edit'
          expense={editingExpense}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingExpense(null)}
        />
      )}
      {deletingExpense && (
        <DeleteExpenseDialog
          amountCents={deletingExpense.amountCents}
          occurredAt={deletingExpense.occurredAt}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </section>
  )
}

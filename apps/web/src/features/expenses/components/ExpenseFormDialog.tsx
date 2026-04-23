import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper } from '~/components/ui'
import { centsToInputEuros } from '~/shared/utils'

import type { CreateExpenseFormValues, CreateExpenseSchema } from '../schemas'
import { createExpenseSchema } from '../schemas'
import type { Expense } from '../types'
import { getTodayLocalISO } from '../utils/date.utils'

import { ExpenseForm } from './ExpenseForm'

export interface ExpenseFormDialogProps {
  mode: 'create' | 'edit'
  expense?: Expense
  onSubmit: (data: CreateExpenseSchema) => void
  onCancel: () => void
}

const buildDefaultValues = (expense?: Expense): CreateExpenseFormValues => {
  if (!expense) {
    return {
      occurredAt: getTodayLocalISO(),
      amountInput: '',
      category: '' as CreateExpenseFormValues['category'],
      description: undefined
    }
  }

  return {
    occurredAt: expense.occurredAt,
    amountInput: centsToInputEuros(expense.amountCents),
    category: expense.category,
    description: expense.description ?? undefined
  }
}

export const ExpenseFormDialog = ({
  mode,
  expense,
  onSubmit,
  onCancel
}: ExpenseFormDialogProps) => {
  const form = useForm<CreateExpenseFormValues, unknown, CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: buildDefaultValues(expense)
  })

  const title = mode === 'create' ? 'Ajouter une dépense' : 'Modifier la dépense'

  return (
    <DialogShell title={title} onClose={onCancel}>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <ExpenseForm form={form} />
        <div className='modal-action'>
          <Button variant='outline' type='button' onClick={onCancel}>
            Annuler
          </Button>
          <Button type='submit'>Enregistrer</Button>
        </div>
      </FormWrapper>
    </DialogShell>
  )
}

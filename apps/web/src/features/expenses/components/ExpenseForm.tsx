import type { UseFormReturn } from 'react-hook-form'

import { Input, Select, Textarea } from '~/components/ui'

import type { CreateExpenseFormValues, CreateExpenseSchema } from '../schemas'
import { CATEGORY_OPTIONS } from '../utils'

export interface ExpenseFormProps {
  form: UseFormReturn<CreateExpenseFormValues, unknown, CreateExpenseSchema>
}

export const ExpenseForm = ({ form }: ExpenseFormProps) => {
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Input
        type='date'
        label='Date'
        max={today}
        {...form.register('occurredAt')}
        error={form.formState.errors.occurredAt?.message}
      />
      <Input
        type='text'
        label='Montant (€)'
        placeholder='Ex: 89,50'
        {...form.register('amountInput')}
        error={form.formState.errors.amountInput?.message}
      />
      <Select
        label='Catégorie'
        placeholder='Sélectionner une catégorie'
        options={CATEGORY_OPTIONS}
        {...form.register('category')}
        error={form.formState.errors.category?.message}
      />
      <Textarea
        label='Description'
        placeholder='Ajouter une description (optionnel)'
        {...form.register('description')}
        error={form.formState.errors.description?.message}
      />
    </>
  )
}

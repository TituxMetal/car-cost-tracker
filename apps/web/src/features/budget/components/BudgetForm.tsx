import type { UseFormReturn } from 'react-hook-form'

import { Input, Select } from '~/components/ui'

import type { UpsertBudgetFormValues, UpsertBudgetParsed } from '../schemas'
import { PERIOD_OPTIONS } from '../utils'

export interface BudgetFormProps {
  form: UseFormReturn<UpsertBudgetFormValues, unknown, UpsertBudgetParsed>
}

export const BudgetForm = ({ form }: BudgetFormProps) => (
  <>
    <Input
      type='text'
      label='Montant (€)'
      placeholder='Ex: 250,00'
      {...form.register('amountInput')}
      error={form.formState.errors.amountInput?.message}
    />
    <Select
      label='Période'
      placeholder='Sélectionner une période'
      options={PERIOD_OPTIONS}
      {...form.register('period')}
      error={form.formState.errors.period?.message}
    />
  </>
)

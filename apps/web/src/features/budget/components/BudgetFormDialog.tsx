import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper } from '~/components/ui'
import { centsToInputEuros } from '~/shared/utils'

import type { UpsertBudgetFormValues, UpsertBudgetParsed } from '../schemas'
import { upsertBudgetSchema } from '../schemas'
import type { Budget } from '../types'

import { BudgetForm } from './BudgetForm'

export interface BudgetFormDialogProps {
  mode: 'create' | 'edit'
  budget?: Budget
  onSubmit: (data: UpsertBudgetParsed) => void
  onCancel: () => void
}

const buildDefaultValues = (budget?: Budget): UpsertBudgetFormValues => {
  if (!budget) {
    return {
      amountInput: '',
      period: '' as UpsertBudgetFormValues['period']
    }
  }

  return {
    amountInput: centsToInputEuros(budget.amountCents),
    period: budget.period
  }
}

export const BudgetFormDialog = ({ mode, budget, onSubmit, onCancel }: BudgetFormDialogProps) => {
  const form = useForm<UpsertBudgetFormValues, unknown, UpsertBudgetParsed>({
    resolver: zodResolver(upsertBudgetSchema),
    defaultValues: buildDefaultValues(budget)
  })

  const title = mode === 'create' ? 'Définir un budget' : 'Modifier le budget'
  const submitLabel = mode === 'create' ? 'Enregistrer' : 'Mettre à jour'

  return (
    <DialogShell title={title} onClose={onCancel}>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <BudgetForm form={form} />
        <div className='modal-action'>
          <Button variant='outline' type='button' onClick={onCancel}>
            Annuler
          </Button>
          <Button type='submit'>{submitLabel}</Button>
        </div>
      </FormWrapper>
    </DialogShell>
  )
}

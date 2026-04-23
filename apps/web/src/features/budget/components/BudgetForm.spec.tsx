import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { UpsertBudgetFormValues, UpsertBudgetParsed } from '../schemas'
import { upsertBudgetSchema } from '../schemas'

import { BudgetForm } from './BudgetForm'

const Harness = ({ defaultValues }: { defaultValues?: Partial<UpsertBudgetFormValues> }) => {
  const form = useForm<UpsertBudgetFormValues, unknown, UpsertBudgetParsed>({
    resolver: zodResolver(upsertBudgetSchema),
    defaultValues: {
      amountInput: defaultValues?.amountInput ?? '',
      period: defaultValues?.period ?? ('' as UpsertBudgetFormValues['period'])
    }
  })

  return <BudgetForm form={form} />
}

describe('BudgetForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the amount and period fields', () => {
    render(<Harness />)

    expect(screen.getByLabelText('Montant (€)')).toBeInTheDocument()
    expect(screen.getByLabelText('Période')).toBeInTheDocument()
  })

  it('lists "Mensuel" and "Annuel" as period options', () => {
    render(<Harness />)

    expect(screen.getByRole('option', { name: 'Mensuel' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Annuel' })).toBeInTheDocument()
  })

  it('pre-fills the form with initialValues', () => {
    render(<Harness defaultValues={{ amountInput: '250,00', period: 'ANNUAL' }} />)

    expect(screen.getByLabelText('Montant (€)')).toHaveValue('250,00')
    expect(screen.getByLabelText('Période')).toHaveValue('ANNUAL')
  })
})

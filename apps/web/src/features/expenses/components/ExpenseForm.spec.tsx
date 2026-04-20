import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { CreateExpenseFormValues, CreateExpenseSchema } from '../schemas'
import { createExpenseSchema } from '../schemas'

import { ExpenseForm } from './ExpenseForm'

const TestWrapper = () => {
  const form = useForm<CreateExpenseFormValues, unknown, CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      occurredAt: '',
      amountInput: '',
      category: undefined,
      description: undefined
    }
  })

  return <ExpenseForm form={form} />
}

const TestWrapperWithValues = () => {
  const form = useForm<CreateExpenseFormValues, unknown, CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      occurredAt: '2026-03-15',
      amountInput: '89,50',
      category: 'SERVICE',
      description: 'Vidange'
    }
  })

  return <ExpenseForm form={form} />
}

describe('ExpenseForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render all four fields with French labels', () => {
    render(<TestWrapper />)

    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Montant (€)')).toBeInTheDocument()
    expect(screen.getByText('Catégorie')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('should render occurredAt as a date input with max=today', () => {
    render(<TestWrapper />)
    const today = new Date().toISOString().split('T')[0]
    const dateInput = screen.getByLabelText('Date')

    expect(dateInput).toHaveAttribute('type', 'date')
    expect(dateInput).toHaveAttribute('max', today)
  })

  it('should render amountInput as a text input (not number — so comma decimal works)', () => {
    render(<TestWrapper />)
    const amountInput = screen.getByLabelText('Montant (€)')

    expect(amountInput).toHaveAttribute('type', 'text')
  })

  it('should render category as a select with the four category options', () => {
    render(<TestWrapper />)
    const options = ['Entretien', 'Pièces', "Main-d'œuvre", 'Autre']

    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument()
    })
  })

  it('should render description as a textarea', () => {
    render(<TestWrapper />)
    const descriptionTextarea = screen.getByLabelText('Description')

    expect(descriptionTextarea.tagName).toBe('TEXTAREA')
  })

  it('should pre-fill fields when form has defaultValues', () => {
    render(<TestWrapperWithValues />)

    expect(screen.getByLabelText('Date')).toHaveValue('2026-03-15')
    expect(screen.getByLabelText('Montant (€)')).toHaveValue('89,50')
    expect(screen.getByLabelText('Catégorie')).toHaveValue('SERVICE')
    expect(screen.getByLabelText('Description')).toHaveValue('Vidange')
  })

  it('should register form fields with the correct names', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText('Date')).toHaveAttribute('name', 'occurredAt')
    expect(screen.getByLabelText('Montant (€)')).toHaveAttribute('name', 'amountInput')
    expect(screen.getByLabelText('Catégorie')).toHaveAttribute('name', 'category')
    expect(screen.getByLabelText('Description')).toHaveAttribute('name', 'description')
  })
})

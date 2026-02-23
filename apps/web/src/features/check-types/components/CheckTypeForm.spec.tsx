import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { CreateCheckTypeSchema } from '../schemas'
import { createCheckTypeSchema } from '../schemas'

import { CheckTypeForm } from './CheckTypeForm'

const TestWrapper = () => {
  const form = useForm<CreateCheckTypeSchema>({
    resolver: zodResolver(createCheckTypeSchema),
    defaultValues: {
      name: '',
      intervalDays: undefined,
      description: undefined
    }
  })

  return <CheckTypeForm form={form} />
}

const TestWrapperWithValues = () => {
  const form = useForm<CreateCheckTypeSchema>({
    resolver: zodResolver(createCheckTypeSchema),
    defaultValues: {
      name: 'Vidange moteur',
      intervalDays: 365,
      description: 'Changement huile et filtre'
    }
  })

  return <CheckTypeForm form={form} />
}

describe('CheckTypeForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render all 3 form fields with French labels', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText('Nom')).toBeInTheDocument()
    expect(screen.getByLabelText('Intervalle (jours)')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('should render intervalDays as a number input', () => {
    render(<TestWrapper />)

    const intervalDaysInput = screen.getByLabelText('Intervalle (jours)')
    expect(intervalDaysInput).toBeInTheDocument()
    expect(intervalDaysInput).toHaveAttribute('type', 'number')
  })

  it('should render description as a textarea element', () => {
    render(<TestWrapper />)

    const descriptionTextarea = screen.getByLabelText('Description')
    expect(descriptionTextarea).toBeInTheDocument()
    expect(descriptionTextarea.tagName).toBe('TEXTAREA')
  })

  it('should pre-fill fields when form has defaultValues', () => {
    render(<TestWrapperWithValues />)

    expect(screen.getByLabelText('Nom')).toHaveValue('Vidange moteur')
    expect(screen.getByLabelText('Intervalle (jours)')).toHaveValue(365)
    expect(screen.getByLabelText('Description')).toHaveValue('Changement huile et filtre')
  })

  it('should register form fields with correct names', () => {
    render(<TestWrapper />)

    const nameInput = screen.getByLabelText('Nom')
    const intervalDaysInput = screen.getByLabelText('Intervalle (jours)')
    const descriptionTextarea = screen.getByLabelText('Description')

    expect(nameInput).toHaveAttribute('name', 'name')
    expect(intervalDaysInput).toHaveAttribute('name', 'intervalDays')
    expect(descriptionTextarea).toHaveAttribute('name', 'description')
  })
})

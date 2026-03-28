import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { CreateCheckLogSchema } from '../schemas'
import { createCheckLogSchema } from '../schemas'

import { LogCheckForm } from './LogCheckForm'

const TestWrapper = () => {
  const form = useForm<CreateCheckLogSchema>({
    resolver: zodResolver(createCheckLogSchema),
    defaultValues: {
      completedAt: '',
      notes: undefined
    }
  })

  return <LogCheckForm form={form} />
}

const TestWrapperWithValues = () => {
  const form = useForm<CreateCheckLogSchema>({
    resolver: zodResolver(createCheckLogSchema),
    defaultValues: {
      completedAt: '2026-03-15',
      notes: 'Tout est OK'
    }
  })

  return <LogCheckForm form={form} />
}

describe('LogCheckForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render date and notes fields with French labels', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText('Date du contrôle')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('should render completedAt as a date input', () => {
    render(<TestWrapper />)

    const dateInput = screen.getByLabelText('Date du contrôle')

    expect(dateInput).toBeInTheDocument()
    expect(dateInput).toHaveAttribute('type', 'date')
  })

  it('should set max attribute to today on the date input', () => {
    render(<TestWrapper />)

    const dateInput = screen.getByLabelText('Date du contrôle')
    const today = new Date().toISOString().split('T')[0]

    expect(dateInput).toHaveAttribute('max', today)
  })

  it('should render notes as a textarea element', () => {
    render(<TestWrapper />)

    const notesInput = screen.getByLabelText('Notes')

    expect(notesInput).toBeInTheDocument()
    expect(notesInput.tagName).toBe('TEXTAREA')
  })

  it('should pre-fill fields when form has defaultValues', () => {
    render(<TestWrapperWithValues />)

    const dateInput = screen.getByLabelText('Date du contrôle')
    const notesInput = screen.getByLabelText('Notes')

    expect(dateInput).toHaveValue('2026-03-15')
    expect(notesInput).toHaveValue('Tout est OK')
  })

  it('should register form fields with correct names', () => {
    render(<TestWrapper />)

    const dateInput = screen.getByLabelText('Date du contrôle')
    const notesInput = screen.getByLabelText('Notes')

    expect(dateInput).toHaveAttribute('name', 'completedAt')
    expect(notesInput).toHaveAttribute('name', 'notes')
  })
})

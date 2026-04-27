import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import type { CheckType } from '~/features/check-types/types'
import { cleanup, render, screen } from '~/test-utils'

import type { CreateCheckLogSchema } from '../schemas'
import { createCheckLogSchema } from '../schemas'

import { LogCheckForm } from './LogCheckForm'

const mockCheckType: CheckType = {
  id: 'ct-1',
  vehicleId: 'v-1',
  name: "Niveau d'huile moteur",
  description: null,
  intervalDays: 14,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
}

const TestWrapper = ({
  defaultValues,
  checkType,
  status
}: {
  defaultValues?: Partial<CreateCheckLogSchema>
  checkType?: CheckType
  status?: 'overdue' | 'due-soon' | 'on-time' | 'never'
}) => {
  const form = useForm<CreateCheckLogSchema>({
    resolver: zodResolver(createCheckLogSchema),
    defaultValues: {
      completedAt: '',
      notes: undefined,
      ...defaultValues
    }
  })

  return <LogCheckForm form={form} checkType={checkType} status={status} />
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
    render(<TestWrapper defaultValues={{ completedAt: '2026-03-15', notes: 'Tout est OK' }} />)

    expect(screen.getByLabelText('Date du contrôle')).toHaveValue('2026-03-15')
    expect(screen.getByLabelText('Notes')).toHaveValue('Tout est OK')
  })

  it('should register form fields with correct names', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText('Date du contrôle')).toHaveAttribute('name', 'completedAt')
    expect(screen.getByLabelText('Notes')).toHaveAttribute('name', 'notes')
  })

  it('should render the type panel with name and TOUS LES X JRS line when checkType provided', () => {
    render(<TestWrapper checkType={mockCheckType} status='overdue' />)

    expect(screen.getByLabelText('Type de contrôle')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: "Niveau d'huile moteur" })
    ).toBeInTheDocument()
    expect(screen.getByText('Tous les 14 jrs')).toBeInTheDocument()
    expect(screen.getByText('En retard')).toBeInTheDocument()
  })

  it('should compute and render PROCHAIN CONTRÔLE CALCULÉ from completedAt + intervalDays', () => {
    render(<TestWrapper checkType={mockCheckType} defaultValues={{ completedAt: '2026-03-15' }} />)

    expect(screen.getByText('Prochain contrôle calculé')).toBeInTheDocument()
    expect(screen.getByText(/29\.03\.2026/)).toBeInTheDocument()
    expect(screen.getByText(/\+14 jours/i)).toBeInTheDocument()
  })

  it('should NOT render PROCHAIN panel when no checkType provided', () => {
    render(<TestWrapper defaultValues={{ completedAt: '2026-03-15' }} />)

    expect(screen.queryByText('Prochain contrôle calculé')).toBeNull()
  })

  it('should NOT render PROCHAIN panel when completedAt is empty', () => {
    render(<TestWrapper checkType={mockCheckType} defaultValues={{ completedAt: '' }} />)

    expect(screen.queryByText('Prochain contrôle calculé')).toBeNull()
  })
})

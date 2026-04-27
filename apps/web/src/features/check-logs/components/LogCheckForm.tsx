import type { UseFormReturn } from 'react-hook-form'

import { Input, Textarea } from '~/components/ui'
import type { CheckType } from '~/features/check-types/types'

import type { CreateCheckLogSchema } from '../schemas'
import type { CheckStatus } from '../types'

import { CheckStatusBadge } from './CheckStatusBadge'

export interface LogCheckFormProps {
  form: UseFormReturn<CreateCheckLogSchema>
  checkType?: CheckType
  status?: CheckStatus
}

const formatPanelDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

const computeNextDue = (completedAt: string, intervalDays: number): string | null => {
  if (!completedAt) return null
  const date = new Date(completedAt)
  if (Number.isNaN(date.getTime())) return null
  date.setDate(date.getDate() + intervalDays)
  return date.toISOString().split('T')[0]
}

export const LogCheckForm = ({ form, checkType, status }: LogCheckFormProps) => {
  const completedAtValue = form.watch('completedAt') ?? ''
  const intervalDays = checkType?.intervalDays
  const nextDueIso =
    intervalDays && completedAtValue ? computeNextDue(completedAtValue, intervalDays) : null

  return (
    <>
      {checkType && (
        <article
          className='border-base-300 bg-base-100 border-l-primary border border-l-2 p-4'
          aria-label='Type de contrôle'
        >
          <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
            Type de contrôle
          </p>
          <header className='mt-2 flex flex-wrap items-center justify-between gap-2'>
            <h3 className='font-display text-base font-semibold tracking-wide'>{checkType.name}</h3>
            <div className='flex items-center gap-3'>
              {status && <CheckStatusBadge status={status} />}
              <span className='text-base-content/60 font-mono text-[10px] tracking-wider uppercase'>
                Tous les {checkType.intervalDays} jrs
              </span>
            </div>
          </header>
        </article>
      )}

      <Input
        type='date'
        label='Date du contrôle'
        className='font-mono text-lg'
        {...form.register('completedAt')}
        error={form.formState.errors.completedAt?.message}
        max={new Date().toISOString().split('T')[0]}
      />

      <Textarea
        label='Notes'
        {...form.register('notes')}
        error={form.formState.errors.notes?.message}
      />

      {nextDueIso && intervalDays && (
        <aside
          className='border-base-300 bg-success/10 border-l-success border border-l-2 p-4'
          aria-live='polite'
        >
          <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
            Prochain contrôle calculé
          </p>
          <p className='text-success mt-1 font-mono text-lg'>
            {formatPanelDate(nextDueIso)}{' '}
            <span className='text-base-content/60 ml-2 text-xs tracking-wider uppercase'>
              · +{intervalDays} jours
            </span>
          </p>
        </aside>
      )}
    </>
  )
}

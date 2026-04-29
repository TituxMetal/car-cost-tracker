import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper, Select } from '~/components/ui'
import type { CheckType } from '~/features/check-types/types'

import type { CreateCheckLogSchema } from '../schemas'
import { createCheckLogSchema } from '../schemas'
import type { CheckStatus } from '../types'

import { LogCheckForm } from './LogCheckForm'

export interface LogCheckDialogProps {
  onSubmit: (data: CreateCheckLogSchema, checkTypeId: string) => void
  onCancel: () => void
  checkTypeName?: string
  checkType?: CheckType
  status?: CheckStatus
  checkTypes?: CheckType[]
}

export const LogCheckDialog = ({
  checkTypeName,
  onSubmit,
  onCancel,
  checkType,
  status,
  checkTypes
}: LogCheckDialogProps) => {
  const [pickedCheckType, setPickedCheckType] = useState<CheckType | null>(null)
  const today = new Date().toISOString().split('T')[0]
  const form = useForm<CreateCheckLogSchema>({
    resolver: zodResolver(createCheckLogSchema),
    defaultValues: {
      completedAt: today,
      notes: ''
    }
  })

  const isPickerMode = !checkType && Array.isArray(checkTypes) && checkTypes.length > 0
  const activeCheckType = checkType ?? pickedCheckType
  const dialogTitle = activeCheckType
    ? 'Journaliser un contrôle'
    : checkTypeName
      ? `Journaliser un contrôle: ${checkTypeName}`
      : 'Journaliser un contrôle'

  const handleSubmit = (data: CreateCheckLogSchema) => {
    const id = activeCheckType?.id

    if (!id) return

    onSubmit(data, id)
  }

  return (
    <DialogShell title={dialogTitle} onClose={onCancel}>
      <p className='font-display text-base-content/60 -mt-2 mb-4 text-xs tracking-wider uppercase'>
        // Nouvelle entrée
      </p>
      <FormWrapper onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-4'>
        {isPickerMode && (
          <Select
            label='Type de contrôle'
            placeholder='— Sélectionner un type —'
            options={(checkTypes ?? []).map(type => ({ value: type.id, label: type.name }))}
            value={pickedCheckType?.id ?? ''}
            onChange={event => {
              const picked = checkTypes?.find(type => type.id === event.target.value) ?? null
              setPickedCheckType(picked)
            }}
          />
        )}
        {activeCheckType ? (
          <LogCheckForm form={form} checkType={activeCheckType} status={status} />
        ) : null}
        <footer className='modal-action mt-2 flex flex-wrap justify-between gap-3'>
          <Button
            variant='destructive-outline'
            type='button'
            className='w-full md:w-auto'
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type='submit' className='w-full md:ml-auto md:w-auto' disabled={!activeCheckType}>
            Enregistrer l&apos;entrée
          </Button>
        </footer>
      </FormWrapper>
    </DialogShell>
  )
}

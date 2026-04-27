import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper } from '~/components/ui'
import type { CheckType } from '~/features/check-types/types'

import type { CreateCheckLogSchema } from '../schemas'
import { createCheckLogSchema } from '../schemas'
import type { CheckStatus } from '../types'

import { LogCheckForm } from './LogCheckForm'

export interface LogCheckDialogProps {
  checkTypeName: string
  onSubmit: (data: CreateCheckLogSchema) => void
  onCancel: () => void
  checkType?: CheckType
  status?: CheckStatus
}

export const LogCheckDialog = ({
  checkTypeName,
  onSubmit,
  onCancel,
  checkType,
  status
}: LogCheckDialogProps) => {
  const today = new Date().toISOString().split('T')[0]
  const form = useForm<CreateCheckLogSchema>({
    resolver: zodResolver(createCheckLogSchema),
    defaultValues: {
      completedAt: today,
      notes: ''
    }
  })

  const dialogTitle = checkType
    ? 'Journaliser un contrôle'
    : `Journaliser un contrôle: ${checkTypeName}`

  return (
    <DialogShell title={dialogTitle} onClose={onCancel}>
      <p className='font-display text-base-content/60 -mt-2 mb-4 text-xs tracking-wider uppercase'>
        // Nouvelle entrée
      </p>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <LogCheckForm form={form} checkType={checkType} status={status} />
        <footer className='modal-action mt-2 flex flex-wrap justify-between gap-3'>
          <Button
            variant='destructive-outline'
            type='button'
            className='w-full md:w-auto'
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type='submit' className='w-full md:ml-auto md:w-auto'>
            Enregistrer l&apos;entrée
          </Button>
        </footer>
      </FormWrapper>
    </DialogShell>
  )
}

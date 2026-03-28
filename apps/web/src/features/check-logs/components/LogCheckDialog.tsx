import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper } from '~/components/ui'

import type { CreateCheckLogSchema } from '../schemas'
import { createCheckLogSchema } from '../schemas'

import { LogCheckForm } from './LogCheckForm'

export interface LogCheckDialogProps {
  checkTypeName: string
  onSubmit: (data: CreateCheckLogSchema) => void
  onCancel: () => void
}

export const LogCheckDialog = ({ checkTypeName, onSubmit, onCancel }: LogCheckDialogProps) => {
  const today = new Date().toISOString().split('T')[0]
  const form = useForm<CreateCheckLogSchema>({
    resolver: zodResolver(createCheckLogSchema),
    defaultValues: {
      completedAt: today,
      notes: ''
    }
  })

  return (
    <DialogShell title={`Enregistrer un contrôle: ${checkTypeName}`} onClose={onCancel}>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <LogCheckForm form={form} />
        <div className='modal-action'>
          <Button variant='outline' type='button' onClick={onCancel}>
            Annuler
          </Button>
          <Button type='submit'>Enregistrer</Button>
        </div>
      </FormWrapper>
    </DialogShell>
  )
}

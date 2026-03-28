import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper } from '~/components/ui'

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
    <Dialog.Root open={true} onOpenChange={onCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-neutral/50 fixed inset-0' onClick={onCancel} />
        <Dialog.Content
          className='modal modal-open'
          onInteractOutside={event => event.preventDefault()}
          aria-describedby={undefined}
        >
          <div className='modal-box'>
            <Dialog.Title className='mb-4 text-lg font-bold'>
              Enregistrer un contrôle: {checkTypeName}
            </Dialog.Title>
            <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
              <LogCheckForm form={form} />
              <div className='modal-action'>
                <Button variant='outline' type='button' onClick={onCancel}>
                  Annuler
                </Button>
                <Button type='submit'>Enregistrer</Button>
              </div>
            </FormWrapper>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

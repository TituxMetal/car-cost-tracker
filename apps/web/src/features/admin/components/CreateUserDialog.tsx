import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper } from '~/components/ui'

import type { CreateUserSchema } from '../schemas'
import { createUserSchema } from '../schemas'

import { CreateUserForm } from './CreateUserForm'

export interface CreateUserDialogProps {
  onCancel: () => void
  onSubmit: (values: CreateUserSchema) => Promise<void>
}

export const CreateUserDialog = ({ onCancel, onSubmit }: CreateUserDialogProps) => {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { username: '', email: '', password: '', firstName: '', lastName: '' },
    mode: 'onTouched'
  })

  const handleSubmit = form.handleSubmit(async values => {
    setServerError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to create user')
    }
  })

  return (
    <DialogShell title='Ajouter un user' onClose={onCancel}>
      <FormWrapper onSubmit={handleSubmit} error={serverError} className='grid gap-4'>
        <CreateUserForm form={form} />
        <div className='modal-action'>
          <Button
            variant='outline'
            type='button'
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            Annuler
          </Button>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </FormWrapper>
    </DialogShell>
  )
}

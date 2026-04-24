import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, DialogShell, FormWrapper } from '~/components/ui'

import type { ResetPasswordSchema } from '../schemas'
import { resetPasswordSchema } from '../schemas'

import { ResetPasswordForm } from './ResetPasswordForm'

export interface ResetPasswordDialogProps {
  username: string
  onCancel: () => void
  onSubmit: (values: ResetPasswordSchema) => Promise<void>
}

export const ResetPasswordDialog = ({ username, onCancel, onSubmit }: ResetPasswordDialogProps) => {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
    mode: 'onTouched'
  })

  const handleSubmit = form.handleSubmit(async values => {
    setServerError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to reset password')
    }
  })

  const description = `Définissez un nouveau password pour ${username}. Le password n'est envoyé à personne — transmettez-le vous-même au testeur.`

  return (
    <DialogShell title='Réinitialiser le password' description={description} onClose={onCancel}>
      <FormWrapper onSubmit={handleSubmit} error={serverError} className='grid gap-4'>
        <ResetPasswordForm form={form} />
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
            {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </FormWrapper>
    </DialogShell>
  )
}

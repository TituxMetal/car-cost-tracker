import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'
import { authClient } from '~/lib/authClient'

import type { ResetPasswordSchema } from '../schemas/auth.schema'
import { resetPasswordSchema } from '../schemas/auth.schema'

import { AuthHeader } from './AuthHeader'
import { AuthShell } from './AuthShell'
import { SystemStatusPanel } from './SystemStatusPanel'

interface ResetPasswordContainerProps {
  token: string | null
}

const submitButtonClasses =
  'h-auto min-h-0 w-full justify-center py-4 text-[13px] font-bold tracking-[0.2em]'
const switchLinkClasses =
  'text-base-content/60 block text-center font-mono text-[11px] tracking-wider'
const switchLinkAccentClasses = 'text-primary hover:underline'
const noticeBoxClasses =
  'grid gap-2 border px-4 py-4 font-mono text-xs leading-relaxed tracking-wide'
const noticeLabelClasses = 'font-mono text-[10px] tracking-[0.2em] uppercase'

const HEADING_ID = 'reset-heading'

export const ResetPasswordContainer = ({ token }: ResetPasswordContainerProps) => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ResetPasswordSchema>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(resetPasswordSchema)
  })

  const handleSubmit = form.handleSubmit(async data => {
    if (!token) return

    setStatus('idle')
    setErrorMessage(null)

    const { error } = await authClient.resetPassword({ token, newPassword: data.password })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message ?? 'Échec de la réinitialisation')
      return
    }

    setStatus('success')
  })

  if (!token) {
    return (
      <AuthShell headingId={HEADING_ID}>
        <AuthHeader
          kicker='// LIEN INVALIDE'
          heading='Réinitialisation impossible'
          headingId={HEADING_ID}
        />

        <div className={`${noticeBoxClasses} border-error/50 bg-error/10 text-error`} role='alert'>
          <p className={`text-error ${noticeLabelClasses}`}>JETON ABSENT</p>
          <p className='text-base-content/70'>
            Ce lien de réinitialisation est invalide ou a expiré. Demandez un nouveau lien pour
            recommencer.
          </p>
        </div>

        <p className={switchLinkClasses}>
          <a href='/auth/forgot-password' className={switchLinkAccentClasses}>
            Demander un nouveau lien
          </a>
        </p>

        <SystemStatusPanel />
      </AuthShell>
    )
  }

  return (
    <AuthShell headingId={HEADING_ID}>
      <AuthHeader
        kicker='// RÉINITIALISER'
        heading='Renouveler votre accès'
        headingId={HEADING_ID}
      />

      {status === 'success' ? (
        <div
          className={`${noticeBoxClasses} border-success/50 bg-success/10 text-success`}
          role='status'
        >
          <p className={`text-success ${noticeLabelClasses}`}>MOT DE PASSE MIS À JOUR</p>
          <p className='text-base-content/70'>
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez vous reconnecter.
          </p>
        </div>
      ) : (
        <FormWrapper onSubmit={handleSubmit} error={status === 'error' ? errorMessage : null}>
          <Input
            label='NOUVEAU MOT DE PASSE'
            type='password'
            autoComplete='new-password'
            error={form.formState.errors.password?.message}
            {...form.register('password')}
          />

          <Input
            label='CONFIRMATION'
            type='password'
            autoComplete='new-password'
            error={form.formState.errors.confirmPassword?.message}
            {...form.register('confirmPassword')}
          />

          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className={submitButtonClasses}
          >
            {form.formState.isSubmitting ? 'Réinitialisation…' : 'Réinitialiser →'}
          </Button>
        </FormWrapper>
      )}

      <p className={switchLinkClasses}>
        <a href='/auth?mode=login' className={switchLinkAccentClasses}>
          Retour à la connexion
        </a>
      </p>

      <SystemStatusPanel />
    </AuthShell>
  )
}

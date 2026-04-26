import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'
import { authClient } from '~/lib/authClient'

import type { ForgotPasswordSchema } from '../schemas/auth.schema'
import { forgotPasswordSchema } from '../schemas/auth.schema'

import { AuthHeader } from './AuthHeader'
import { AuthShell } from './AuthShell'
import { SystemStatusPanel } from './SystemStatusPanel'

const submitButtonClasses =
  'h-auto min-h-0 w-full justify-center py-4 text-[13px] font-bold tracking-[0.2em]'
const switchLinkClasses =
  'text-base-content/60 block text-center font-mono text-[11px] tracking-wider'
const switchLinkAccentClasses = 'text-primary hover:underline'
const successAlertClasses =
  'border-success/50 bg-success/10 grid gap-2 border px-4 py-4 font-mono text-xs leading-relaxed tracking-wide'
const successHeadingClasses = 'text-success font-mono text-[10px] tracking-[0.2em] uppercase'

const HEADING_ID = 'forgot-heading'

export const ForgotPasswordContainer = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ForgotPasswordSchema>({
    defaultValues: { email: '' },
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(forgotPasswordSchema)
  })

  const handleSubmit = form.handleSubmit(async data => {
    setStatus('idle')
    setErrorMessage(null)

    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: '/auth/reset-password'
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message ?? "Échec de l'envoi du lien")
      return
    }

    setStatus('success')
  })

  return (
    <AuthShell headingId={HEADING_ID}>
      <AuthHeader
        kicker='// MOT DE PASSE OUBLIÉ'
        heading='Récupération du compte'
        headingId={HEADING_ID}
      />

      {status === 'success' ? (
        <div className={successAlertClasses} role='status'>
          <p className={successHeadingClasses}>LIEN ENVOYÉ</p>
          <p className='text-base-content/70'>
            Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
            Vérifiez votre boîte de réception.
          </p>
        </div>
      ) : (
        <FormWrapper onSubmit={handleSubmit} error={status === 'error' ? errorMessage : null}>
          <Input
            label='E-MAIL'
            type='email'
            autoComplete='email'
            placeholder='vous@exemple.fr'
            error={form.formState.errors.email?.message}
            {...form.register('email')}
          />

          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className={submitButtonClasses}
          >
            {form.formState.isSubmitting ? 'Envoi…' : 'Envoyer le lien →'}
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

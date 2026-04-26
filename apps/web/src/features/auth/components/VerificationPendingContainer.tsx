import { useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'

import { AuthHeader } from './AuthHeader'
import { AuthShell } from './AuthShell'
import { SystemStatusPanel } from './SystemStatusPanel'

export interface VerificationPendingContainerProps {
  email: string | null
}

const noticeBoxClasses =
  'border px-4 py-4 font-mono text-xs leading-relaxed tracking-wide grid gap-2'
const noticeLabelClasses = 'font-mono text-[10px] tracking-[0.2em] uppercase'
const fullWidthButtonClasses =
  'h-auto min-h-0 w-full justify-center py-4 text-[13px] font-bold tracking-[0.2em]'

const HEADING_ID = 'pending-heading'

export const VerificationPendingContainer = ({ email }: VerificationPendingContainerProps) => {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email) return

    setIsResending(true)
    setResendStatus('idle')
    setErrorMessage(null)

    const { error } = await authClient.sendVerificationEmail({ email })

    setIsResending(false)

    if (error) {
      setResendStatus('error')
      setErrorMessage(error.message ?? "Échec de l'envoi du lien.")
      return
    }

    setResendStatus('success')
  }

  return (
    <AuthShell headingId={HEADING_ID}>
      <AuthHeader kicker='// EN ATTENTE' heading='Vérifiez votre email' headingId={HEADING_ID} />

      <div className={`${noticeBoxClasses} border-info/50 bg-info/10 text-info`} role='note'>
        <p className={`text-info ${noticeLabelClasses}`}>LIEN ENVOYÉ</p>
        <p className='text-base-content/70'>
          Un lien de vérification a été envoyé à{' '}
          <strong className='text-primary'>{email ?? 'votre email'}</strong>. Ouvrez votre boîte de
          réception et cliquez sur le lien pour valider votre compte.
        </p>
      </div>

      {resendStatus === 'success' && (
        <p
          role='status'
          className='border-success/50 bg-success/10 text-success border px-4 py-3 font-mono text-xs tracking-wide'
        >
          Lien renvoyé. Vérifiez votre boîte de réception.
        </p>
      )}

      {resendStatus === 'error' && errorMessage && (
        <p
          role='alert'
          className='border-error/50 bg-error/10 text-error border px-4 py-3 font-mono text-xs tracking-wide'
        >
          {errorMessage}
        </p>
      )}

      <div className='grid gap-3'>
        {email && (
          <Button
            type='button'
            onClick={handleResend}
            disabled={isResending}
            className={fullWidthButtonClasses}
          >
            {isResending ? 'Envoi…' : 'Renvoyer le lien →'}
          </Button>
        )}

        <Button as='a' href='/auth?mode=login' variant='ghost' className={fullWidthButtonClasses}>
          Retour à la connexion
        </Button>
      </div>

      <SystemStatusPanel />
    </AuthShell>
  )
}

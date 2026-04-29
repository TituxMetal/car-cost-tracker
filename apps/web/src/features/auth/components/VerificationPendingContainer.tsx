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
const ADMIN_EMAIL = 'pre-launch@lgdweb.fr'

const buildMailto = () => {
  const subject = 'Cost Log - Activation de compte'
  return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}`
}

export const VerificationPendingContainer = ({ email }: VerificationPendingContainerProps) => {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mailtoHref = buildMailto()

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
      <AuthHeader
        kicker='// ACCÈS RESTREINT'
        heading='Activation manuelle requise'
        headingId={HEADING_ID}
      />

      <div className={`${noticeBoxClasses} border-info bg-base-200`} role='note'>
        <p className={`text-info ${noticeLabelClasses}`}>ALPHA PRIVÉE</p>
        <p className='text-base-content'>
          Le compte <strong className='text-primary'>{email ?? 'votre email'}</strong> a bien été
          créé, mais Cost Log est en alpha privée — chaque inscription est validée à la main par
          l'administrateur.
        </p>
        <p className='text-base-content'>
          Contacte{' '}
          <a
            href={mailtoHref}
            className='text-primary underline underline-offset-2 hover:no-underline'
          >
            {ADMIN_EMAIL}
          </a>{' '}
          en précisant ton email d'inscription, je t'active dès que possible.
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
        <Button as='a' href={mailtoHref} className={fullWidthButtonClasses}>
          Écrire à l'admin →
        </Button>

        {email && (
          <Button
            type='button'
            onClick={handleResend}
            disabled={isResending}
            variant='ghost'
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

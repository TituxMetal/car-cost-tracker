import { useEffect, useState } from 'react'

import { authClient } from '~/lib/authClient'

import { AuthHeader } from './AuthHeader'
import { AuthShell } from './AuthShell'
import { SystemStatusPanel } from './SystemStatusPanel'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'no-token'

export interface VerifyEmailContainerProps {
  token: string | null
}

const switchLinkClasses =
  'text-base-content/60 block text-center font-mono text-[11px] tracking-wider'
const switchLinkAccentClasses = 'text-primary hover:underline'
const noticeBoxClasses =
  'grid gap-2 border px-4 py-4 font-mono text-xs leading-relaxed tracking-wide'
const noticeLabelClasses = 'font-mono text-[10px] tracking-[0.2em] uppercase'

const statusCopy = {
  verifying: { kicker: '// VÉRIFICATION', heading: 'Validation en cours' },
  success: { kicker: '// VÉRIFICATION', heading: 'Email vérifié' },
  error: { kicker: '// ÉCHEC', heading: 'Vérification impossible' },
  'no-token': { kicker: '// LIEN INVALIDE', heading: 'Lien introuvable' }
} as const

const HEADING_ID = 'verify-heading'

export const VerifyEmailContainer = ({ token }: VerifyEmailContainerProps) => {
  const [status, setStatus] = useState<VerificationStatus>(token ? 'verifying' : 'no-token')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const verifyEmail = async () => {
      const { error } = await authClient.verifyEmail({ query: { token } })

      if (error) {
        setStatus('error')
        setErrorMessage(error.message ?? 'La vérification a échoué. Le lien a peut-être expiré.')
        return
      }

      setStatus('success')
    }

    verifyEmail()
  }, [token])

  const copy = statusCopy[status]

  return (
    <AuthShell headingId={HEADING_ID}>
      <AuthHeader kicker={copy.kicker} heading={copy.heading} headingId={HEADING_ID} />

      {status === 'verifying' && (
        <p role='status' className='text-base-content/70 font-mono text-sm tracking-wide'>
          Validation du jeton en cours…
        </p>
      )}

      {status === 'success' && (
        <div
          className={`${noticeBoxClasses} border-success/50 bg-success/10 text-success`}
          role='status'
        >
          <p className={`text-success ${noticeLabelClasses}`}>EMAIL VÉRIFIÉ</p>
          <p className='text-base-content/70'>
            Votre email a été vérifié avec succès. Vous pouvez désormais vous connecter à votre
            dashboard.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className={`${noticeBoxClasses} border-error/50 bg-error/10 text-error`} role='alert'>
          <p className={`text-error ${noticeLabelClasses}`}>VÉRIFICATION ÉCHOUÉE</p>
          <p className='text-base-content/70'>{errorMessage}</p>
        </div>
      )}

      {status === 'no-token' && (
        <div
          className={`${noticeBoxClasses} border-warning/50 bg-warning/10 text-warning`}
          role='alert'
        >
          <p className={`text-warning ${noticeLabelClasses}`}>JETON ABSENT</p>
          <p className='text-base-content/70'>
            Ce lien de vérification est invalide. Vérifiez votre email pour récupérer le bon lien.
          </p>
        </div>
      )}

      <p className={switchLinkClasses}>
        {status === 'error' ? (
          <a href='/auth/verification-pending' className={switchLinkAccentClasses}>
            Demander un nouveau lien
          </a>
        ) : (
          <a href='/auth?mode=login' className={switchLinkAccentClasses}>
            Aller à la connexion
          </a>
        )}
      </p>

      <SystemStatusPanel />
    </AuthShell>
  )
}

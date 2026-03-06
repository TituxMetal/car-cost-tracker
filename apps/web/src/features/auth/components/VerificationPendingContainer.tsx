import { useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'

export interface VerificationPendingContainerProps {
  email: string | null
}

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
      setErrorMessage(error.message ?? 'Failed to resend verification email.')
      return
    }

    setResendStatus('success')
  }

  return (
    <section className='card bg-base-200 mx-auto max-w-md text-center'>
      <div className='card-body'>
        <h2 className='mb-4 text-2xl font-bold'>Check Your Email</h2>
        <p className='text-base-content/70 mb-6'>
          We sent a verification link to{' '}
          <strong className='text-primary'>{email ?? 'your email'}</strong>. Please check your inbox
          and click the link to verify your account.
        </p>

        {resendStatus === 'success' && (
          <p role='status' className='alert alert-success mb-4'>
            Verification email sent! Check your inbox.
          </p>
        )}

        {resendStatus === 'error' && (
          <p role='alert' className='alert alert-error mb-4'>
            {errorMessage}
          </p>
        )}

        <div className='flex flex-col gap-3'>
          {email && (
            <Button onClick={handleResend} disabled={isResending} variant='outline'>
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}

          <Button as='a' href='/auth?mode=login' variant='ghost'>
            Back to Login
          </Button>
        </div>
      </div>
    </section>
  )
}

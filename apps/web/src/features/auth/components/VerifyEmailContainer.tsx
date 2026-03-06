import { useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'no-token'

export interface VerifyEmailContainerProps {
  token: string | null
}

export const VerifyEmailContainer = ({ token }: VerifyEmailContainerProps) => {
  const [status, setStatus] = useState<VerificationStatus>(token ? 'verifying' : 'no-token')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const verifyEmail = async () => {
      const { error } = await authClient.verifyEmail({ query: { token } })

      if (error) {
        setStatus('error')
        setErrorMessage(error.message ?? 'Verification failed. The link may have expired.')
        return
      }

      setStatus('success')
    }

    verifyEmail()
  }, [token])

  if (status === 'verifying') {
    return (
      <div className='mx-auto max-w-md text-center'>
        <p className='text-base-content/70 text-lg'>Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <section className='card bg-base-200 mx-auto max-w-md text-center'>
        <div className='card-body'>
          <h2 className='text-success mb-4 text-2xl font-bold'>Email Verified!</h2>
          <p className='text-base-content/70 mb-6'>
            Your email has been successfully verified. You can now log in to your account.
          </p>
          <Button as='a' href='/auth?mode=login'>
            Go to Login
          </Button>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className='card bg-base-200 mx-auto max-w-md text-center'>
        <div className='card-body'>
          <h2 className='text-error mb-4 text-2xl font-bold'>Verification Failed</h2>
          <p className='text-base-content/70 mb-6'>{errorMessage}</p>
          <Button as='a' href='/auth/verification-pending'>
            Request New Link
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className='card bg-base-200 mx-auto max-w-md text-center'>
      <div className='card-body'>
        <h2 className='text-warning mb-4 text-2xl font-bold'>Invalid Link</h2>
        <p className='text-base-content/70 mb-6'>
          This verification link is invalid. Please check your email for the correct link.
        </p>
        <Button as='a' href='/auth?mode=login'>
          Go to Login
        </Button>
      </div>
    </section>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'
import { authClient } from '~/lib/authClient'

import type { ForgotPasswordSchema } from '../schemas/auth.schema'
import { forgotPasswordSchema } from '../schemas/auth.schema'

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
      setErrorMessage(error.message ?? 'Failed to send reset email')
      return
    }

    setStatus('success')
  })

  if (status === 'success') {
    return (
      <section className='card bg-base-200 mx-auto max-w-md text-center'>
        <div className='card-body'>
          <h2 className='mb-4 text-2xl font-bold'>Check Your Email</h2>
          <p className='text-base-content/70 mb-6'>
            If an account exists with that email, we've sent a password reset link.
          </p>
          <Button as='a' href='/auth?mode=login'>
            Back to Login
          </Button>
        </div>
      </section>
    )
  }

  return (
    <FormWrapper onSubmit={handleSubmit} error={errorMessage}>
      <Input
        {...form.register('email')}
        type='email'
        label='Email'
        placeholder='Enter your email'
        error={form.formState.errors.email?.message}
        autoComplete='email'
      />
      <div className='flex items-center justify-between'>
        <Button type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
        <a href='/auth?mode=login' className='link link-primary font-semibold'>
          Back to Login
        </a>
      </div>
    </FormWrapper>
  )
}

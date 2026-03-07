import type { FormEvent, ReactNode } from 'react'

export interface FormWrapperProps {
  children: ReactNode
  onSubmit: (e: FormEvent) => void
  error?: string | null
  isLoading?: boolean
  className?: string
}

export const FormWrapper = ({
  children,
  onSubmit,
  error,
  className = 'mx-auto mt-6 grid w-full max-w-md gap-4'
}: FormWrapperProps) => (
  <form onSubmit={onSubmit} className={className} role='form' noValidate>
    {error && (
      <p className='alert alert-error' role='alert'>
        {error}
      </p>
    )}

    {children}
  </form>
)

import type { ReactNode, SyntheticEvent } from 'react'

export interface FormWrapperProps {
  children: ReactNode
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
  error?: string | null
  isLoading?: boolean
  className?: string
}

const defaultFormClasses = 'grid w-full gap-5'
const errorClasses =
  'border-error/50 bg-error/10 text-error border px-4 py-3 font-mono text-xs tracking-wide'

export const FormWrapper = ({
  children,
  onSubmit,
  error,
  className = defaultFormClasses
}: FormWrapperProps) => (
  <form onSubmit={onSubmit} className={className} role='form' noValidate>
    {error && (
      <p className={errorClasses} role='alert'>
        {error}
      </p>
    )}

    {children}
  </form>
)

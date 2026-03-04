import type { InputHTMLAttributes } from 'react'
import React, { useId } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', fullWidth = false, id, type = 'text', ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || `input-${generatedId}`

    const baseInputClasses = 'input'
    const errorInputClasses = 'input-error'
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className='flex font-medium'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${widthClass} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className='label text-error'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

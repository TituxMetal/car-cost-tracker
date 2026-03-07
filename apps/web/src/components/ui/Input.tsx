import type { InputHTMLAttributes } from 'react'
import React, { useId } from 'react'

import { Label } from './Label'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className = '', fullWidth = true, id, type = 'text', required, ...props },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `input-${generatedId}`

    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass} min-w-0`}>
        {label && (
          <Label htmlFor={inputId} error={!!error} required={required}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input ${widthClass} ${error ? 'input-error text-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className='text-error text-sm'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

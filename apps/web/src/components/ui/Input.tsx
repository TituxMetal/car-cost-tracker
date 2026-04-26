import type { InputHTMLAttributes } from 'react'
import React, { useId } from 'react'

import { Label } from './Label'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const baseInputClasses =
  'bg-base-100 border-base-300 text-base-content border px-4 py-3.5 font-mono text-sm tracking-wide outline-none focus:border-primary focus-visible:border-primary'
const errorInputClasses = 'border-error focus:border-error focus-visible:border-error'
const errorTextClasses = 'text-error font-mono text-xs tracking-wide mt-1'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className = '', fullWidth = true, id, type = 'text', required, ...props },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `input-${generatedId}`

    const widthClass = fullWidth ? 'w-full' : ''
    const errorClass = error ? errorInputClasses : ''

    return (
      <div className={`${widthClass} grid gap-2`}>
        {label && (
          <Label htmlFor={inputId} error={!!error} required={required}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`${baseInputClasses} ${widthClass} ${errorClass} ${className}`.trim()}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className={errorTextClasses}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

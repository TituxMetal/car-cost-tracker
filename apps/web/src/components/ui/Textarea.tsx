import type { TextareaHTMLAttributes } from 'react'
import React, { useId } from 'react'

import { Label } from './Label'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  rows?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', fullWidth = true, id, rows = 3, required, ...rest }, ref) => {
    const generatedId = useId()
    const textareaId = id || `textarea-${generatedId}`
    const errorId = `${textareaId}-error`
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass} min-w-0`}>
        {label && (
          <Label htmlFor={textareaId} error={!!error} required={required}>
            {label}
          </Label>
        )}
        <textarea
          id={textareaId}
          className={`textarea ${widthClass} ${error ? 'textarea-error text-error' : ''} ${className}`}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          aria-describedby={error ? errorId : undefined}
          ref={ref}
          {...rest}
        />
        {error && (
          <p id={errorId} className='text-error text-sm'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

import type { TextareaHTMLAttributes } from 'react'
import React, { useId } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  rows?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', fullWidth = false, id, rows = 3, ...rest }, ref) => {
    const generatedId = useId()
    const textareaId = id || `textarea-${generatedId}`
    const errorId = `${textareaId}-error`
    const baseClasses = 'textarea'
    const errorClasses = 'textarea-error'
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label htmlFor={textareaId} className='flex font-medium'>
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={`${baseClasses} ${error ? errorClasses : ''} ${widthClass} ${className}`}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          ref={ref}
          {...rest}
        />
        {error && (
          <p id={errorId} className='label text-error'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

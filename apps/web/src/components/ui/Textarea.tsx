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
    const baseClasses = 'rounded-lg border-2 bg-zinc-900 px-3 py-2 text-zinc-300 focus:outline-none'
    const errorClasses = 'border-red-400 focus:border-red-400'
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label htmlFor={textareaId} className='flex font-medium text-zinc-300'>
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
          <p id={errorId} className='mt-2 font-semibold text-red-400'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

import type { TextareaHTMLAttributes } from 'react'
import React, { useId } from 'react'

import { Label } from './Label'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  rows?: number
}

const baseTextareaClasses =
  'bg-base-100 border-base-300 text-base-content border px-4 py-3.5 font-mono text-sm tracking-wide outline-none focus:border-primary focus-visible:border-primary'
const errorTextareaClasses = 'border-error focus:border-error focus-visible:border-error'
const errorTextClasses = 'text-error font-mono text-xs tracking-wide mt-1'

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', fullWidth = true, id, rows = 3, required, ...rest }, ref) => {
    const generatedId = useId()
    const textareaId = id || `textarea-${generatedId}`
    const errorId = `${textareaId}-error`
    const widthClass = fullWidth ? 'w-full' : ''
    const errorClass = error ? errorTextareaClasses : ''
    const combinedClasses = `${baseTextareaClasses} ${widthClass} ${errorClass} ${className}`.trim()

    return (
      <div className={`${widthClass} grid min-w-0 gap-2`}>
        {label && (
          <Label htmlFor={textareaId} error={!!error} required={required}>
            {label}
          </Label>
        )}
        <textarea
          id={textareaId}
          className={combinedClasses}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          aria-describedby={error ? errorId : undefined}
          ref={ref}
          {...rest}
        />
        {error && (
          <p id={errorId} className={errorTextClasses}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

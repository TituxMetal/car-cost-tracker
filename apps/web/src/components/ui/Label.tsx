import type { LabelHTMLAttributes } from 'react'
import React from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
  error?: boolean
}

const baseClasses = 'text-base-content/60 font-mono text-[10px] tracking-[0.18em] uppercase'

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className = '', required = false, error = false, ...props }, ref) => {
    const errorClass = error ? 'text-error' : ''
    const combinedClasses = `${baseClasses} ${errorClass} ${className}`.trim()

    return (
      <label ref={ref} className={combinedClasses} {...props}>
        {children}
        {required && (
          <span className='ml-1' aria-hidden='true'>
            *
          </span>
        )}
      </label>
    )
  }
)

Label.displayName = 'Label'

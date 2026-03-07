import type { LabelHTMLAttributes } from 'react'
import React from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
  error?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className = '', required = false, error = false, ...props }, ref) => {
    const baseClasses = `flex font-medium ${error ? 'text-error' : ''}`
    const combinedClasses = `${baseClasses} ${className}`

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

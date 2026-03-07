import type { SelectHTMLAttributes } from 'react'
import React, { useId } from 'react'

import { Label } from './Label'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      className = '',
      fullWidth = true,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || `select-${generatedId}`

    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass} min-w-0`}>
        {label && (
          <Label htmlFor={selectId} error={!!error} required={required}>
            {label}
          </Label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`select ${widthClass} ${error ? 'select-error text-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value='' disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className='text-error text-sm'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

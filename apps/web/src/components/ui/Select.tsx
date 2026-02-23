import type { SelectHTMLAttributes } from 'react'
import React, { useId } from 'react'

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
    { label, error, options, placeholder, className = '', fullWidth = false, id, ...props },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || `select-${generatedId}`

    const baseInputClasses = 'rounded-lg border-2 bg-zinc-900 px-3 py-2 text-zinc-300'
    const errorInputClasses = 'border-red-400 focus:border-red-400'
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label htmlFor={selectId} className='flex font-medium text-zinc-300'>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${widthClass} ${baseInputClasses} ${error ? errorInputClasses : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
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
          <p id={`${selectId}-error`} className='mt-2 font-semibold text-red-400'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

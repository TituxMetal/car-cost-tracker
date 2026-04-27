import { ChevronDown } from 'lucide-react'
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

const baseSelectClasses =
  'bg-base-100 border-base-300 text-base-content border px-4 py-3.5 pr-10 font-mono text-sm tracking-wide outline-none appearance-none focus:border-primary focus-visible:border-primary'
const errorSelectClasses = 'border-error focus:border-error focus-visible:border-error'
const errorTextClasses = 'text-error font-mono text-xs tracking-wide mt-1'

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
    const errorClass = error ? errorSelectClasses : ''
    const combinedClasses = `${baseSelectClasses} ${widthClass} ${errorClass} ${className}`.trim()

    return (
      <div className={`${widthClass} grid min-w-0 gap-2`}>
        {label && (
          <Label htmlFor={selectId} error={!!error} required={required}>
            {label}
          </Label>
        )}
        <div className='relative'>
          <select
            ref={ref}
            id={selectId}
            className={combinedClasses}
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
          <ChevronDown
            size={14}
            aria-hidden='true'
            className='text-base-content/60 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2'
          />
        </div>
        {error && (
          <p id={`${selectId}-error`} className={errorTextClasses}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

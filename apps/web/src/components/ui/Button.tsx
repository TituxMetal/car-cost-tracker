import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType } from 'react'
import React from 'react'

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive'

type ButtonBaseProps = {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
  disabled?: boolean
  as?: ElementType
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonAsAnchor = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>

export type ButtonProps = ButtonAsButton | (ButtonAsAnchor & { as: 'a' })

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', children, className = '', disabled, as, ...rest }, ref) => {
    const baseClasses = 'btn'
    const variantClasses = {
      default: 'btn-primary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      destructive: 'btn-error'
    }

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`
    const Component = as || 'button'

    return (
      <Component ref={ref} className={combinedClasses} disabled={disabled} {...rest}>
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'

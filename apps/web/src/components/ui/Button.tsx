import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType } from 'react'
import React from 'react'

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'destructive-outline'
  | 'warning'

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
    const baseClasses = 'btn font-display uppercase tracking-wider'
    const variantClasses = {
      default: 'btn-primary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      destructive: 'btn-error',
      'destructive-outline': 'btn-outline btn-error',
      warning: 'btn-warning'
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

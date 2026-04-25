import type { LucideIcon } from 'lucide-react'

export type TelltaleStatus = 'off' | 'info' | 'warning' | 'critical' | 'ok'

export interface TelltaleLightProps {
  icon: LucideIcon
  status: TelltaleStatus
  label: string
  description?: string
  size?: number
  className?: string
}

const STATUS_CLASSES: Record<TelltaleStatus, { text: string; glow: string }> = {
  off: { text: 'text-base-content/30', glow: '' },
  info: { text: 'text-info', glow: 'drop-shadow-[0_0_8px_var(--color-info)]' },
  ok: { text: 'text-success', glow: 'drop-shadow-[0_0_8px_var(--color-success)]' },
  warning: { text: 'text-warning', glow: 'drop-shadow-[0_0_10px_var(--color-warning)]' },
  critical: { text: 'text-error', glow: 'drop-shadow-[0_0_12px_var(--color-error)]' }
}

export const TelltaleLight = ({
  icon: Icon,
  status,
  label,
  description,
  size = 20,
  className = ''
}: TelltaleLightProps) => {
  const { text, glow } = STATUS_CLASSES[status]
  const isCritical = status === 'critical'
  const fullLabel = description ? `${label}, ${description}` : label

  return (
    <span
      role={isCritical ? 'alert' : 'status'}
      aria-live={isCritical ? 'assertive' : 'polite'}
      aria-atomic='true'
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Icon
        size={size}
        className={`${text} ${glow} shrink-0`}
        aria-hidden='true'
        focusable='false'
      />
      <span className='sr-only'>{fullLabel}</span>
    </span>
  )
}

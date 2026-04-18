import type { LucideIcon } from 'lucide-react'
import React from 'react'

export type TelltaleStatus = 'off' | 'info' | 'warning' | 'critical' | 'ok'

export interface TelltaleLightProps {
  /** Lucide icon to display. */
  icon: LucideIcon
  /** Status — drives color and glow. 'off' = dimmed (gray). */
  status: TelltaleStatus
  /** Required accessible label (e.g. "Frein à main serré"). */
  label: string
  /** Optional description read after the label (e.g. "État critique"). */
  description?: string
  /** Icon size in px. Default 20. */
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

/**
 * Dashboard-style telltale (warning light).
 *
 * Semantics: <span role="status"> with a full aria-label.
 * The critical status adds role="alert" + aria-live="assertive" so it is
 * announced as soon as it appears.
 *
 * Color is NEVER the sole carrier of information:
 *   - the label is always present (aria-label + .sr-only)
 *   - in critical mode, aria-live forces the announcement
 *   - the Lucide icon itself carries meaning (AlertTriangle, etc.)
 *
 * Note: runtime strings (label, description) remain in French because the
 * app UI is French — only the code-level comments are in English.
 *
 * Usage:
 *   <TelltaleLight icon={AlertTriangle} status="critical"
 *                  label="Contrôle technique expiré" description="En retard de 32 jours" />
 */
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

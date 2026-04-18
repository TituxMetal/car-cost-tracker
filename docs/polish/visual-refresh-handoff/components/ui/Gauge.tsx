import React from 'react'

export type GaugeStatus = 'on-time' | 'due-soon' | 'overdue' | 'never'

export interface GaugeProps {
  /** Current value (0 to max). */
  value: number
  /** Max value of the gauge. */
  max: number
  /** Short label shown under the gauge (e.g. "HUILE MOTEUR"). */
  label: string
  /** Full description read by screen readers (e.g. "Vidange, 85% du cycle"). */
  description?: string
  /** Alert status — drives color and ARIA. */
  status?: GaugeStatus
  /** Centered text (e.g. "85%", "3200 km"). */
  centerLabel?: React.ReactNode
  /** Diameter in px. Default 160. */
  size?: number
  /** Stroke width. Default 12. */
  strokeWidth?: number
  className?: string
}

const STATUS_STROKE: Record<GaugeStatus, string> = {
  'on-time': 'stroke-success',
  'due-soon': 'stroke-warning',
  overdue: 'stroke-error',
  never: 'stroke-info'
}

/**
 * Dashboard-style circular gauge.
 *
 * Semantics: <div role="meter"> with aria-valuenow/min/max + aria-label.
 * The SVG is aria-hidden — all info lives in ARIA attributes and in a
 * fallback <span className="sr-only">.
 *
 * Note: runtime strings (label, description) remain in French because the
 * app UI is French — only the code-level comments are in English.
 *
 * Usage:
 *   <Gauge value={85} max={100} label="HUILE MOTEUR" status="due-soon"
 *          centerLabel="85%" description="Vidange, 85% du cycle écoulé" />
 */
export const Gauge = ({
  value,
  max,
  label,
  description,
  status = 'on-time',
  centerLabel,
  size = 160,
  strokeWidth = 12,
  className = ''
}: GaugeProps) => {
  const clamped = Math.max(0, Math.min(value, max))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // 270° arc (3/4 circle, like a car gauge)
  const arcLength = circumference * 0.75
  const progress = (clamped / max) * arcLength
  const center = size / 2

  const a11yLabel = description ?? `${label}, ${clamped} sur ${max}`

  return (
    <div
      role='meter'
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={a11yLabel}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <div className='relative' style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden='true'
          className='-rotate-[135deg]'
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill='none'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            className='stroke-base-300'
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill='none'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            className={STATUS_STROKE[status]}
            strokeDasharray={`${progress} ${circumference}`}
            style={{ transition: 'stroke-dasharray 400ms ease-out' }}
          />
        </svg>
        {centerLabel !== undefined && (
          <div
            className='absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold'
            aria-hidden='true'
          >
            {centerLabel}
          </div>
        )}
      </div>
      <span className='text-base-content/70 text-xs font-medium tracking-wider uppercase'>
        {label}
      </span>
    </div>
  )
}

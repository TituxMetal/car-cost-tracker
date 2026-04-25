import type { ReactNode } from 'react'

export type GaugeStatus = 'on-time' | 'due-soon' | 'overdue' | 'never'

export interface GaugeProps {
  value: number
  max: number
  label: string
  description?: string
  status?: GaugeStatus
  centerLabel?: ReactNode
  size?: number
  strokeWidth?: number
  className?: string
}

const STATUS_STROKE: Record<GaugeStatus, string> = {
  'on-time': 'stroke-success',
  'due-soon': 'stroke-warning',
  overdue: 'stroke-error',
  never: 'stroke-info'
}

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
      <div className='relative inline-block'>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden='true'
          className='-rotate-135'
        >
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
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill='none'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            className={`${STATUS_STROKE[status]} gauge-progress`}
            strokeDasharray={`${progress} ${circumference}`}
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

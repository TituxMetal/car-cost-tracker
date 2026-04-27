import type { CheckStatus } from '../types'

export interface CheckStatusBadgeProps {
  status: CheckStatus
}

type StatusConfig = {
  className: string
  label: string
}

const baseClasses =
  'badge inline-flex shrink-0 items-center gap-1.5 font-mono tracking-wider whitespace-nowrap uppercase'

export const CheckStatusBadge = ({ status }: CheckStatusBadgeProps) => {
  const statusConfig: Record<CheckStatus, StatusConfig> = {
    'on-time': { className: 'badge-success', label: 'À jour' },
    'due-soon': { className: 'badge-warning', label: 'Bientôt' },
    overdue: { className: 'badge-error', label: 'En retard' },
    never: { className: 'badge-info', label: 'Jamais' }
  }

  return (
    <span className={`${baseClasses} ${statusConfig[status].className}`}>
      <span aria-hidden='true' className='inline-block h-2 w-2 rounded-full bg-current' />
      {statusConfig[status].label}
    </span>
  )
}

import type { CheckStatus } from '../types'

export interface CheckStatusBadgeProps {
  status: CheckStatus
}

type StatusConfig = {
  className: string
  label: string
}

export const CheckStatusBadge = ({ status }: CheckStatusBadgeProps) => {
  const statusConfig: Record<CheckStatus, StatusConfig> = {
    'on-time': { className: 'badge-success', label: 'À jour' },
    'due-soon': { className: 'badge-warning', label: 'Bientôt' },
    overdue: { className: 'badge-error', label: 'En retard' },
    never: { className: 'badge-neutral', label: 'Jamais effectué' }
  }

  return (
    <span className={`badge ${statusConfig[status].className}`}>{statusConfig[status].label}</span>
  )
}

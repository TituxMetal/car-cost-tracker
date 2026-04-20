import { ConfirmDialog } from '~/components/ui'

import { formatEuros } from '../utils/amount.utils'

export interface DeleteExpenseDialogProps {
  amountCents: number
  occurredAt: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteExpenseDialog = ({
  amountCents,
  occurredAt,
  onConfirm,
  onCancel
}: DeleteExpenseDialogProps) => (
  <ConfirmDialog
    title='Supprimer la dépense'
    message={`Êtes-vous sûr de vouloir supprimer la dépense de ${formatEuros(amountCents)} du ${occurredAt} ? Cette action est irréversible.`}
    confirmLabel='Supprimer'
    cancelLabel='Annuler'
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
)

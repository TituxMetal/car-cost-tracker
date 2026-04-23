import { ConfirmDialog } from '~/components/ui'

export interface DeleteBudgetDialogProps {
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteBudgetDialog = ({ onConfirm, onCancel }: DeleteBudgetDialogProps) => (
  <ConfirmDialog
    title='Supprimer le budget'
    message='Supprimer votre budget ? Vous pourrez en définir un nouveau à tout moment.'
    confirmLabel='Supprimer'
    cancelLabel='Annuler'
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
)

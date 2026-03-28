import { ConfirmDialog } from '~/components/ui'

export interface DeleteCheckLogDialogProps {
  checkTypeName: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteCheckLogDialog = ({
  checkTypeName,
  onConfirm,
  onCancel
}: DeleteCheckLogDialogProps) => (
  <ConfirmDialog
    title='Supprimer le contrôle'
    message={`Êtes-vous sûr de vouloir supprimer ce contrôle de "${checkTypeName}" ? Cette action est irréversible.`}
    confirmLabel='Supprimer'
    cancelLabel='Annuler'
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
)

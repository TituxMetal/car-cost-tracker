import { ConfirmDialog } from '~/components/ui'

export interface DeleteCheckTypeDialogProps {
  checkTypeName: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteCheckTypeDialog = ({
  checkTypeName,
  onConfirm,
  onCancel
}: DeleteCheckTypeDialogProps) => (
  <ConfirmDialog
    title={`Supprimer le type de contrôle`}
    message={`Êtes-vous sûr de vouloir supprimer le type de contrôle "${checkTypeName}" ? Cette action est irréversible.`}
    confirmLabel='Supprimer'
    cancelLabel='Annuler'
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
)

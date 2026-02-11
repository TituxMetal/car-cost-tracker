import { ConfirmDialog } from '~/components/ui'

export interface DeleteVehicleDialogProps {
  vehicleName: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteVehicleDialog = ({
  vehicleName,
  onConfirm,
  onCancel
}: DeleteVehicleDialogProps) => (
  <ConfirmDialog
    title='Supprimer le véhicule'
    message={`Êtes-vous sûr de vouloir supprimer le véhicule "${vehicleName}" ? Cette action est irréversible.`}
    confirmLabel='Supprimer'
    cancelLabel='Annuler'
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
)

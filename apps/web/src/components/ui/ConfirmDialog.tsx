import { Button } from './Button'
import { DialogShell } from './DialogShell'

export interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel
}: ConfirmDialogProps) => (
  <DialogShell title={title} onClose={onCancel} description={message}>
    <div className='modal-action'>
      <Button variant='outline' onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant='destructive' onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </DialogShell>
)

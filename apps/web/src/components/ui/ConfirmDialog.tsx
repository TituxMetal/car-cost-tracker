import { useEffect, useId } from 'react'

import { Button } from './Button'

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
}: ConfirmDialogProps) => {
  const dialogId = useId()
  const titleId = `${dialogId}-title`
  const descriptionId = `${dialogId}-description`

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel])

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70'
      onClick={onCancel}
    >
      <section
        className='max-w-md rounded-lg bg-zinc-800 p-6'
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        role='dialog'
        aria-modal='true'
        onClick={event => event.stopPropagation()}
      >
        <h2 id={titleId} className='text-lg font-semibold'>
          {title}
        </h2>
        <p id={descriptionId} className='mt-2 text-zinc-400'>
          {message}
        </p>
        <div className='mt-6 flex justify-end gap-2'>
          <Button onClick={onCancel} variant='outline'>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} variant='destructive'>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  )
}

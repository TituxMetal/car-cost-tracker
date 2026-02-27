import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { DeleteCheckTypeDialog } from './DeleteCheckTypeDialog'

describe('DeleteCheckTypeDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the delete title', () => {
    render(
      <DeleteCheckTypeDialog
        checkTypeName='Vérification des freins'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Supprimer')).toBeInTheDocument()
  })

  it('should include the check type name in the warning message', () => {
    const checkTypeName = 'Vérification des freins'
    render(
      <DeleteCheckTypeDialog
        checkTypeName={checkTypeName}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(
      screen.getByText(
        `Êtes-vous sûr de vouloir supprimer le type de contrôle "${checkTypeName}" ? Cette action est irréversible.`
      )
    ).toBeInTheDocument()
  })

  it('should render Supprimer and Annuler buttons', () => {
    render(
      <DeleteCheckTypeDialog
        checkTypeName='Vérification des freins'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeVisible()
  })

  it('should call onConfirm when Supprimer is clicked', () => {
    const onConfirm = mock(() => {})
    render(
      <DeleteCheckTypeDialog
        checkTypeName='Vérification des freins'
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    const deleteButton = screen.getByRole('button', { name: 'Supprimer' })
    deleteButton.click()

    expect(onConfirm).toHaveBeenCalled()
  })

  it('should call onCancel when Annuler is clicked', () => {
    const onCancel = mock(() => {})
    render(
      <DeleteCheckTypeDialog
        checkTypeName='Vérification des freins'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: 'Annuler' })
    cancelButton.click()

    expect(onCancel).toHaveBeenCalled()
  })
})

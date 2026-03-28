import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { DeleteCheckLogDialog } from './DeleteCheckLogDialog'

describe('DeleteCheckLogDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the delete title', () => {
    render(
      <DeleteCheckLogDialog checkTypeName='Vidange' onConfirm={() => {}} onCancel={() => {}} />
    )

    expect(screen.getByText('Supprimer le contrôle')).toBeInTheDocument()
  })

  it('should include the check type name in the warning message', () => {
    render(
      <DeleteCheckLogDialog checkTypeName='Vidange' onConfirm={() => {}} onCancel={() => {}} />
    )

    expect(
      screen.getByText(
        'Êtes-vous sûr de vouloir supprimer ce contrôle de "Vidange" ? Cette action est irréversible.'
      )
    ).toBeInTheDocument()
  })

  it('should render Supprimer and Annuler buttons', () => {
    render(
      <DeleteCheckLogDialog checkTypeName='Vidange' onConfirm={() => {}} onCancel={() => {}} />
    )

    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeVisible()
  })

  it('should call onConfirm when Supprimer is clicked', () => {
    const onConfirm = mock(() => {})

    render(
      <DeleteCheckLogDialog checkTypeName='Vidange' onConfirm={onConfirm} onCancel={() => {}} />
    )

    screen.getByRole('button', { name: 'Supprimer' }).click()

    expect(onConfirm).toHaveBeenCalled()
  })

  it('should call onCancel when Annuler is clicked', () => {
    const onCancel = mock(() => {})

    render(
      <DeleteCheckLogDialog checkTypeName='Vidange' onConfirm={() => {}} onCancel={onCancel} />
    )

    screen.getByRole('button', { name: 'Annuler' }).click()

    expect(onCancel).toHaveBeenCalled()
  })
})

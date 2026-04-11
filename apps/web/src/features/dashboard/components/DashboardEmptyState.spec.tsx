import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { DashboardEmptyState } from './DashboardEmptyState'

describe('DashboardEmptyState', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  describe('variant="no-vehicle"', () => {
    it('renders the no-vehicle title and description', () => {
      render(<DashboardEmptyState variant='no-vehicle' />)

      expect(screen.getByText('Aucun véhicule enregistré')).toBeInTheDocument()
      expect(
        screen.getByText('Ajoutez votre premier véhicule pour commencer à suivre son entretien.')
      ).toBeInTheDocument()
    })

    it('renders a CTA link pointing to /vehicle', () => {
      render(<DashboardEmptyState variant='no-vehicle' />)

      const cta = screen.getByRole('link', { name: /Ajouter un véhicule/i })
      expect(cta).toHaveAttribute('href', '/vehicle')
    })
  })

  describe('variant="no-check-types"', () => {
    it('renders the no-check-types title and description', () => {
      render(<DashboardEmptyState variant='no-check-types' />)

      expect(screen.getByText('Aucun type de contrôle défini')).toBeInTheDocument()
    })

    it('renders a CTA link pointing to /check-types', () => {
      render(<DashboardEmptyState variant='no-check-types' />)

      const cta = screen.getByRole('link', { name: /Créer un type de contrôle/i })
      expect(cta).toHaveAttribute('href', '/check-types')
    })
  })

  describe('variant="no-action-items"', () => {
    it('renders the positive all-clear message', () => {
      render(<DashboardEmptyState variant='no-action-items' />)

      expect(screen.getByText('Tous les contrôles sont à jour !')).toBeInTheDocument()
    })

    it('does not render any CTA link', () => {
      render(<DashboardEmptyState variant='no-action-items' />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })
})

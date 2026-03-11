import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { DeleteAccountDialog } from './DeleteAccountDialog'

mock.module('~/lib/authClient', () => ({
  authClient: {
    deleteUser: mock(() => Promise.resolve({ error: null }))
  }
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

describe('DeleteAccountDialog', () => {
  const mockOnClose = mock(() => {})

  beforeEach(() => {
    cleanup()
    mock.restore()
    mockOnClose.mockClear()
  })

  describe('when isOpen is false', () => {
    it('should render nothing', () => {
      const { container } = render(<DeleteAccountDialog isOpen={false} onClose={mockOnClose} />)

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when isOpen is true', () => {
    it('should render the dialog', () => {
      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /delete account/i, hidden: true })
      ).toBeInTheDocument()
    })

    it('should have delete button disabled initially', () => {
      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByRole('button', { name: /delete account/i, hidden: true })).toBeDisabled()
    })

    it('should enable delete button when user types DELETE', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByPlaceholderText(/type delete/i), 'DELETE')

      expect(screen.getByRole('button', { name: /delete account/i, hidden: true })).toBeEnabled()
    })

    it('should call onClose when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      await user.click(screen.getByRole('button', { name: /cancel/i, hidden: true }))

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when backdrop is clicked', () => {
      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      const overlay = document.querySelector('.fixed.inset-0')
      fireEvent.click(overlay!)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call deleteUser and redirect on success', async () => {
      const user = userEvent.setup()
      const mockDeleteUser = authClient.deleteUser as unknown as ReturnType<typeof mock>
      mockDeleteUser.mockResolvedValue({ error: null })

      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByPlaceholderText(/type delete/i), 'DELETE')
      await user.click(screen.getByRole('button', { name: /delete account/i, hidden: true }))

      await waitFor(() => {
        expect(authClient.deleteUser).toHaveBeenCalled()
        expect(navigationUtils.redirect).toHaveBeenCalledWith('/')
      })
    })

    it('should show error message when delete fails', async () => {
      const user = userEvent.setup()
      const mockDeleteUser = authClient.deleteUser as unknown as ReturnType<typeof mock>
      mockDeleteUser.mockResolvedValue({ error: { message: 'Server error' } })

      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByPlaceholderText(/type delete/i), 'DELETE')
      await user.click(screen.getByRole('button', { name: /delete account/i, hidden: true }))

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument()
      })
    })

    it('should reset state when dialog is reopened', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByPlaceholderText(/type delete/i), 'DEL')

      rerender(<DeleteAccountDialog isOpen={false} onClose={mockOnClose} />)
      rerender(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      const input = screen.getByPlaceholderText(/type delete/i) as HTMLInputElement
      expect(input.value).toBe('')
      expect(screen.getByRole('button', { name: /delete account/i, hidden: true })).toBeDisabled()
    })

    it('should show loading state while deleting', async () => {
      const user = userEvent.setup()
      const mockDeleteUser = authClient.deleteUser as unknown as ReturnType<typeof mock>
      mockDeleteUser.mockReturnValue(new Promise(() => {}))

      render(<DeleteAccountDialog isOpen={true} onClose={mockOnClose} />)

      await user.type(screen.getByPlaceholderText(/type delete/i), 'DELETE')
      await user.click(screen.getByRole('button', { name: /delete account/i, hidden: true }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /deleting/i, hidden: true })).toBeDisabled()
      })
    })
  })
})

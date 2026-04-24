import { describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { ResetPasswordSchema } from '../schemas'

import { ResetPasswordForm } from './ResetPasswordForm'

const Harness = () => {
  const form = useForm<ResetPasswordSchema>({ defaultValues: { password: '' } })

  return <ResetPasswordForm form={form} />
}

describe('ResetPasswordForm', () => {
  it('renders the password field', () => {
    cleanup()
    render(<Harness />)

    expect(screen.getByLabelText(/nouveau password/i)).toBeInTheDocument()
  })

  it('renders password as type=text', () => {
    cleanup()
    render(<Harness />)

    expect(screen.getByLabelText(/nouveau password/i)).toHaveAttribute('type', 'text')
  })
})

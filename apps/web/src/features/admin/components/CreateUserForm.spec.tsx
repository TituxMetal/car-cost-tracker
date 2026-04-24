import { describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { CreateUserSchema } from '../schemas'

import { CreateUserForm } from './CreateUserForm'

const Harness = () => {
  const form = useForm<CreateUserSchema>({
    defaultValues: { username: '', email: '', password: '', firstName: '', lastName: '' }
  })

  return <CreateUserForm form={form} />
}

describe('CreateUserForm', () => {
  it('renders all five fields', () => {
    cleanup()
    render(<Harness />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
  })

  it('renders password as type=text (admin reads what they type)', () => {
    cleanup()
    render(<Harness />)

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })
})

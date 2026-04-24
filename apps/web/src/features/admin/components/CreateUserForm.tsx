import type { UseFormReturn } from 'react-hook-form'

import { Input } from '~/components/ui'

import type { CreateUserSchema } from '../schemas'

export interface CreateUserFormProps {
  form: UseFormReturn<CreateUserSchema>
}

export const CreateUserForm = ({ form }: CreateUserFormProps) => (
  <>
    <Input
      {...form.register('username')}
      label='Username'
      placeholder='Ex: newtester'
      error={form.formState.errors.username?.message}
      autoComplete='off'
    />

    <Input
      {...form.register('email')}
      type='email'
      label='Email'
      placeholder='Ex: tester@example.com'
      error={form.formState.errors.email?.message}
      autoComplete='off'
    />

    <Input
      {...form.register('password')}
      type='text'
      label='Password'
      placeholder='Ex: Secret123!'
      error={form.formState.errors.password?.message}
      autoComplete='off'
    />

    <Input
      {...form.register('firstName')}
      label='First name (optional)'
      placeholder='Ex: Alex'
      error={form.formState.errors.firstName?.message}
      autoComplete='off'
    />

    <Input
      {...form.register('lastName')}
      label='Last name (optional)'
      placeholder='Ex: Dupont'
      error={form.formState.errors.lastName?.message}
      autoComplete='off'
    />
  </>
)

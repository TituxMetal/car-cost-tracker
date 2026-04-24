import type { UseFormReturn } from 'react-hook-form'

import { Input } from '~/components/ui'

import type { ResetPasswordSchema } from '../schemas'

export interface ResetPasswordFormProps {
  form: UseFormReturn<ResetPasswordSchema>
}

export const ResetPasswordForm = ({ form }: ResetPasswordFormProps) => (
  <Input
    {...form.register('password')}
    type='text'
    label='Nouveau password'
    placeholder='Ex: NouveauSecret123'
    error={form.formState.errors.password?.message}
    autoComplete='off'
  />
)

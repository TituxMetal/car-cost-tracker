import type { UseFormReturn } from 'react-hook-form'

import { Input, Textarea } from '~/components/ui'

import type { CreateCheckLogSchema } from '../schemas'

export interface LogCheckFormProps {
  form: UseFormReturn<CreateCheckLogSchema>
}

export const LogCheckForm = ({ form }: LogCheckFormProps) => (
  <>
    <Input
      type='date'
      label='Date du contrôle'
      {...form.register('completedAt')}
      error={form.formState.errors.completedAt?.message}
      max={new Date().toISOString().split('T')[0]}
    />
    <Textarea
      label='Notes'
      {...form.register('notes')}
      error={form.formState.errors.notes?.message}
    />
  </>
)

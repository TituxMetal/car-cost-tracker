import type { UseFormReturn } from 'react-hook-form'

import { Input, Textarea } from '~/components/ui'

import type { CreateCheckTypeSchema } from '../schemas'

export interface CheckTypeFormProps {
  form: UseFormReturn<CreateCheckTypeSchema>
}

export const CheckTypeForm = ({ form }: CheckTypeFormProps) => (
  <>
    <Input label='Nom' {...form.register('name')} error={form.formState.errors.name?.message} />
    <Input
      label='Intervalle (jours)'
      type='number'
      className='font-mono text-lg'
      {...form.register('intervalDays', { valueAsNumber: true })}
      error={form.formState.errors.intervalDays?.message}
    />
    <Textarea
      label='Description'
      {...form.register('description')}
      error={form.formState.errors.description?.message}
    />
  </>
)

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'

import type { UpdateMileageSchema } from '../schemas'
import { updateMileageSchema } from '../schemas'
import { formatMileage } from '../utils'

export interface QuickMileageUpdateProps {
  currentMileage: number
  onSubmit: (data: UpdateMileageSchema) => void
}

export const QuickMileageUpdate = ({ currentMileage, onSubmit }: QuickMileageUpdateProps) => {
  const form = useForm<UpdateMileageSchema>({
    resolver: zodResolver(updateMileageSchema),
    defaultValues: { mileage: currentMileage }
  })
  return (
    <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
      <p>Kilométrage actuel : {formatMileage(currentMileage)}</p>

      <Input
        type='number'
        label='Kilométrage'
        {...form.register('mileage', { valueAsNumber: true })}
        error={form.formState.errors.mileage?.message}
      />
      <Button type='submit'>Mettre à jour</Button>
    </FormWrapper>
  )
}

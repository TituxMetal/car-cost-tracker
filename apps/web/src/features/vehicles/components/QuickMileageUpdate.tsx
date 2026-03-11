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
    <article className='card bg-base-200'>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='card-body gap-4'>
        <h2 className='card-title'>Mise à jour du kilométrage</h2>
        <p className='text-base-content/70'>Kilométrage actuel : {formatMileage(currentMileage)}</p>

        <Input
          type='number'
          label='Kilométrage'
          {...form.register('mileage', { valueAsNumber: true })}
          error={form.formState.errors.mileage?.message}
        />
        <Button type='submit'>Mettre à jour</Button>
      </FormWrapper>
    </article>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'

import type { UpdateMileageSchema } from '../schemas'
import { updateMileageSchema } from '../schemas'
import { formatMileage } from '../utils'

export interface QuickMileageUpdateProps {
  currentMileage: number
  onSubmit: (data: UpdateMileageSchema) => void | Promise<void>
}

export const QuickMileageUpdate = ({ currentMileage, onSubmit }: QuickMileageUpdateProps) => {
  const form = useForm<UpdateMileageSchema>({
    resolver: zodResolver(updateMileageSchema),
    defaultValues: { mileage: currentMileage }
  })

  const watched = form.watch('mileage')
  const hasIncrease =
    typeof watched === 'number' && Number.isFinite(watched) && watched > currentMileage
  const delta = hasIncrease ? watched - currentMileage : null

  return (
    <article className='border-base-300 bg-base-200 border'>
      <header className='border-base-300 border-b p-4'>
        <p className='text-base-content/60 font-mono text-xs tracking-widest uppercase'>
          Compteur kilométrique
        </p>
      </header>

      <div className='border-base-300 m-4 flex flex-col gap-1 border p-4'>
        <p className='text-primary font-mono text-4xl tracking-wider'>
          {formatMileage(currentMileage)}
        </p>
        <p className='text-base-content/60 mt-1 font-mono text-xs tracking-widest uppercase'>
          Kilomètres actuels
        </p>
      </div>

      <FormWrapper onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3 p-4 pt-0'>
        <Input
          className='font-mono text-lg'
          label='Nouvelle valeur'
          type='number'
          {...form.register('mileage', { valueAsNumber: true })}
          error={form.formState.errors.mileage?.message}
        />
        {delta !== null && <p className='text-success font-mono text-sm'>+ {delta} km</p>}
        <Button className='w-full' type='submit'>
          Valider
        </Button>
      </FormWrapper>
    </article>
  )
}

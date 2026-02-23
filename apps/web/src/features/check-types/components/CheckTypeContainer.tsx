import { useEffect, useState } from 'react'

import { useVehicle } from '~/features/vehicles'
import { redirect } from '~/utils/navigation'

import { useCheckTypes } from '../hooks'
import type { CheckType } from '../types'

import { CheckTypeList } from './CheckTypeList'

export const CheckTypeContainer = () => {
  const [mode, setMode] = useState<'loading' | 'list' | 'create' | 'edit'>('loading')
  const { vehicle, fetchVehicle, hasVehicle, isLoading: isVehicleLoading } = useVehicle()
  const { checkTypes, isLoading: isCheckTypesLoading, fetchByVehicle } = useCheckTypes()

  useEffect(() => {
    fetchVehicle()
  }, [fetchVehicle])

  useEffect(() => {
    if (hasVehicle && vehicle) {
      fetchByVehicle(vehicle.id)
    }
  }, [hasVehicle, vehicle, fetchByVehicle])

  useEffect(() => {
    if (vehicle && !isCheckTypesLoading) {
      setMode('list')
    }
  }, [vehicle, isCheckTypesLoading])

  // Stubs for now (Phase 12 form, Phase 14 delete dialog)
  const onEdit = (_checkType: CheckType) => {}
  const onDelete = (_checkType: CheckType) => {}

  if (!vehicle && !isVehicleLoading && !hasVehicle) {
    redirect('/vehicle')
    return null
  }

  if (mode === 'loading') {
    return <p>Chargement...</p>
  }

  return (
    <section className='p-4'>
      <h1 className='mb-4 text-2xl font-bold text-zinc-100'>Types de contrôle</h1>
      <CheckTypeList checkTypes={checkTypes} onEdit={onEdit} onDelete={onDelete} />
    </section>
  )
}

import { useEffect, useState } from 'react'

import { useCheckTypes } from '~/features/check-types'
import { useVehicle } from '~/features/vehicles'
import { redirect } from '~/utils/navigation'

import { useCheckLogs } from '../hooks'
import type { CheckLog } from '../types'

import { CheckLogList } from './CheckLogList'
import { CheckTypeFilter } from './CheckTypeFilter'
import { DeleteCheckLogDialog } from './DeleteCheckLogDialog'

export const CheckLogContainer = () => {
  const [mode, setMode] = useState<'loading' | 'list'>('loading')
  const [hasFetchedVehicle, setHasFetchedVehicle] = useState(false)
  const [selectedCheckTypeId, setSelectedCheckTypeId] = useState<string | null>(null)
  const [deletingCheckLog, setDeletingCheckLog] = useState<CheckLog | null>(null)
  const { vehicle, fetchVehicle, hasVehicle } = useVehicle()
  const { logs, error, isLoading, fetchLogs, remove } = useCheckLogs()
  const { checkTypes, fetchByVehicle } = useCheckTypes()

  useEffect(() => {
    const load = async () => {
      await fetchVehicle()
      setHasFetchedVehicle(true)
    }
    load()
  }, [fetchVehicle])

  useEffect(() => {
    if (hasVehicle && vehicle) {
      fetchLogs(vehicle.id)
      fetchByVehicle(vehicle.id)
    }
  }, [hasVehicle, vehicle, fetchLogs, fetchByVehicle])

  useEffect(() => {
    if (mode !== 'loading') return
    if (!hasFetchedVehicle && !hasVehicle) return

    if (!hasVehicle) {
      redirect('/vehicle')
      return
    }

    if (vehicle && !isLoading) setMode('list')
  }, [mode, hasFetchedVehicle, hasVehicle, vehicle, isLoading])

  const filteredLogs = selectedCheckTypeId
    ? logs.filter(log => log.checkTypeId === selectedCheckTypeId)
    : logs

  const selectedCheckTypeName =
    selectedCheckTypeId && checkTypes.find(ct => ct.id === selectedCheckTypeId)?.name

  const periodLabel = selectedCheckTypeName ?? 'Tous les contrôles'

  const handleDeleteConfirm = async () => {
    if (!vehicle || !deletingCheckLog) return

    try {
      await remove(vehicle.id, deletingCheckLog.id)
      setDeletingCheckLog(null)
    } catch (_error) {
      setDeletingCheckLog(null)
    }
  }

  if (mode === 'loading') {
    return <p>Chargement...</p>
  }

  return (
    <section className='mx-auto max-w-6xl p-6'>
      <header className='mb-6'>
        <p className='font-display text-base-content/60 text-xs tracking-wider uppercase'>
          ARCHIVES · JOURNAL DES CONTRÔLES
        </p>
        <h1 className='font-display mt-1 text-3xl font-bold tracking-wider md:text-4xl'>
          {filteredLogs.length} entrées · {periodLabel}
        </h1>
      </header>
      {error && (
        <div className='alert alert-error mb-6' role='alert'>
          {error}
        </div>
      )}
      <aside className='mb-6 max-w-xs'>
        <CheckTypeFilter
          checkTypes={checkTypes}
          selectedCheckTypeId={selectedCheckTypeId}
          onChange={setSelectedCheckTypeId}
        />
      </aside>
      <CheckLogList checkLogs={filteredLogs} onDelete={setDeletingCheckLog} />
      {deletingCheckLog && (
        <DeleteCheckLogDialog
          checkTypeName={deletingCheckLog.checkTypeName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCheckLog(null)}
        />
      )}
    </section>
  )
}

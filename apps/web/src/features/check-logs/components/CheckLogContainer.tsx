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

  const handleDeleteConfirm = async () => {
    if (!vehicle || !deletingCheckLog) return

    try {
      await remove(vehicle.id, deletingCheckLog.id)
      setDeletingCheckLog(null)
    } catch (error) {
      setDeletingCheckLog(null)
    }
  }

  if (mode === 'loading') {
    return <p>Chargement...</p>
  }

  return (
    <section>
      <h1>Historique des contrôles</h1>
      {error && <p className='alert alert-error'>{error}</p>}
      <CheckTypeFilter
        checkTypes={checkTypes}
        selectedCheckTypeId={selectedCheckTypeId}
        onChange={setSelectedCheckTypeId}
      />
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

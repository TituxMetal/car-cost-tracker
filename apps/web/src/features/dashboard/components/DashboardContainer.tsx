import { useCallback, useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { LogCheckDialog } from '~/features/check-logs'
import type { CreateCheckLogSchema } from '~/features/check-logs/schemas'

import { useDashboard } from '../hooks'

import { ActionItemsList } from './ActionItemsList'
import { DashboardEmptyState } from './DashboardEmptyState'
import { RecentActivityList } from './RecentActivityList'
import { StatusOverview } from './StatusOverview'
import { VehicleSummaryCard } from './VehicleSummaryCard'

export const DashboardContainer = () => {
  const {
    error,
    vehicle,
    hasVehicle,
    hasCheckTypes,
    statusCounts,
    actionItems,
    recentLogs,
    initialize,
    logCheck
  } = useDashboard()
  const [loggingCheckTypeId, setLoggingCheckTypeId] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [quickLogError, setQuickLogError] = useState<string | null>(null)

  const runInitialize = useCallback(async () => {
    setIsInitializing(true)
    try {
      await initialize()
    } finally {
      setIsInitializing(false)
    }
  }, [initialize])

  useEffect(() => {
    runInitialize()
  }, [runInitialize])

  const loggingItem = actionItems.find(item => item.checkTypeId === loggingCheckTypeId)

  const handleQuickLog = (checkTypeId: string) => {
    setQuickLogError(null)
    setLoggingCheckTypeId(checkTypeId)
  }

  const handleLogCancel = () => {
    setLoggingCheckTypeId(null)
    setQuickLogError(null)
  }

  const handleLogSubmit = async (data: CreateCheckLogSchema) => {
    if (!vehicle || !loggingCheckTypeId) return

    setQuickLogError(null)
    try {
      await logCheck(vehicle.id, loggingCheckTypeId, data)
      setLoggingCheckTypeId(null)
    } catch (caught) {
      setQuickLogError(
        caught instanceof Error ? caught.message : "Erreur lors de l'enregistrement du contrôle."
      )
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-base-content text-center text-4xl font-bold'>Tableau de bord</h1>
      {isInitializing && (
        <p className='text-base-content/70 text-center' role='status'>
          Chargement...
        </p>
      )}
      {!isInitializing && error && (
        <div className='alert alert-error flex flex-col gap-3' role='alert'>
          <p>{error}</p>
          <Button onClick={runInitialize} variant='outline'>
            Réessayer
          </Button>
        </div>
      )}
      {!isInitializing && !error && !hasVehicle && <DashboardEmptyState variant='no-vehicle' />}
      {!isInitializing && !error && vehicle && (
        <>
          <VehicleSummaryCard vehicle={vehicle} />
          {hasCheckTypes && (
            <>
              <StatusOverview counts={statusCounts} />
              <div className='grid gap-6 lg:grid-cols-2'>
                <ActionItemsList items={actionItems} onLog={handleQuickLog} />
                <RecentActivityList logs={recentLogs} />
              </div>
            </>
          )}
          {!hasCheckTypes && <DashboardEmptyState variant='no-check-types' />}
        </>
      )}
      {quickLogError && (
        <div className='alert alert-error' role='alert'>
          <p>{quickLogError}</p>
        </div>
      )}
      {loggingItem && (
        <LogCheckDialog
          checkTypeName={loggingItem.checkTypeName}
          onSubmit={handleLogSubmit}
          onCancel={handleLogCancel}
        />
      )}
    </div>
  )
}

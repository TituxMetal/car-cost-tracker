import { useCallback, useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { LogCheckDialog } from '~/features/check-logs'
import type { CreateCheckLogSchema } from '~/features/check-logs/schemas'
import { useCheckTypes } from '~/features/check-types'
import type { CheckType } from '~/features/check-types'
import { redirect } from '~/utils/navigation'

import { useDashboard } from '../hooks'

import { ActionItemsList } from './ActionItemsList'
import { BudgetPanel } from './BudgetPanel'
import { DashboardEmptyState } from './DashboardEmptyState'
import { HealthSummary } from './HealthSummary'
import { LastEntryCard } from './LastEntryCard'
import { RecentExpensesPanel } from './RecentExpensesPanel'
import { RecentTimeline } from './RecentTimeline'
import { TelltaleGrid } from './TelltaleGrid'
import { UpcomingChecksGrid } from './UpcomingChecksGrid'
import { VehicleActivePanel } from './VehicleActivePanel'

export const DashboardContainer = () => {
  const {
    error,
    vehicle,
    hasVehicle,
    hasCheckTypes,
    statusCounts,
    actionItems,
    statuses,
    recentLogs,
    healthScore,
    tellTaleSummaries,
    initialize,
    logCheck
  } = useDashboard()
  const { checkTypes } = useCheckTypes()
  const [loggingCheckType, setLoggingCheckType] = useState<CheckType | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
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

  const handleQuickLog = (checkTypeId: string) => {
    const candidate = checkTypes.find(type => type.id === checkTypeId) ?? null

    setQuickLogError(null)
    setLoggingCheckType(candidate)
    setIsPickerOpen(false)
  }

  const handleOpenPicker = () => {
    setQuickLogError(null)
    setLoggingCheckType(null)
    setIsPickerOpen(true)
  }

  const handleLogCancel = () => {
    setLoggingCheckType(null)
    setIsPickerOpen(false)
    setQuickLogError(null)
  }

  const handleLogSubmit = async (data: CreateCheckLogSchema, checkTypeId: string) => {
    if (!vehicle) return

    setQuickLogError(null)
    try {
      await logCheck(vehicle.id, checkTypeId, data)
      setLoggingCheckType(null)
      setIsPickerOpen(false)
    } catch (caught) {
      setQuickLogError(
        caught instanceof Error ? caught.message : "Erreur lors de l'enregistrement du contrôle."
      )
    }
  }

  const dialogActionItem = loggingCheckType
    ? actionItems.find(item => item.checkTypeId === loggingCheckType.id)
    : undefined
  const lastLog = recentLogs[0] ?? null

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='sr-only'>Tableau de bord</h1>
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
      {quickLogError && (
        <div className='alert alert-error' role='alert'>
          <p>{quickLogError}</p>
        </div>
      )}
      {!isInitializing && !error && !hasVehicle && <DashboardEmptyState variant='no-vehicle' />}
      {!isInitializing && !error && vehicle && !hasCheckTypes && (
        <DashboardEmptyState variant='no-check-types' />
      )}
      {!isInitializing && !error && vehicle && hasCheckTypes && (
        <>
          {actionItems.length > 0 && <ActionItemsList items={actionItems} onLog={handleQuickLog} />}
          <div className='grid gap-6 lg:grid-cols-[360px_1fr]'>
            <aside className='flex flex-col gap-4'>
              <VehicleActivePanel vehicle={vehicle} onUpdateMileage={() => redirect('/vehicle')} />
              <TelltaleGrid summaries={tellTaleSummaries} />
              <LastEntryCard log={lastLog} />
              <BudgetPanel vehicleId={vehicle.id} />
            </aside>
            <section className='flex flex-col gap-4'>
              <HealthSummary score={healthScore} counts={statusCounts} />
              <UpcomingChecksGrid summaries={statuses} onLog={handleOpenPicker} />
              <RecentTimeline logs={recentLogs} />
              <RecentExpensesPanel vehicleId={vehicle.id} />
            </section>
          </div>
        </>
      )}
      {(loggingCheckType || isPickerOpen) && (
        <LogCheckDialog
          checkType={loggingCheckType ?? undefined}
          checkTypes={isPickerOpen ? checkTypes : undefined}
          status={dialogActionItem?.status}
          onSubmit={handleLogSubmit}
          onCancel={handleLogCancel}
        />
      )}
    </div>
  )
}

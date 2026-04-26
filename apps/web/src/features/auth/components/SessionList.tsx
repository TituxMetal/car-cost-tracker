import { useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

type Session = {
  id: string
  token: string
  expiresAt: Date
  createdAt: Date
  userAgent?: string | null
  ipAddress?: string | null
}

const wrapperClasses = 'grid gap-6'
const summaryClasses =
  'text-base-content/60 font-mono text-[11px] tracking-[0.18em] uppercase flex items-baseline justify-between'
const summaryCountClasses = 'text-primary font-mono text-base normal-case tracking-tight'
const errorAlertClasses =
  'border-error/50 bg-error/10 text-error border px-4 py-3 font-mono text-xs tracking-wide'
const emptyStateClasses =
  'border-base-300 bg-base-200 text-base-content/60 border px-6 py-10 text-center font-mono text-xs tracking-wide'
const listClasses = 'grid gap-3'
const rowBaseClasses =
  'bg-base-200 grid gap-3 border px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6'
const rowCurrentBorder = 'border-primary'
const rowDefaultBorder = 'border-base-300'
const deviceLabelClasses = 'font-mono text-sm leading-snug break-all'
const metaLabelClasses = 'text-base-content/60 font-mono text-[11px] tracking-[0.15em] uppercase'
const currentBadgeClasses =
  'badge badge-primary font-display ml-2 align-middle text-[10px] tracking-[0.18em] uppercase'
const dangerZoneClasses = 'border-base-300 grid gap-3 border-t pt-6 sm:grid-cols-2'

const formatCreatedAt = (date: Date) =>
  new Date(date)
    .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '.')

export const SessionList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentToken, setCurrentToken] = useState<string | null>(null)
  const [revokingToken, setRevokingToken] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<'others' | 'all' | null>(null)

  const fetchSessions = async () => {
    setIsLoading(true)
    setError(null)

    const [sessionsResult, currentResult] = await Promise.all([
      authClient.listSessions(),
      authClient.getSession()
    ])

    if (sessionsResult.error) {
      setError(sessionsResult.error.message ?? 'Échec du chargement des sessions')
      setIsLoading(false)
      return
    }

    setSessions(sessionsResult.data ?? [])
    setCurrentToken(currentResult.data?.session?.token ?? null)
    setIsLoading(false)
  }

  const handleRevokeSession = async (token: string) => {
    if (revokingToken) return

    setRevokingToken(token)
    const { error } = await authClient.revokeSession({ token })

    if (error) {
      setError(error.message ?? 'Échec de la révocation')
      setRevokingToken(null)
      return
    }

    await fetchSessions()
    setRevokingToken(null)
  }

  const handleRevokeOtherSessions = async () => {
    if (bulkAction) return

    setBulkAction('others')
    const { error } = await authClient.revokeOtherSessions()

    if (error) {
      setError(error.message ?? 'Échec de la révocation des autres sessions')
      setBulkAction(null)
      return
    }

    await fetchSessions()
    setBulkAction(null)
  }

  const handleRevokeAllSessions = async () => {
    if (bulkAction) return

    setBulkAction('all')
    const { error } = await authClient.revokeSessions()

    if (error) {
      setError(error.message ?? 'Échec de la révocation globale')
      setBulkAction(null)
      return
    }

    redirect('/auth')
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  if (isLoading) {
    return (
      <div className={wrapperClasses}>
        <p className={emptyStateClasses}>Chargement des sessions…</p>
      </div>
    )
  }

  return (
    <div className={wrapperClasses}>
      <p className={summaryClasses}>
        <span>// {sessions.length === 0 ? 'AUCUNE SESSION' : 'INDEX SESSIONS'}</span>
        {sessions.length > 0 && <span className={summaryCountClasses}>{sessions.length}</span>}
      </p>

      {error && (
        <p role='alert' className={errorAlertClasses}>
          {error}
        </p>
      )}

      {sessions.length === 0 ? (
        <p className={emptyStateClasses}>Aucune session active.</p>
      ) : (
        <ul className={listClasses}>
          {sessions.map(session => {
            const isCurrent = session.token === currentToken
            const rowBorder = isCurrent ? rowCurrentBorder : rowDefaultBorder

            return (
              <li key={session.id} className={`${rowBaseClasses} ${rowBorder}`}>
                <div className='grid gap-1'>
                  <p className={deviceLabelClasses}>
                    {session.userAgent ?? 'Appareil inconnu'}
                    {isCurrent && <span className={currentBadgeClasses}>Session actuelle</span>}
                  </p>
                  <p className={metaLabelClasses}>
                    {session.ipAddress ?? 'IP inconnue'} · CRÉÉE LE{' '}
                    {formatCreatedAt(session.createdAt)}
                  </p>
                </div>
                {!isCurrent && (
                  <Button
                    variant='destructive'
                    className='btn-sm'
                    disabled={revokingToken !== null || bulkAction !== null}
                    onClick={() => handleRevokeSession(session.token)}
                  >
                    {revokingToken === session.token ? 'Révocation…' : 'Révoquer'}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {sessions.length > 0 && (
        <div className={dangerZoneClasses}>
          {sessions.length > 1 && (
            <Button
              variant='outline'
              disabled={bulkAction !== null || revokingToken !== null}
              onClick={handleRevokeOtherSessions}
            >
              {bulkAction === 'others' ? 'Déconnexion…' : 'Déconnecter les autres appareils'}
            </Button>
          )}
          <Button
            variant='destructive'
            disabled={bulkAction !== null || revokingToken !== null}
            onClick={handleRevokeAllSessions}
          >
            {bulkAction === 'all' ? 'Déconnexion…' : 'Tout déconnecter'}
          </Button>
        </div>
      )}
    </div>
  )
}

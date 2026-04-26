import { useEffect, useState } from 'react'

const panelClasses =
  'bg-base-100 border-base-300 text-base-content/60 grid gap-1.5 border p-5 font-mono text-[11px] leading-relaxed'
const headingClasses = 'text-primary text-[10px] tracking-[0.2em] uppercase'
const dotClasses = 'text-success mr-2'

const formatDate = (date: Date) =>
  date
    .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '.')

const formatTime = (date: Date) =>
  date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const REFRESH_MS = 60_000

export const SystemStatusPanel = () => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={panelClasses} role='status' aria-label='État système'>
      <p className={headingClasses}>ÉTAT SYSTÈME</p>
      <p>
        <span className={dotClasses} aria-hidden='true'>
          ◉
        </span>
        API en ligne · {formatDate(now)} {formatTime(now)}
      </p>
      <p>
        <span className={dotClasses} aria-hidden='true'>
          ◉
        </span>
        Better Auth · OK
      </p>
      <p>
        <span className={dotClasses} aria-hidden='true'>
          ◉
        </span>
        Prisma · OK
      </p>
    </div>
  )
}

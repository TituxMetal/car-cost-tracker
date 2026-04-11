const MS_PER_DAY = 24 * 60 * 60 * 1000

export const daysFromNow = (dateString: string, now: Date = new Date()): number => {
  const target = new Date(dateString)

  if (Number.isNaN(target.getTime())) {
    return Number.NaN
  }

  const targetDayStart = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate()
  )
  const nowDayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  return Math.round((targetDayStart - nowDayStart) / MS_PER_DAY)
}

export const formatDaysLabel = (daysFromNow: number): string => {
  if (Number.isNaN(daysFromNow)) {
    return ''
  }

  if (daysFromNow > 1) {
    return `dans ${daysFromNow} jours`
  }

  if (daysFromNow === 1) {
    return 'dans 1 jour'
  }

  if (daysFromNow === 0) {
    return "aujourd'hui"
  }

  if (daysFromNow === -1) {
    return '1 jour de retard'
  }

  return `${Math.abs(daysFromNow)} jours de retard`
}

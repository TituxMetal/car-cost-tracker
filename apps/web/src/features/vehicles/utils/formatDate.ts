export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR', { timeZone: 'UTC' })
}

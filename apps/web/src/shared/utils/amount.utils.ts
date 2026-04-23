export const centsToInputEuros = (cents: number): string =>
  (cents / 100).toFixed(2).replace('.', ',')

export const formatEuros = (cents: number): string => {
  const euros = cents / 100

  return Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(euros)
}

export const parseEurosToCents = (input: string): number => {
  const normalized = input
    .trim()
    .replace(/\s/g, '') // Remove all whitespace (including non-breaking spaces)
    .replace(/,/g, '.') // Replace comma with dot for decimal separator

  if ((normalized.match(/\./g) || []).length > 1) {
    throw new Error(`Invalid euro amount with multiple separators: "${input}"`)
  }

  if (normalized.startsWith('-')) {
    throw new Error(`Negative euro amounts are not allowed: "${input}"`)
  }

  // Strict match rejects trailing garbage (e.g. "12abc") and scientific notation.
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error(`Invalid euro amount: "${input}"`)
  }

  return Math.round(parseFloat(normalized) * 100)
}

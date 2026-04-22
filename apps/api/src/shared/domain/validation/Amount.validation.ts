export const AMOUNT_VALIDATION = {
  MIN_CENTS: 1,
  MAX_CENTS: 100_000_000,
  MIN_MESSAGE: 'Amount must be strictly positive',
  MAX_MESSAGE: 'Amount exceeds the maximum allowed (1 000 000 €)',
  INTEGER_MESSAGE: 'Amount must be an integer number of cents'
} as const

export const EXPENSE_VALIDATION = {
  DESCRIPTION: {
    MAX_LENGTH: 500,
    MESSAGE: 'Description must not exceed 500 characters'
  },
  AMOUNT: {
    MIN_CENTS: 1,
    MAX_CENTS: 100_000_000,
    MIN_MESSAGE: 'Amount must be strictly positive',
    MAX_MESSAGE: 'Amount exceeds the maximum allowed (1 000 000 €)',
    INTEGER_MESSAGE: 'Amount must be an integer number of cents'
  },
  OCCURRED_AT: {
    PATTERN: /^\d{4}-\d{2}-\d{2}$/,
    MESSAGE: 'Occurred date must be in YYYY-MM-DD format',
    FUTURE_MESSAGE: 'Occurred date cannot be in the future'
  },
  CATEGORY_MESSAGE: 'Category must be one of SERVICE, PARTS, LABOR, OTHER'
} as const

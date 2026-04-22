export const EXPENSE_VALIDATION = {
  DESCRIPTION: {
    MAX_LENGTH: 500,
    MESSAGE: 'Description must not exceed 500 characters'
  },
  OCCURRED_AT: {
    PATTERN: /^\d{4}-\d{2}-\d{2}$/,
    MESSAGE: 'Occurred date must be in YYYY-MM-DD format',
    FUTURE_MESSAGE: 'Occurred date cannot be in the future'
  },
  CATEGORY_MESSAGE: 'Category must be one of SERVICE, PARTS, LABOR, OTHER'
} as const

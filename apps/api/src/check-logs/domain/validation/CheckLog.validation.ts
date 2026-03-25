export const CHECK_LOG_VALIDATION = {
  NOTES: {
    MAX_LENGTH: 500,
    MESSAGE: 'Notes must not exceed 500 characters'
  },
  COMPLETED_AT: {
    PATTERN: /^\d{4}-\d{2}-\d{2}$/,
    MESSAGE: 'Completed date must be in YYYY-MM-DD format',
    FUTURE_MESSAGE: 'Completed date cannot be in the future'
  }
} as const

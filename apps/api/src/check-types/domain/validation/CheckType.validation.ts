export const CHECK_TYPE_VALIDATION = {
  NAME: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
    MESSAGE: 'Name must be between 5 and 100 characters'
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
    MESSAGE: 'Description must not exceed 500 characters'
  },
  INTERVAL_DAYS: {
    MIN: 1,
    MESSAGE: 'Interval must be at least 1 day'
  }
} as const

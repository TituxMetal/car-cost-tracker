export const BUDGET_VALIDATION = {
  PERIOD: {
    VALUES: ['MONTHLY', 'ANNUAL'] as const,
    MESSAGE: 'Budget period must be MONTHLY or ANNUAL'
  }
} as const

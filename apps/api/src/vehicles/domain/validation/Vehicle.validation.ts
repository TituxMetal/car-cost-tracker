export const VEHICLE_VALIDATION = {
  MAKE: {
    MAX_LENGTH: 50,
    MESSAGE: 'Make must be at most 50 characters'
  },
  MODEL: {
    MAX_LENGTH: 50,
    MESSAGE: 'Model must be at most 50 characters'
  },
  YEAR: {
    MIN: 1900,
    MAX: 2030,
    MESSAGE: 'Year must be between 1900 and 2030'
  },
  VIN: {
    LENGTH: 17,
    PATTERN: /^[A-HJ-NPR-Z0-9]{17}$/,
    MESSAGE: 'VIN must be 17 alphanumeric characters (no I, O, Q)'
  },
  MILEAGE: {
    MIN: 0,
    MESSAGE: 'Mileage cannot be negative'
  },
  LICENSE_PLATE: {
    MAX_LENGTH: 15,
    MESSAGE: 'License plate must be at most 15 characters'
  },
  ENGINE_TYPE: {
    MAX_LENGTH: 50,
    MESSAGE: 'Engine type must be at most 50 characters'
  }
} as const

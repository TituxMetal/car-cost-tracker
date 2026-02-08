import { describe, expect, it } from 'bun:test'

import { FUEL_TYPES } from '../types'

import { createVehicleSchema, updateMileageSchema, updateVehicleSchema } from './vehicle.schema'

describe('createVehicleSchema', () => {
  it('should validate a complete valid vehicle', () => {
    const validVehicle = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      engineType: 'V4',
      fuelType: 'GASOLINE',
      vin: '1HGCM82633A004352',
      licensePlate: 'ABC-1234',
      purchaseDate: new Date('2020-01-01').toISOString(),
      mileage: 15000
    }

    const result = createVehicleSchema.safeParse(validVehicle)

    expect(result.success).toBe(true)
  })

  it('should validate with only required fields', () => {
    const validVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2018
    }

    const result = createVehicleSchema.safeParse(validVehicle)

    expect(result.success).toBe(true)
  })

  it('should reject missing make', () => {
    const invalidVehicle = {
      model: 'Civic',
      year: 2018
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La marque est requise')
    }
  })

  it('should reject missing model', () => {
    const invalidVehicle = {
      make: 'Honda',
      year: 2018
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le modèle est requis')
    }
  })

  it('should reject missing year', () => {
    const invalidVehicle = {
      make: 'Honda',
      model: 'Civic'
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`L'année est requise`)
    }
  })

  it('should reject year below 1900', () => {
    const invalidVehicle = {
      make: 'Ford',
      model: 'Model T',
      year: 1899
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`L'année doit être au moins 1900`)
    }
  })

  it('should reject year above 2030', () => {
    const invalidVehicle = {
      make: 'Future Car',
      model: 'Concept',
      year: 2031
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`L'année doit être au plus 2030`)
    }
  })

  it('should reject make exceeding 50 characters', () => {
    const invalidVehicle = {
      make: 'A'.repeat(51),
      model: 'Civic',
      year: 2018
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La marque ne doit pas dépasser 50 caractères')
    }
  })

  it('should reject invalid VIN format', () => {
    const invalidVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      vin: 'INVALIDVIN123'
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le VIN doit comporter exactement 17 caractères alphanumériques (sans I, O, Q)'
      )
    }
  })

  it('should accept valid 17-character VIN', () => {
    const validVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      vin: '1HGCM82633A004352'
    }

    const result = createVehicleSchema.safeParse(validVehicle)

    expect(result.success).toBe(true)
  })

  it('should reject negative mileage', () => {
    const invalidVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: -100
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`Le kilométrage doit être supérieur ou égal à 0`)
    }
  })

  it('should reject invalid fuel type', () => {
    const invalidVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      fuelType: 'INVALID_FUEL_TYPE'
    }

    const result = createVehicleSchema.safeParse(invalidVehicle)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        `Le type de carburant doit être l'un des suivants : ${FUEL_TYPES.join(', ')}`
      )
    }
  })
})

describe('updateVehicleSchema', () => {
  it('should accept empty object (all fields optional)', () => {
    const validUpdate = {}

    const result = updateVehicleSchema.safeParse(validUpdate)

    expect(result.success).toBe(true)
  })

  it('should accept partial update with single field', () => {
    const validUpdate = {
      model: 'Mini'
    }

    const result = updateVehicleSchema.safeParse(validUpdate)

    expect(result.success).toBe(true)
  })

  it('should still validate field constraints', () => {
    const invalidUpdate = {
      year: 1800
    }

    const result = updateVehicleSchema.safeParse(invalidUpdate)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`L'année doit être au moins 1900`)
    }
  })
})

describe('updateMileageSchema', () => {
  it('should validate a valid mileage', () => {
    const validMileage = {
      mileage: 20000
    }

    const result = updateMileageSchema.safeParse(validMileage)

    expect(result.success).toBe(true)
  })

  it('should reject missing mileage', () => {
    const invalidMileage = {}

    const result = updateMileageSchema.safeParse(invalidMileage)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`Le kilométrage doit être un nombre`)
    }
  })

  it('should reject negative mileage', () => {
    const invalidMileage = {
      mileage: -500
    }

    const result = updateMileageSchema.safeParse(invalidMileage)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(`Le kilométrage doit être supérieur ou égal à 0`)
    }
  })
})

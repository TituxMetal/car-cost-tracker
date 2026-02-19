import { z } from 'zod'

import { FUEL_TYPES } from '../types'

const currentYear = new Date().getFullYear()

export const createVehicleSchema = z.object({
  make: z
    .string({ error: 'La marque est requise' })
    .min(1, { error: 'La marque est requise' })
    .max(50, { error: 'La marque ne doit pas dépasser 50 caractères' }),
  model: z
    .string({ error: 'Le modèle est requis' })
    .min(1, { error: 'Le modèle est requis' })
    .max(50, { error: 'Le modèle ne doit pas dépasser 50 caractères' }),
  year: z
    .number({ error: `L'année est requise` })
    .int({ error: `L'année doit être un entier` })
    .min(1900, { error: `L'année doit être au moins 1900` })
    .max(currentYear, { error: `L'année doit être au plus ${currentYear}` }),
  engineType: z
    .string()
    .max(50, { error: 'Le type de moteur ne doit pas dépasser 50 caractères' })
    .optional(),
  fuelType: z
    .enum(FUEL_TYPES, {
      error: `Le type de carburant doit être l'un des suivants : ${FUEL_TYPES.join(', ')}`
    })
    .optional(),
  vin: z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
      error: 'Le VIN doit comporter exactement 17 caractères alphanumériques (sans I, O, Q)'
    })
    .optional(),
  licensePlate: z
    .string()
    .max(15, { error: `La plaque d'immatriculation ne doit pas dépasser 15 caractères` })
    .optional(),
  purchaseDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      error: `La date d'achat doit être une date valide`
    })
    .optional(),
  mileage: z
    .number({ error: `Le kilométrage doit être un nombre` })
    .int({ error: `Le kilométrage doit être un entier` })
    .min(0, { error: `Le kilométrage doit être supérieur ou égal à 0` })
    .optional()
})

export const updateVehicleSchema = createVehicleSchema.omit({ mileage: true }).partial()

export const updateMileageSchema = z.object({
  mileage: z
    .number({ error: `Le kilométrage doit être un nombre` })
    .int({ error: `Le kilométrage doit être un entier` })
    .min(0, { error: `Le kilométrage doit être supérieur ou égal à 0` })
})

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>
export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>
export type UpdateMileageSchema = z.infer<typeof updateMileageSchema>

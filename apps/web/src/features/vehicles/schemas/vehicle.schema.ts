import { z } from 'zod'

import { FUEL_TYPES } from '../types'

export const createVehicleSchema = z.object({
  make: z
    .string({ message: 'La marque est requise' })
    .min(1, { message: 'La marque est requise' })
    .max(50, { message: 'La marque ne doit pas dépasser 50 caractères' }),
  model: z
    .string({ message: 'Le modèle est requis' })
    .min(1, { message: 'Le modèle est requis' })
    .max(50, { message: 'Le modèle ne doit pas dépasser 50 caractères' }),
  year: z
    .number({ message: `L'année est requise` })
    .int({ message: `L'année doit être un entier` })
    .min(1900, { message: `L'année doit être au moins 1900` })
    .max(2030, { message: `L'année doit être au plus 2030` }),
  engineType: z
    .string()
    .max(50, { message: 'Le type de moteur ne doit pas dépasser 50 caractères' })
    .optional(),
  fuelType: z
    .enum(FUEL_TYPES, {
      message: `Le type de carburant doit être l'un des suivants : ${FUEL_TYPES.join(', ')}`
    })
    .optional(),
  vin: z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
      message: 'Le VIN doit comporter exactement 17 caractères alphanumériques (sans I, O, Q)'
    })
    .optional(),
  licensePlate: z
    .string()
    .max(15, { message: `La plaque d'immatriculation ne doit pas dépasser 15 caractères` })
    .optional(),
  purchaseDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: `La date d'achat doit être une date valide`
    })
    .optional(),
  mileage: z
    .number({ message: `Le kilométrage doit être un nombre` })
    .int({ message: `Le kilométrage doit être un entier` })
    .min(0, { message: `Le kilométrage doit être supérieur ou égal à 0` })
    .optional()
})

export const updateVehicleSchema = createVehicleSchema.omit({ mileage: true }).partial()

export const updateMileageSchema = z.object({
  mileage: z
    .number({ message: `Le kilométrage doit être un nombre` })
    .int({ message: `Le kilométrage doit être un entier` })
    .min(0, { message: `Le kilométrage doit être supérieur ou égal à 0` })
})

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>
export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>
export type UpdateMileageSchema = z.infer<typeof updateMileageSchema>

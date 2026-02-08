export const FUEL_TYPES = ['GASOLINE', 'DIESEL', 'LPG', 'ELECTRIC', 'HYBRID'] as const

export type FuelType = (typeof FUEL_TYPES)[number]

export interface Vehicle {
  id: string
  userId: string
  make: string
  model: string
  year: number
  engineType: string | null
  fuelType: FuelType | null
  vin: string | null
  licensePlate: string | null
  purchaseDate: string | null
  mileage: number
  createdAt: string
  updatedAt: string
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  GASOLINE: 'Essence',
  DIESEL: 'Diesel',
  LPG: 'GPL',
  ELECTRIC: 'Électrique',
  HYBRID: 'Hybride'
}

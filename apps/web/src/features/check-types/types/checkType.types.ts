export interface CheckType {
  id: string
  vehicleId: string
  name: string
  description: string | null
  intervalDays: number
  createdAt: string
  updatedAt: string
}

export interface SuggestedCheckType {
  name: string
  description: string | null
  intervalDays: number
}

export const SUGGESTED_CHECK_TYPES: SuggestedCheckType[] = [
  { name: "Niveau d'huile", description: null, intervalDays: 7 },
  { name: 'Pression des pneus', description: null, intervalDays: 14 },
  { name: 'Niveau de liquide de refroidissement', description: null, intervalDays: 30 }
]

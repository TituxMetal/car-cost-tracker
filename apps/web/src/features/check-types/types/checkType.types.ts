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
  {
    name: "Niveau d'huile",
    description: "Vérifier le niveau d'huile moteur à froid sur une surface plane",
    intervalDays: 7
  },
  {
    name: 'Pression des pneus',
    description: 'Contrôler la pression des 4 pneus et la roue de secours à froid',
    intervalDays: 14
  },
  {
    name: 'Niveau de liquide de refroidissement',
    description: 'Vérifier le niveau entre les repères min et max, moteur froid',
    intervalDays: 30
  }
]

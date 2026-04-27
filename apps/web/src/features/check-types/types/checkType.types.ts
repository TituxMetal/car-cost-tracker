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
    name: 'Niveau de liquide de frein',
    description: 'Vérifier le niveau entre les repères min et max du bocal',
    intervalDays: 30
  },
  {
    name: 'Liquide de refroidissement',
    description: 'Vérifier le niveau entre les repères min et max, moteur froid',
    intervalDays: 30
  },
  {
    name: 'Niveau de lave-glace',
    description: 'Compléter le réservoir avec du liquide adapté à la saison',
    intervalDays: 30
  },
  {
    name: 'Éclairage complet',
    description: 'Feux de croisement, route, clignotants, stop, plaque',
    intervalDays: 30
  },
  {
    name: 'Essuie-glaces',
    description: 'État des balais avant et arrière',
    intervalDays: 90
  }
]

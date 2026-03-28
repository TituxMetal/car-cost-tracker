import { Select } from '~/components/ui'
import type { CheckType } from '~/features/check-types/types'

export interface CheckTypeFilterProps {
  checkTypes: CheckType[]
  selectedCheckTypeId: string | null
  onChange: (checkTypeId: string | null) => void
}

export const CheckTypeFilter = ({
  checkTypes,
  selectedCheckTypeId,
  onChange
}: CheckTypeFilterProps) => {
  const options = [
    { value: '', label: 'Tous les types' },
    ...checkTypes.map(ct => ({ value: ct.id, label: ct.name }))
  ]

  return (
    <Select
      label='Filtrer par type'
      options={options}
      value={selectedCheckTypeId ?? ''}
      onChange={e => onChange(e.target.value === '' ? null : e.target.value)}
    />
  )
}

import type { CheckType } from '../types'

import { CheckTypeCard } from './CheckTypeCard'

export interface CheckTypeListProps {
  checkTypes: CheckType[]
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
}

export const CheckTypeList = ({ checkTypes, onEdit, onDelete }: CheckTypeListProps) => {
  // Temporary: will be replaced by CheckTypeEmptyState component (Phase 13)
  const emptyCheckTypesMessage = 'Aucun type de contrôle trouvé. Veuillez en ajouter un.'

  return (
    <section className='grid gap-2'>
      {checkTypes.length > 0 ? (
        checkTypes.map(checkType => (
          <CheckTypeCard
            key={checkType.id}
            checkType={checkType}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p>{emptyCheckTypesMessage}</p>
      )}
    </section>
  )
}

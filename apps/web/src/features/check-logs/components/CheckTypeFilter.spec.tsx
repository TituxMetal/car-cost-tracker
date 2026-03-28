import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { CheckType } from '~/features/check-types/types'
import { cleanup, fireEvent, render } from '~/test-utils'

import { CheckTypeFilter } from './CheckTypeFilter'

const mockCheckTypes: CheckType[] = [
  {
    id: 'ct-1',
    vehicleId: 'v-1',
    name: 'Vidange',
    description: null,
    intervalDays: 7,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'ct-2',
    vehicleId: 'v-1',
    name: 'Pneus',
    description: null,
    intervalDays: 30,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  }
]

describe('CheckTypeFilter', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a select with "Tous les types" and check type options', () => {
    const { getByLabelText } = render(
      <CheckTypeFilter checkTypes={mockCheckTypes} selectedCheckTypeId={null} onChange={() => {}} />
    )

    const select = getByLabelText('Filtrer par type') as HTMLSelectElement

    expect(select).toBeInTheDocument()
    expect(select.options.length).toBe(3)
    expect(select.options[0].value).toBe('')
    expect(select.options[0].text).toBe('Tous les types')
    expect(select.options[1].value).toBe('ct-1')
    expect(select.options[1].text).toBe('Vidange')
    expect(select.options[2].value).toBe('ct-2')
    expect(select.options[2].text).toBe('Pneus')
  })

  it('should render with the label "Filtrer par type"', () => {
    const { getByLabelText } = render(
      <CheckTypeFilter checkTypes={mockCheckTypes} selectedCheckTypeId={null} onChange={() => {}} />
    )

    const select = getByLabelText('Filtrer par type')

    expect(select).toBeInTheDocument()
  })

  it('should select "Tous les types" when selectedCheckTypeId is null', () => {
    const { getByLabelText } = render(
      <CheckTypeFilter checkTypes={mockCheckTypes} selectedCheckTypeId={null} onChange={() => {}} />
    )

    const select = getByLabelText('Filtrer par type') as HTMLSelectElement

    expect(select.value).toBe('')
  })

  it('should select the correct check type when selectedCheckTypeId is set', () => {
    const { getByLabelText } = render(
      <CheckTypeFilter
        checkTypes={mockCheckTypes}
        selectedCheckTypeId={'ct-1'}
        onChange={() => {}}
      />
    )

    const select = getByLabelText('Filtrer par type') as HTMLSelectElement

    expect(select.value).toBe('ct-1')
  })

  it('should call onChange with checkTypeId when a type is selected', () => {
    const onChangeMock = mock(() => {})

    const { getByLabelText } = render(
      <CheckTypeFilter
        checkTypes={mockCheckTypes}
        selectedCheckTypeId={null}
        onChange={onChangeMock}
      />
    )

    const select = getByLabelText('Filtrer par type') as HTMLSelectElement

    fireEvent.change(select, { target: { value: 'ct-1' } })

    expect(onChangeMock).toHaveBeenCalledWith('ct-1')
  })

  it('should call onChange with null when "Tous les types" is selected', () => {
    const onChangeMock = mock(() => {})

    const { getByLabelText } = render(
      <CheckTypeFilter
        checkTypes={mockCheckTypes}
        selectedCheckTypeId={'ct-1'}
        onChange={onChangeMock}
      />
    )

    const select = getByLabelText('Filtrer par type') as HTMLSelectElement

    fireEvent.change(select, { target: { value: '' } })

    expect(onChangeMock).toHaveBeenCalledWith(null)
  })
})

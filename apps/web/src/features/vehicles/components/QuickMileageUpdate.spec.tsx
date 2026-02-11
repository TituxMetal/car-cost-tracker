import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { QuickMileageUpdate } from './QuickMileageUpdate'

describe('QuickMileageUpdate', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a mileage input pre-filled with currentMileage', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    const input = screen.getByLabelText(/Kilométrage/i)

    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(75000)
  })

  it('should render a submit button', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    const submitButton = screen.getByRole('button', { name: /Mettre à jour/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('should display the current mileage as label context', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    expect(screen.getByText(/Kilométrage actuel : 75000 kms/i)).toBeInTheDocument()
  })
})

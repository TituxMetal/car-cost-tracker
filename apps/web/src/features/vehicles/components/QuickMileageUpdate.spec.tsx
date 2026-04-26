import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'

import { QuickMileageUpdate } from './QuickMileageUpdate'

describe('QuickMileageUpdate', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the cluster kicker label', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    expect(screen.getByText(/compteur kilométrique/i)).toBeInTheDocument()
  })

  it('should render the current mileage in the inner panel', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    expect(screen.getByText('75000 km')).toBeInTheDocument()
    expect(screen.getByText(/kilomètres actuels/i)).toBeInTheDocument()
  })

  it('should render the Nouvelle valeur input pre-filled with currentMileage', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    const input = screen.getByLabelText('Nouvelle valeur')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(75000)
  })

  it('should render a Valider submit button', () => {
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={() => {}} />)

    expect(screen.getByRole('button', { name: /valider/i })).toBeInTheDocument()
  })

  it('should not render the live delta when watched value matches currentMileage', () => {
    render(<QuickMileageUpdate currentMileage={100} onSubmit={() => {}} />)

    expect(screen.queryByText(/^\+ \d+ km$/)).not.toBeInTheDocument()
  })

  it('should render the live delta when watched value is greater than currentMileage', async () => {
    const user = userEvent.setup()
    render(<QuickMileageUpdate currentMileage={100} onSubmit={() => {}} />)

    const input = screen.getByLabelText('Nouvelle valeur')
    await user.clear(input)
    await user.type(input, '150')

    expect(await screen.findByText('+ 50 km')).toBeInTheDocument()
  })

  it('should hide the live delta when watched value drops below currentMileage', async () => {
    const user = userEvent.setup()
    render(<QuickMileageUpdate currentMileage={100} onSubmit={() => {}} />)

    const input = screen.getByLabelText('Nouvelle valeur')
    await user.clear(input)
    await user.type(input, '90')

    expect(screen.queryByText(/\+ \d+ km/)).not.toBeInTheDocument()
  })

  it('should call onSubmit with the new mileage when Valider is clicked', async () => {
    let received: unknown = null
    const onSubmit = mock((data: unknown) => {
      received = data
    })
    const user = userEvent.setup()
    render(<QuickMileageUpdate currentMileage={75000} onSubmit={onSubmit} />)

    const input = screen.getByLabelText('Nouvelle valeur')
    await user.clear(input)
    await user.type(input, '75500')

    fireEvent.click(screen.getByRole('button', { name: /valider/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(received).toEqual({ mileage: 75500 })
  })
})

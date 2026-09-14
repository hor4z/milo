import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Kbd } from './kbd'

describe('Kbd', () => {
  it('usa la semántica de tecla', () => {
    const { container } = render(<Kbd>⌘K</Kbd>)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })

  it('muestra la tecla tal cual', () => {
    const { container } = render(<Kbd>⌘K</Kbd>)
    expect(container.querySelector('kbd')).toHaveTextContent('⌘K')
  })
})

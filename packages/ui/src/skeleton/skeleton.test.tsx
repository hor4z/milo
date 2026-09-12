import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('no se anuncia', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('el tamaño lo pone quien lo usa', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />)
    expect(container.firstChild).toHaveClass('h-4', 'w-20')
  })

  it('pulsa con la clase del sistema, que respeta prefers-reduced-motion', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('ui-pulse')
  })
})

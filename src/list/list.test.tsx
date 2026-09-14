import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { List, ListItem } from './list'

describe('List', () => {
  it('una fila con onClick es un botón y sin él no', async () => {
    const onClick = vi.fn()
    render(
      <List>
        <ListItem icon="star" color="blue" title="Con acción" hint="x" onClick={onClick} />
        <ListItem icon="star" color="green" title="Sin acción" hint="y" />
      </List>,
    )
    await userEvent.click(screen.getByText('Con acción'))
    expect(onClick).toHaveBeenCalled()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})

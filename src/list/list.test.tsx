import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { List } from './list'

describe('List', () => {
  it('una fila con onClick es un botón y sin él no', async () => {
    const onClick = vi.fn()
    render(
      <List>
        <List.Item icon="star" color="blue" onClick={onClick}>
          <List.Title>Con acción</List.Title>
          <List.Hint>x</List.Hint>
        </List.Item>
        <List.Item icon="star" color="green">
          <List.Title>Sin acción</List.Title>
          <List.Hint>y</List.Hint>
        </List.Item>
      </List>,
    )
    await userEvent.click(screen.getByText('Con acción'))
    expect(onClick).toHaveBeenCalled()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})

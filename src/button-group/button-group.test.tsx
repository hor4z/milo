import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '../button/button'
import { ButtonGroup } from './button-group'

describe('ButtonGroup', () => {
  it('es un grupo con nombre: sin eso los botones se leen sueltos', () => {
    render(
      <ButtonGroup label="Vista">
        <Button>Grilla</Button>
        <Button>Lista</Button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('group', { name: 'Vista' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('dice si va apilado, para que el test no lea el nombre picado de la clase', () => {
    render(<ButtonGroup label="Vista" vertical><Button>Una</Button></ButtonGroup>)
    expect(screen.getByRole('group')).toHaveAttribute('data-variant', 'vertical')
  })
})

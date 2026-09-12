import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tooltip } from './tooltip'

describe('Tooltip', () => {
  it('aparece con el foco de teclado y lo describe', async () => {
    render(<Tooltip label="Buscar en todo"><button>Buscar</button></Tooltip>)
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Buscar en todo'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby')
  })

  it('se va al salir el foco', async () => {
    render(<><Tooltip label="Ayuda"><button>Uno</button></Tooltip><button>Dos</button></>)
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
    await userEvent.tab()
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })
})

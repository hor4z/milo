import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CodeBlock } from './code-block'

const fuente = 'const a = 1\nconst b = 2\n'

describe('CodeBlock', () => {
  it('muestra el código tal cual', () => {
    const { container } = render(<CodeBlock code={fuente} />)
    expect(container.querySelector('code')?.textContent).toContain('const a = 1')
  })

  it('el lenguaje viaja como `language-*`, que es lo que espera un coloreador', () => {
    const { container } = render(<CodeBlock code={fuente} lang="ts" />)
    expect(container.querySelector('code')?.className).toBe('language-ts')
  })

  it('copia el texto y lo dice', async () => {
    const writeText = vi.fn()
    Object.assign(navigator, { clipboard: { writeText } })
    render(<CodeBlock code={fuente} filename="ejemplo.ts" />)
    await userEvent.click(screen.getByRole('button', { name: 'Copiar el código' }))
    expect(writeText).toHaveBeenCalledWith(fuente)
    expect(await screen.findByText('Copiado')).toBeInTheDocument()
  })

  it('los números no son parte de lo que se lee', () => {
    const { container } = render(<CodeBlock code={fuente} numbered />)
    const ocultos = [...container.querySelectorAll("pre [aria-hidden=\"true\"]")].map(n => n.textContent)
    expect(ocultos).toEqual(['1', '2'])
  })

  it('si entra entero no es una parada de tabulación de más', () => {
    // En jsdom nada mide, así que no scrollea: es la rama que tiene que callarse.
    const { container } = render(<CodeBlock code={fuente} />)
    expect(container.querySelector('pre')?.getAttribute('tabindex')).toBeNull()
  })
})

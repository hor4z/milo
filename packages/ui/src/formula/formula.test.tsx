import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Formula } from './formula'

const mediaVuelta = (
  <>
    <mi>v</mi><mo>=</mo>
    <mfrac><mrow><mn>2</mn><mi>π</mi><mi>r</mi></mrow><mi>T</mi></mfrac>
  </>
)

describe('Formula', () => {
  it('en la frase no abre renglón propio', () => {
    const { container } = render(
      <p>La velocidad es <Formula alt="v igual a dos pi erre sobre te">{mediaVuelta}</Formula> en el círculo.</p>,
    )
    expect(container.querySelector('math')?.getAttribute('display')).toBe('inline')
  })

  it('en bloque se centra y lleva su número', () => {
    const { container } = render(
      <Formula display number={3} alt="v igual a dos pi erre sobre te">{mediaVuelta}</Formula>,
    )
    expect(container.querySelector('math')?.getAttribute('display')).toBe('block')
    expect(screen.getByText('(3)')).toBeInTheDocument()
  })

  it('lleva el texto alternativo que se lee donde MathML no se interpreta', () => {
    const { container } = render(<Formula alt="uno sobre dos"><mn>1</mn></Formula>)
    expect(container.querySelector('math')?.getAttribute('alttext')).toBe('uno sobre dos')
  })

  it('el MathML llega al DOM en su namespace y no como etiquetas desconocidas', () => {
    // `toBeInTheDocument` rechaza esto —«must be an HTMLElement»— y ese rechazo
    // es justo la prueba: un `<mfrac>` que fuera HTML desconocido pasaría.
    const { container } = render(<Formula alt="dos pi erre sobre te">{mediaVuelta}</Formula>)
    const frac = container.querySelector('mfrac')
    expect(frac).not.toBeNull()
    expect(frac?.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML')
    expect(container.querySelector('math')?.textContent).toContain('π')
  })

  it('si entera no desborda, no es una parada de tabulación de más', () => {
    // En jsdom nada mide, así que `scrollWidth` es 0 y la caja no scrollea:
    // esta es la rama que tiene que quedarse callada.
    const { container } = render(<Formula display alt="uno"><mn>1</mn></Formula>)
    expect(container.querySelector('[tabindex]')).toBeNull()
    expect(container.querySelector('[role="region"]')).toBeNull()
  })

  it('la región que se desplaza se nombra por su número y no repitiendo la fórmula', () => {
    // En jsdom nada mide, así que la región no aparece; lo que se verifica es
    // que el nombre largo no esté escrito en ningún lado más que en el `<math>`.
    const { container } = render(<Formula display number={3} alt="uno sobre dos"><mn>1</mn></Formula>)
    const conNombre = [...container.querySelectorAll('[aria-label]')]
    expect(conNombre.every(n => !n.getAttribute('aria-label')!.includes('uno sobre dos'))).toBe(true)
  })

  it('sin contenido sigue llevando su texto alternativo', () => {
    const { container } = render(<Formula alt="nada">{null}</Formula>)
    expect(container.querySelector('math')?.getAttribute('alttext')).toBe('nada')
  })
})

import cls from './tree.module.css'
import { useState } from 'react'
import { Tree, type TreeNode } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

const espacios: TreeNode[] = [
  {
    id: 'mate',
    label: 'Matemática · 4.º A',
    icon: 'folder',
    meta: '18',
    children: [
      {
        id: 'numeros',
        label: 'Números racionales',
        icon: 'folder',
        meta: '7',
        children: [
          { id: 'fracciones', label: 'Fracciones equivalentes', icon: 'description' },
          { id: 'decimales', label: 'De fracción a decimal', icon: 'description' },
          { id: 'recta', label: 'La recta numérica', icon: 'description' },
        ],
      },
      { id: 'medida', label: 'Medida y proporción', icon: 'folder', meta: '11', children: [
        { id: 'escala', label: 'Planos a escala', icon: 'description' },
      ] },
    ],
  },
  {
    id: 'fisica',
    label: 'Física · 5.º B',
    icon: 'folder',
    meta: '9',
    children: [
      { id: 'caida', label: 'Caída libre', icon: 'description' },
      { id: 'energia', label: 'Energía mecánica', icon: 'description' },
    ],
  },
  { id: 'borradores', label: 'Borradores', icon: 'draft', meta: '3' },
]

const indice: TreeNode[] = [
  {
    id: 'h1',
    label: 'Caída libre: medir g en el patio',
    children: [
      { id: 'h2a', label: 'De dónde sale el número' },
      { id: 'h2b', label: 'Qué hay que entregar' },
      { id: 'h2c', label: 'Para los que quieran ir más lejos' },
      { id: 'h2d', label: 'Cómo viene el curso' },
    ],
  },
]

export function TreeStory() {
  const [elegido, setElegido] = useState('fracciones')
  const [abiertos, setAbiertos] = useState(['mate', 'numeros'])
  const [seccion, setSeccion] = useState('h2a')

  return (
    <Page
      title="Tree"
      kind="Navegación"
      imports="import { Tree } from '@milo/ui'"
      lead="Una jerarquía que se abre y se cierra. Los espacios de alguien y lo que hay adentro, o el índice de un documento largo, que son el mismo problema: saber dónde estás parado sin perder de vista dónde está el resto."
    >
      <Section
        title="Espacios anidados"
        note="Lo cerrado no está escondido: no está. Una rama cerrada no aparece en el documento, así que un lector de pantalla no la recorre y el teclado no pasa por ahí. La flecha derecha abre, y sobre algo ya abierto entra: es lo que evita tener que bajar con la otra flecha después de abrir."
      >
        <Canvas>
          <div className={cls.div}>
            <Tree
              nodes={espacios}
              label="Espacios"
              expanded={abiertos}
              onExpandedChange={setAbiertos}
              selected={elegido}
              onSelect={setElegido}
            />
          </div>
        </Canvas>
      </Section>

      <Section
        title="El índice de un documento"
        note="La misma pieza con otra cosa adentro. En una consigna larga es lo que dice cuánto falta, y para quien escribe, lo que muestra si los títulos que puso arman una estructura o son una lista."
      >
        <Canvas>
          <div className={cls.div2}>
            <Tree nodes={indice} label="Secciones del documento" selected={seccion} onSelect={setSeccion} />
          </div>
        </Canvas>
      </Section>

      <Note icon="lightbulb" title="El nivel se dibuja con aire, no con cajas">
        Un contenedor por nivel mete divisiones vacías entre el árbol y sus ramas, y un lector de
        pantalla las cuenta: "grupo, grupo, grupo" antes de llegar al nombre. Acá el árbol es una
        sola lista plana de lo que está a la vista, cada rama dice en qué nivel está y la sangría
        es padding. El teclado recorre lo mismo que se ve.
      </Note>

      <Section title="Props">
        <Props of={['Tree', 'TreeNode']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un `tree` con su nombre, y cada rama dice su nivel y si está abierta. Una hoja no dice nada de abrir, porque no abre.',
          'Una sola parada de tabulación: la rama donde está el cursor. Un árbol de cuarenta ramas son cuarenta paradas si cada una es tabulable.',
          'Las flechas hacen las cuatro cosas que se esperan: bajar, subir, abrir o entrar, y cerrar o volver al padre.',
          'Teclear una letra salta a la rama que empieza así, que es lo que vuelve usable un árbol largo sin mouse.',
          'Lo elegido se anuncia elegido y no solo se pinta.',
        ]} />
      </Section>
    </Page>
  )
}

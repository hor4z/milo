import cls from './task-list.module.css'
import { useState } from 'react'
import { TaskList, type Task } from '@milo/ui/task-list'
import { A11y, Note, Page, Props, Section } from '../kit'

const initial: Task[] = [
  { id: 'leer', label: 'Leer la consigna entera antes de empezar', done: true },
  { id: 'medir', label: 'Medir los tres objetos y anotar los valores', done: true },
  { id: 'graficar', label: 'Hacer el gráfico con los datos' },
  { id: 'concluir', label: 'Escribir qué pasó y por qué' },
]

export function TaskListStory() {
  const [tasks, setTasks] = useState(initial)
  const toggleTask = (id: string, done: boolean) => setTasks(t => t.map(x => (x.id === id ? { ...x, done } : x)))

  return (
    <Page
      title="TaskList"
      kind="Editor"
      imports="import { TaskList } from '@milo/ui/task-list'"
      lead="Cosas para hacer que se marcan al hacerlas: los pasos de una entrega, lo que falta de una actividad, el checklist de un experimento."
    >
      <Section title="La pieza" note="Marcá y desmarcá: lo hecho se apaga y se tacha, que son dos avisos y no uno.">
        <div className={`${cls.pieceBox} bg-surface`}>
          <TaskList items={tasks} onToggle={toggleTask} label="Pasos del experimento" />
        </div>
      </Section>

      <Section
        title="Solo de lectura"
        note="La consigna que escribió otro, o una entrega ya cerrada. Se lee igual y no se toca."
      >
        <div className={`${cls.readOnlyBox} bg-surface`}>
          <TaskList items={initial} onToggle={() => {}} label="Pasos, ya cerrados" readOnly />
        </div>
      </Section>

      <Note title="TaskList o Checkbox suelto">
        Un `Checkbox` solo es una decisión dentro de un formulario: se confirma con un botón. Una
        `TaskList` es una lista de cosas que se van haciendo, y cada marca vale sola en el momento.
        Si al final hay un "Guardar", son casillas; si no, es esta lista.
      </Note>

      <Props of={['TaskList', 'Task']} />

      <A11y
        items={[
          'La lista lleva nombre: "lista, cuatro elementos" no dice de qué.',
          'Cada casilla se nombra con su propio texto, y el texto es zona de click, que es la mitad del área útil del control.',
          'Lo hecho se dice con el tachado además del gris: quien no separa el gris del negro ve igual que la línea está cruzada.',
        ]}
      />
    </Page>
  )
}

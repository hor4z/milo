import { useEffect, useState } from 'react'
import { Avatar, FolderIcon, Icon, Select } from '@melu/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function SelectStory() {
  const [nivel, setNivel] = useState('6.º grado')
  const [area, setArea] = useState('Matemática')
  const [largo, setLargo] = useState('Cualquiera con el link puede ver y comentar')
  const [conIcono, setConIcono] = useState('Matemática')
  const [espacio, setEspacio] = useState('Matemática · 4.º A')
  const [docente, setDocente] = useState('Melina Rivero')

  const [cargando, setCargando] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setCargando(c => !c), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <Page
      title="Select"
      kind="Formularios"
      imports="import { Select } from '@melu/ui'"
      lead="Es un botón con un listbox propio, no un `<select>` nativo. `appearance: none` te saca la flecha, pero la lista desplegada la sigue dibujando el sistema operativo, así que en Linux aparece un control de GTK en medio de la interfaz: el campo se ve «sin estilo» por más que la caja esté bien."
    >
      <Section
        title="Variantes"
        note="El costo de no usar el nativo es traer el teclado a mano, que es lo que el nativo regalaba: flechas para moverse, Enter para elegir, Escape para salir, Home y End a los extremos. Probalo con el teclado."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 160">
            <Select value={nivel} onChange={setNivel} width={160} options={['4.º grado', '5.º grado', '6.º grado', '7.º grado']} />
          </Demo>
          <Demo label="al ancho del contenido">
            <Select value={area} onChange={setArea} options={['Matemática', 'Lengua', 'Ciencias', 'Geografía', 'Convivencia']} />
          </Demo>
          <div className="w-full max-w-[300px]">
            <Demo label="valor largo · se trunca">
              <Select
                value={largo}
                onChange={setLargo}
                width={280}
                options={['Solo yo', 'Todo el equipo', 'Cualquiera con el link puede ver y comentar']}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section
        title="Adelante del valor"
        note="`leading` es un nodo y no un `IconName`, al revés que el `icon` del TextField: ahí el icono es siempre un glifo del set, acá lo que va adelante del valor es de quien lo usa — el glifo de la categoría, la carpeta de color de un espacio, el avatar de una persona."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="un glifo">
            <Select
              value={conIcono}
              onChange={setConIcono}
              width={180}
              leading={<Icon name="calculate" size={16} />}
              options={['Matemática', 'Lengua', 'Ciencias']}
            />
          </Demo>
          <Demo label="una carpeta de color">
            <Select
              value={espacio}
              onChange={setEspacio}
              width={200}
              leading={<FolderIcon color="blue" size={16} />}
              options={['Matemática · 4.º A', 'Lengua · 6.º', 'Ciencias · 5.º B']}
            />
          </Demo>
          <Demo label="un avatar">
            <Select
              value={docente}
              onChange={setDocente}
              width={190}
              leading={<Avatar name="Melina Rivero" size={20} />}
              options={['Melina Rivero', 'Juan Pérez', 'Ana Gómez']}
            />
          </Demo>
        </div>
      </Section>

      <Section
        title="Mientras los datos no están"
        note="`loading` no es lo mismo que pasar un spinner por `leading`. Un spinner suelto se dibuja y nada más: el control sigue abriendo, y lo que abre es una lista vacía o —peor— la lista vieja, que se puede elegir. Eso no lo arregla el nodo porque no es contenido, es el estado del control. Con `loading` el select no abre, avisa `aria-busy`, cierra el panel si estaba abierto y pone el spinner solo si nadie pasó un leading propio. Lo que el componente no hace es enterarse solo: no recibe promesas ni sabe de fetch."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="loading · el spinner es el default">
            <Select value="Cargando espacios…" width={200} loading options={[]} />
          </Demo>
          <Demo label="loading con leading propio">
            <Select
              value="Matemática"
              width={180}
              loading
              leading={<Icon name="calculate" size={16} className="icon-muted" />}
              options={['Matemática', 'Lengua']}
            />
          </Demo>
          <Demo label="en vivo · alterna cada 2s">
            <Select
              value={cargando ? 'Buscando espacios…' : espacio}
              onChange={setEspacio}
              width={200}
              loading={cargando}
              options={['Matemática · 4.º A', 'Lengua · 6.º', 'Ciencias · 5.º B']}
            />
          </Demo>
        </div>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'value', type: 'string', note: 'obligatorio' },
          { name: 'onChange', type: '(v: string) => void' },
          { name: 'options', type: 'string[]', note: 'obligatorio' },
          { name: 'width', type: 'number', note: 'sin esto toma el ancho del contenido' },
          { name: 'leading', type: 'ReactNode', note: 'adelante del valor: un Icon, una FolderIcon, un Avatar, un Spinner' },
          { name: 'loading', type: 'boolean', note: 'no abre, avisa aria-busy y pone el spinner si no hay leading' },
        ]} />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Flechas para moverse, Enter para elegir, Escape para salir, Home y End a los extremos.',
          'Escape entra en la pila global: cierra la lista y deja abierto el modal que haya detrás.',
          'Con `loading` no abre y avisa `aria-busy`, en vez de mostrar una lista vacía.',
        ]} />
      </Section>
    </Page>
  )
}

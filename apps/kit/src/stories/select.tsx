import { useEffect, useState } from 'react'
import { Avatar, FolderIcon, Icon, Select } from '@melu/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function SelectStory() {
  const [level, setLevel] = useState('6.º grado')
  const [subject, setSubject] = useState('Matemática')
  const [long, setLong] = useState('Cualquiera con el link puede ver y comentar')
  const [withIcon, setWithIcon] = useState('Matemática')
  const [space, setSpace] = useState('Matemática · 4.º A')
  const [teacher, setTeacher] = useState('Melina Rivero')

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setLoading(c => !c), 2200)
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
        note="El costo de no usar el nativo es traer el teclado a mano, que es lo que el nativo regalaba: flechas para moverse, Enter para elegir, Escape para salir, Home y End a los extremos, y teclear para saltar a la opción que empieza así. Probalo con el teclado: abrí el de al lado y escribí «ci»."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 160">
            <Select value={level} onChange={setLevel} width={160} options={['4.º grado', '5.º grado', '6.º grado', '7.º grado']} />
          </Demo>
          <Demo label="al ancho del contenido">
            <Select value={subject} onChange={setSubject} options={['Matemática', 'Lengua', 'Ciencias', 'Geografía', 'Convivencia']} />
          </Demo>
          <div className="w-full max-w-[300px]">
            <Demo label="valor largo · se trunca">
              <Select
                value={long}
                onChange={setLong}
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
              value={withIcon}
              onChange={setWithIcon}
              width={180}
              leading={<Icon name="calculate" size={16} />}
              options={['Matemática', 'Lengua', 'Ciencias']}
            />
          </Demo>
          <Demo label="una carpeta de color">
            <Select
              value={space}
              onChange={setSpace}
              width={200}
              leading={<FolderIcon color="blue" size={16} />}
              options={['Matemática · 4.º A', 'Lengua · 6.º', 'Ciencias · 5.º B']}
            />
          </Demo>
          <Demo label="un avatar">
            <Select
              value={teacher}
              onChange={setTeacher}
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
              value={loading ? 'Buscando espacios…' : space}
              onChange={setSpace}
              width={200}
              loading={loading}
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
          'Flechas para moverse, Enter para elegir, Escape para salir, Home y End a los extremos. La flecha abajo también abre la lista.',
          'Teclear salta a la opción que empieza así, sin tildes y sin distinguir mayúsculas — con veinte opciones es la diferencia entre usable y no.',
          'El foco se queda en el control y la opción activa se anuncia con `aria-activedescendant`: un lector de pantalla dice cuál está señalada.',
          'Las opciones no son paradas de tabulación: Tab sale del control, no recorre las veinte.',
          'Escape entra en la pila global: cierra la lista y deja abierto el modal que haya detrás.',
          'Con `loading` no abre y avisa `aria-busy`, en vez de mostrar una lista vacía.',
        ]} />
      </Section>
    </Page>
  )
}

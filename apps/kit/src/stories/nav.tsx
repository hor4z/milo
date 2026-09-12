import { useState } from 'react'
import { FolderIcon, NavItemBody, navItemClass, navSubItemClass } from '@melu/ui'
import { Block, Props, Section } from '../kit'

export function NavStory() {
  const [active, setActive] = useState('explorar')

  return (
    <Section
      title="NavItem"
      note="El item del sidebar, y es la pieza que usa el riel de este mismo kit. Va partido en dos —`navItemClass` para el contenedor y `NavItemBody` para el contenido— porque NavLink recibe className y children como funciones de su propio estado: partirlo deja que quien navega elija el elemento y que el sistema decida cómo se ve."
    >
      <Block
        label="El item"
        note="40 de alto, radio 12, el icono en un cuadrado de 34 pegado al borde izquierdo (padding de 3) y la etiqueta a 12/600. El activo es una pastilla apagada con un anillo de un píxel, y el icono pasa a un chip de papel con su propio anillo."
      >
        <div className="w-[220px] rounded-xl border border-line bg-canvas px-5 py-4">
          <div className="flex flex-col gap-0.5">
            {[
              { id: 'explorar', icon: 'explore', label: 'Explorar' },
              { id: 'recursos', icon: 'layers', label: 'Recursos', badge: '84' },
              { id: 'guardadas', icon: 'favorite', label: 'Guardadas' },
            ].map(i => (
              <button key={i.id} onClick={() => setActive(i.id)} className={navItemClass({ active: active === i.id })}>
                <NavItemBody icon={i.icon as 'explore'} label={i.label} badge={i.badge} active={active === i.id} />
              </button>
            ))}

            <div className="px-2.5 py-2.5 text-xs font-medium text-ink-muted/70">Mis espacios</div>

            {([
              { id: 'ciencias', color: 'green', label: 'Ciencias · 5.º B' },
              { id: 'mate', color: 'orange', label: 'Matemática · 4.º A' },
            ] as const).map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} className={navItemClass({ active: active === s.id })}>
                <NavItemBody
                  glyph={<FolderIcon color={s.color} size={20} />}
                  label={s.label}
                  active={active === s.id}
                  chip={false}
                />
              </button>
            ))}
          </div>
        </div>
      </Block>

      <Block label="Subitems" note="Sangría de 48: la columna del texto del padre, para que las etiquetas queden alineadas entre sí.">
        <div className="w-[220px] rounded-xl border border-line bg-canvas px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <button className={navItemClass({ active: true })}>
              <NavItemBody icon="explore" label="Explorar" active />
            </button>
            <button className={navSubItemClass({ active: true })}>Recetas</button>
            <button className={navSubItemClass()}>Publicadas</button>
          </div>
        </div>
      </Block>

      <Block label="Contraído" note="A 72 de ancho el item se centra y pierde etiqueta y badge; el `title` pasa a ser lo único que dice qué es.">
        <div className="w-[72px] rounded-xl border border-line bg-canvas px-3 py-4">
          <div className="flex flex-col gap-0.5">
            <button className={navItemClass({ active: true, collapsed: true })} title="Explorar">
              <NavItemBody icon="explore" label="Explorar" active collapsed />
            </button>
            <button className={navItemClass({ collapsed: true })} title="Recursos">
              <NavItemBody icon="layers" label="Recursos" collapsed />
            </button>
          </div>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'navItemClass · active', type: 'boolean', note: 'pastilla apagada con anillo de 1px — no relieve hundido' },
          { name: 'navItemClass · collapsed', type: 'boolean', note: 'centra el icono y saca el padding' },
          { name: 'navItemClass · muted', type: 'boolean', note: 'para lo que comparte la forma sin ser un destino: el botón de contraer' },
          { name: 'NavItemBody · icon', type: 'IconName' },
          { name: 'NavItemBody · glyph', type: 'ReactNode', note: 'cuando el glifo no sale del set: la carpeta de un espacio' },
          { name: 'NavItemBody · badge', type: 'string', note: 'hundido como un kbd: un contador no es accionable' },
          { name: 'NavItemBody · chip', type: 'boolean', def: 'true', note: 'el chip de papel detrás del icono activo' },
        ]} />
      </Block>
    </Section>
  )
}

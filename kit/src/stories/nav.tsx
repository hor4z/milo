import cls from './nav.module.css'
import { useState } from 'react'
import { FolderIcon } from '@milo/ui/icon'
import { NavItemBody, navItemClass, navSubItemClass } from '@milo/ui/nav'
import { A11y, Page, Props, Section } from '../kit'

export function NavStory() {
  const [active, setActive] = useState('explorar')

  return (
    <Page
      title="NavItem"
      kind="Navegación"
      imports="import { NavItemBody, navItemClass } from '@milo/ui/nav'"
      lead="El item del sidebar, y es la pieza que usa el riel de este mismo kit. Va partido en dos (`navItemClass` para el contenedor y `NavItemBody` para el contenido) porque NavLink recibe className y children como funciones de su propio estado: partirlo deja que quien navega elija el elemento y que el sistema decida cómo se ve."
    >
      <Section
        title="El item"
        note="40 de alto, radio 12, el icono en un cuadrado de 34 y la etiqueta en el rol `--type-body`. El activo va en azul suave con su canto. Estuvo en gris, con la regla 'el activo nunca se marca con color': esa regla existía cuando el azul era el único acento, y dejó de valer cuando pasó a ser el color primario: en un riel de doce, el gris hay que buscarlo."
      >
        <div className={cls.itemRail}>
          <div className={cls.itemList}>
            {[
              { id: 'explorar', icon: 'explore', label: 'Explorar' },
              { id: 'recursos', icon: 'layers', label: 'Recursos', badge: '84' },
              { id: 'guardadas', icon: 'favorite', label: 'Guardadas' },
            ].map(i => (
              <button key={i.id} onClick={() => setActive(i.id)} className={navItemClass({ active: active === i.id })}>
                <NavItemBody icon={i.icon as 'explore'} label={i.label} badge={i.badge} />
              </button>
            ))}

            <div className={cls.railHeading}>Mis espacios</div>

            {([
              { id: 'ciencias', color: 'green', label: 'Ciencias · 5.º B' },
              { id: 'mate', color: 'orange', label: 'Matemática · 4.º A' },
            ] as const).map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} className={navItemClass({ active: active === s.id })}>
                <NavItemBody
                  glyph={<FolderIcon color={s.color} size={20} />}
                  label={s.label}
                />
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Subitems" note="Sangría de 48: la columna del texto del padre, para que las etiquetas queden alineadas entre sí.">
        <div className={cls.subitemRail}>
          <div className={cls.subitemList}>
            <button className={navItemClass({ active: true })}>
              <NavItemBody icon="explore" label="Explorar" />
            </button>
            <button className={navSubItemClass({ active: true })}>Recetas</button>
            <button className={navSubItemClass()}>Publicadas</button>
          </div>
        </div>
      </Section>

      <Section title="Contraído" note="A 72 de ancho el item se centra y pierde etiqueta y badge; el `title` pasa a ser lo único que dice qué es.">
        <div className={cls.collapsedRail}>
          <div className={cls.collapsedList}>
            <button className={navItemClass({ active: true, collapsed: true })} title="Explorar">
              <NavItemBody icon="explore" label="Explorar" collapsed />
            </button>
            <button className={navItemClass({ collapsed: true })} title="Recursos">
              <NavItemBody icon="layers" label="Recursos" collapsed />
            </button>
          </div>
        </div>
      </Section>

      <Section title="Props">
        <Props of={['navItemClass', 'NavItemBody']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El item activo lo dice con aria-current, no solo con el fondo.',
          'El texto de un item inactivo va en tinta: en gris, una lista de siete espacios parece deshabilitada.',
        ]} />
      </Section>
    </Page>
  )
}

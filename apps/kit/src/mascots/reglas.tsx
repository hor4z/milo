import { useEffect, useState } from 'react'
import { Icon } from '@milo/ui'
import { Section } from '../kit'

/** Si alguien pidió menos movimiento, el video no arranca: se queda el retrato. */
export function useQuieto() {
  const [quieto, setQuieto] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const leer = () => setQuieto(mq.matches)
    leer()
    mq.addEventListener('change', leer)
    return () => mq.removeEventListener('change', leer)
  }, [])
  return quieto
}

/** Dónde aparece y dónde no. La segunda columna es la que hace falta escribir. */
const donde = [
  { si: 'La primera vez que se abre algo', no: 'Una pantalla de trabajo, todos los días' },
  { si: 'Un vacío: todavía no hay actividades', no: 'Un error, una confirmación de borrado' },
  { si: 'Cuando algo salió bien y vale celebrarlo', no: 'Al lado del botón que manda' },
  { si: 'Una pantalla de bienvenida o de ayuda', no: 'Adentro de una tabla o de una lista' },
] as const

const nunca = [
  ['Rotarla', 'Se para derecha o no se usa.'],
  ['Recortarla', 'Entera o nada: media mascota se lee como un error de maquetado.'],
  ['Teñirla', 'El color es parte de quién es.'],
  ['Estirarla', 'La escala va en los dos ejes a la vez.'],
] as const

/** Las reglas son las mismas para todas las mascotas, así que viven en un solo lugar y las dos vistas las muestran. */
export function ReglasDeMascota() {
  return (
    <>
      <Section
        title="Dónde va y dónde no"
        note="Vale para todas por igual. La segunda columna es la que importa: una mascota sin un «acá no» termina en todas las pantallas, y una que está en todas deja de significar algo."
      >
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {donde.map(d => (
            <div key={d.si} className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-5 py-4 first:border-t-0">
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-ok" />
                <span className="text-body text-ink">{d.si}</span>
              </span>
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <Icon name="close" size={16} className="mt-0.5 shrink-0 text-bad" />
                <span className="text-body text-ink-muted">{d.no}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Lo que nunca se le hace"
        note="Una mascota deformada deja de ser la misma mascota, y la silueta es lo primero que alguien reconoce de un producto."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nunca.map(([que, por]) => (
            <div key={que} className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4">
              <span className="flex items-center gap-2 text-body font-semibold text-ink">
                <Icon name="close" size={14} className="shrink-0 text-bad" />
                {que}
              </span>
              <span className="text-meta text-ink-muted">{por}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

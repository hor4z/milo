import s from './mascot.module.css'
import { Stack } from '../kit'
import type { ReactNode } from 'react'

/** El retrato de una mascota, con su nombre y su carácter al lado. */
export function Portrait({ src, name, children }: {
  /** La imagen con alfa, de `public/mascotas`. */
  src: string
  name: string
  /** Cómo es, en una línea. */
  children: ReactNode
}) {
  return (
    <div className={`${s.portraitStage} bg-surface`}>
      <img src={src} alt="" className={s.portraitImage} />
      <Stack gap="sm">
        <span className={s.mascotName}>{name}</span>
        <span className={s.mascotBlurb}>{children}</span>
      </Stack>
    </div>
  )
}

/** Los archivos de una mascota: la ruta, la medida y para qué sirve cada uno. */
export function AssetTable({ rows }: {
  /** Ruta, medida y peso, y para qué sirve. */
  rows: readonly (readonly [string, string, string])[]
}) {
  return (
    <div className={`${s.assetTable} bg-surface`}>
      {rows.map(([path, weight, note]) => (
        <div key={path} className={s.assetRow}>
          <code className={s.assetPath}>{path}</code>
          <span className={`${s.assetSpec} tabular`}>{weight}</span>
          <span className={s.assetNote}>{note}</span>
        </div>
      ))}
    </div>
  )
}

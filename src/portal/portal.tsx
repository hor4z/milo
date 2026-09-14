import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** El host se crea durante el render y se cuelga del body en un layout effect. */
const PortalDepth = createContext(0)

export function Portal({ children }: { children: ReactNode }) {
  const depth = useContext(PortalDepth)
  const [host] = useState(() => {
    const el = document.createElement('div')
    el.setAttribute('data-portal', String(depth))
    el.style.position = 'relative'
    el.style.zIndex = String(1000 + depth * 10)
    return el
  })
  useLayoutEffect(() => {
    document.body.appendChild(host)
    return () => host.remove()
  }, [host])
  return createPortal(
    <PortalDepth.Provider value={depth + 1}>{children}</PortalDepth.Provider>,
    host,
  )
}

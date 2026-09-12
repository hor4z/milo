import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Prefs = {
  theme: 'light' | 'dark'
  suggest: boolean
  resume: boolean
  showLens: boolean
  shareRecipes: boolean
  directory: boolean
  confirmDelete: boolean
  notifySubmission: boolean
  notifyStuck: boolean
  notifyWeekly: boolean
  notifyProduct: boolean
  sidebarCollapsed: boolean
}

const defaults: Prefs = {
  theme: 'light',
  suggest: true,
  resume: true,
  showLens: true,
  shareRecipes: true,
  directory: false,
  confirmDelete: true,
  notifySubmission: true,
  notifyStuck: true,
  notifyWeekly: false,
  notifyProduct: false,
  sidebarCollapsed: false,
}

const KEY = 'melu.prefs'

/** Las preferencias se guardan solas y se leen una vez al arrancar. */
function read(): Prefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaults, theme: systemTheme() }
    return { ...defaults, ...JSON.parse(raw) as Partial<Prefs> }
  } catch {
    return { ...defaults, theme: 'light' }
  }
}

function systemTheme(): 'light' | 'dark' {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch { return 'light' }
}

type Ctx = { prefs: Prefs; set: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void }
const PrefsContext = createContext<Ctx | null>(null)

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(read)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* ventana privada */ }
  }, [prefs])

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme
  }, [prefs.theme])

  const value = useMemo<Ctx>(() => ({
    prefs,
    set: (k, v) => setPrefs(p => ({ ...p, [k]: v })),
  }), [prefs])

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs necesita estar dentro de <PrefsProvider>')
  return ctx
}

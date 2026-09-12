import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './ui/shell'
import { LibraryScreen } from './screens/library'
import { ExploreScreen, PublishedScreen, RecipesScreen } from './screens/explore'
import { ResourcesScreen, SavedScreen, SpaceScreen } from './screens/misc'
import { PricingScreen } from './screens/pricing'
import { UpdatesScreen } from './screens/updates'
import { SignInScreen } from './screens/signin'
import { EmptyState, Page, Button } from '@melu/ui'

/**
 * Dos shells: el de trabajo (con sidebar) y el que va suelto.
 *
 * Planes y entrar van sueltas a propósito: son pantallas de decisión, y el
 * sidebar al costado te ofrece irte a cualquier otra parte justo cuando estás
 * decidiendo.
 */
export function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<SignInScreen />} />
      <Route path="/planes" element={<PricingScreen />} />

      <Route element={<ShellLayout />}>
        <Route path="/" element={<LibraryScreen />} />
        <Route path="/explorar" element={<ExploreScreen />} />
        <Route path="/explorar/recetas" element={<RecipesScreen />} />
        <Route path="/explorar/publicadas" element={<PublishedScreen />} />
        <Route path="/recursos" element={<ResourcesScreen />} />
        <Route path="/guardadas" element={<SavedScreen />} />
        <Route path="/espacio/:id" element={<SpaceScreen />} />
        <Route path="/novedades" element={<UpdatesScreen />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/inicio" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/* `useLocation` sobre el shell no es decorativo: sin la key, al navegar entre
   dos pantallas que comparten componentes React reusa los nodos y las
   animaciones de entrada no vuelven a correr. */
function ShellLayout() {
  const { pathname } = useLocation()
  return (
    <AppShell>
      <div key={pathname}><Outlet /></div>
    </AppShell>
  )
}

function NotFound() {
  return (
    <Page>
      <div className="pt-16">
        <EmptyState
          icon="search_off"
          title="Acá no hay nada"
          body="La dirección existe pero no lleva a ninguna pantalla. Puede que la actividad se haya movido a otro espacio."
          action={<Button variant="solid" icon="deployed_code" onClick={() => location.assign('/')}>Ir a mis actividades</Button>}
        />
      </div>
    </Page>
  )
}

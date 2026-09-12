import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '@melu/ui'

/** Entrar. */
export function SignInScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-14 lg:w-[52%]">
        <div className="mx-auto w-full max-w-[380px]">
          <svg width="34" height="34" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect width="26" height="26" rx="8" fill="var(--solid)" />
            <path d="M7 17.5V11a4 4 0 018 0v6.5" stroke="var(--on-solid)" strokeWidth="2.1" strokeLinecap="round" />
            <path d="M15 17.5V11a4 4 0 014-4" stroke="var(--jade-500)" strokeWidth="2.1" strokeLinecap="round" />
          </svg>

          <h1 className="mt-7 text-2xl font-semibold">Entrá a melu</h1>
          <p className="mt-2 text-md leading-relaxed text-ink-muted">
            Con tu cuenta de Google, seas guía o aprendiz. No hay contraseña que recordar
            ni formulario que llenar.
          </p>

          <Button
            variant="solid"
            size="lg"
            block
            className="mt-7"
            onClick={() => navigate('/')}
          >
            <GoogleMark />
            Continuar con Google
          </Button>

          <p className="mt-4 text-sm leading-relaxed text-ink-subtle">
            Si tu escuela ya te cargó, el primer ingreso te reconoce por el correo y te deja
            adentro de tus espacios.
          </p>

          <div className="mt-9 flex items-center gap-2 text-sm text-ink-subtle">
            <Icon name="verified_user" size={14} />
            No leemos el contenido de las entregas
          </div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-tint-1 lg:block lg:w-[48%]">
        <svg viewBox="0 0 400 600" className="absolute inset-0 size-full" aria-hidden="true">
          <g stroke="var(--text)" strokeOpacity="0.14" fill="none" strokeWidth="1.5">
            <circle cx="210" cy="240" r="92" />
            <circle cx="210" cy="240" r="140" strokeDasharray="4 7" />
            <circle cx="210" cy="240" r="188" strokeOpacity="0.07" />
            <path d="M70 240h280M210 100v280" strokeOpacity="0.08" />
          </g>
          <circle cx="210" cy="240" r="7" fill="var(--jade-500)" fillOpacity="0.5" />
        </svg>
        <div className="absolute inset-x-12 bottom-14">
          <p className="font-display text-xl font-semibold leading-snug">
            Componé una actividad mezclando disciplinas y métodos, dásela a un grupo, y lo que
            los chicos hacen deja rastro desde el primer día.
          </p>
        </div>
      </aside>
    </div>
  )
}

/** La G de Google, en sus cuatro colores: es marca ajena y no se recolorea. */
function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 009 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 010-3.44V4.94H.96a9 9 0 000 8.12l3.01-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 00.96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}

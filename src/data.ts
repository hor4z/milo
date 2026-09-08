/**
 * Contenido de muestra. El producto habla español y el código inglés, así que
 * las claves son técnicas y las etiquetas son las que se ven en pantalla.
 */
export type Activity = {
  id: string
  title: string
  space: string
  lens: string
  tint: 1 | 2 | 3 | 4 | 5 | 6
  learners: number
  submissions: number
  updatedAt: string
  liked: boolean
  band: 'small' | 'medium' | 'large'
}

export const activities: Activity[] = [
  { id: 'a1', title: 'El barrio como mapa', space: 'Geografía · 6.º', lens: 'Indagación', tint: 2, learners: 24, submissions: 21, updatedAt: 'hace 2 h', liked: true, band: 'large' },
  { id: 'a2', title: 'Cuánto pesa la basura de una semana', space: 'Ciencias · 5.º', lens: 'Proyecto', tint: 1, learners: 28, submissions: 12, updatedAt: 'hace 5 h', liked: false, band: 'medium' },
  { id: 'a3', title: 'Fracciones con la receta de la abuela', space: 'Matemática · 4.º', lens: 'Resolución', tint: 5, learners: 26, submissions: 26, updatedAt: 'ayer', liked: true, band: 'small' },
  { id: 'a4', title: 'Retrato de alguien que no está', space: 'Lengua · 6.º', lens: 'Taller', tint: 6, learners: 22, submissions: 9, updatedAt: 'ayer', liked: false, band: 'medium' },
  { id: 'a5', title: 'La sombra a lo largo del día', space: 'Ciencias · 3.º', lens: 'Indagación', tint: 3, learners: 25, submissions: 25, updatedAt: 'hace 2 días', liked: false, band: 'large' },
  { id: 'a6', title: 'Un diario del recreo', space: 'Convivencia · 5.º', lens: 'Registro', tint: 4, learners: 27, submissions: 18, updatedAt: 'hace 3 días', liked: true, band: 'small' },
  { id: 'a7', title: 'Medir el patio sin cinta', space: 'Matemática · 6.º', lens: 'Resolución', tint: 1, learners: 24, submissions: 20, updatedAt: 'hace 4 días', liked: false, band: 'medium' },
  { id: 'a8', title: 'Qué come el barrio', space: 'Ciencias · 6.º', lens: 'Proyecto', tint: 2, learners: 23, submissions: 7, updatedAt: 'la semana pasada', liked: false, band: 'medium' },
  { id: 'a9', title: 'Cartas entre dos siglos', space: 'Historia · 6.º', lens: 'Taller', tint: 5, learners: 26, submissions: 24, updatedAt: 'la semana pasada', liked: true, band: 'small' },
  { id: 'a10', title: 'El ruido de la cuadra', space: 'Ciencias · 4.º', lens: 'Indagación', tint: 3, learners: 25, submissions: 15, updatedAt: 'hace 2 semanas', liked: false, band: 'large' },
  { id: 'a11', title: 'Inventario de plantas del patio', space: 'Ciencias · 3.º', lens: 'Registro', tint: 1, learners: 28, submissions: 28, updatedAt: 'hace 2 semanas', liked: false, band: 'medium' },
  { id: 'a12', title: 'Una entrevista a quien limpia', space: 'Convivencia · 6.º', lens: 'Taller', tint: 6, learners: 22, submissions: 11, updatedAt: 'hace 3 semanas', liked: true, band: 'small' },
]

export type Recipe = { id: string; title: string; lens: string; phases: number; tint: 1 | 2 | 3 | 4 | 5 | 6 }

export const recipes: Recipe[] = [
  { id: 'r1', title: 'Indagación guiada', lens: 'Pregunta · Hipótesis · Prueba · Cierre', phases: 4, tint: 2 },
  { id: 'r2', title: 'Proyecto por fases', lens: 'Encargo · Diseño · Producción · Muestra', phases: 4, tint: 1 },
  { id: 'r3', title: 'Taller de escritura', lens: 'Consigna · Borrador · Devolución · Final', phases: 4, tint: 6 },
  { id: 'r4', title: 'Resolución de problemas', lens: 'Situación · Estrategia · Cálculo · Revisión', phases: 4, tint: 5 },
  { id: 'r5', title: 'Registro sostenido', lens: 'Toma · Serie · Lectura', phases: 3, tint: 3 },
  { id: 'r6', title: 'Debate con roles', lens: 'Postura · Evidencia · Cruce · Síntesis', phases: 4, tint: 4 },
]

/** El color de un espacio se elige a mano, no se deriva: es como se lo reconoce
 *  en la lista, así que tiene que poder cambiarse sin tocar nada más. */
export type SpaceColor = 'orange' | 'green' | 'blue' | 'purple' | 'pink' | 'ink'

export type Space = { id: string; name: string; color: SpaceColor; count: number }

export const spaces: Space[] = [
  { id: 's1', name: 'Ciencias · 5.º B', color: 'green', count: 14 },
  { id: 's2', name: 'Matemática · 4.º A', color: 'orange', count: 9 },
  { id: 's3', name: 'Lengua · 6.º', color: 'purple', count: 11 },
]

export type Update = { id: string; version: string; date: string; title: string; body: string; tag: 'nuevo' | 'mejora' | 'arreglo' }

export const updates: Update[] = [
  { id: 'u1', version: '1.7', date: '2 de septiembre', title: 'Los ajustes se abren en un modal', body: 'Antes eran una página aparte y perdías de vista el espacio en el que estabas. Ahora se abren encima, con las secciones a la izquierda, y al cerrar seguís donde estabas.', tag: 'nuevo' },
  { id: 'u2', version: '1.6', date: '26 de agosto', title: 'El panel del guía carga de una', body: 'La matemática del perfil se movió al servidor. El número es el mismo lo mire el aprendiz o el guía, y la pantalla dejó de calcularlo dos veces.', tag: 'mejora' },
  { id: 'u3', version: '1.5', date: '18 de agosto', title: 'Arrastrar un bloque adentro de otro', body: 'Un bloque se puede soltar dentro de una fase sin que la fase se cierre. Antes había que soltar afuera y volver a entrar.', tag: 'mejora' },
  { id: 'u4', version: '1.4', date: '11 de agosto', title: 'Las entregas ya no se duplicaban', body: 'Si un aprendiz mandaba dos veces desde la misma pantalla quedaban dos filas. Ahora la segunda reemplaza a la primera y queda el rastro de las dos.', tag: 'arreglo' },
]

export type Plan = {
  id: string
  name: string
  monthly: number
  yearly: number
  blurb: string
  features: string[]
  featured?: boolean
  current?: boolean
}

export const plans: Plan[] = [
  {
    id: 'p1', name: 'Aula', monthly: 0, yearly: 0,
    blurb: 'Para un guía que quiere probar con un grupo y ver qué pasa.',
    features: ['Un espacio con hasta 30 aprendices', 'Las recetas de fábrica', 'Panel con las métricas de la semana', 'Historial de 30 días'],
    current: true,
  },
  {
    id: 'p2', name: 'Escuela', monthly: 12, yearly: 120,
    blurb: 'Para un equipo que comparte grupos y necesita ver el conjunto.',
    features: ['Todo lo de Aula', 'Espacios sin límite', 'Recetas propias y compartidas', 'Acompañantes y coordinación', 'Historial completo'],
    featured: true,
  },
  {
    id: 'p3', name: 'Distrito', monthly: 34, yearly: 340,
    blurb: 'Para quien mira varias escuelas a la vez y rinde cuentas.',
    features: ['Todo lo de Escuela', 'Tablero por escuela', 'Exportar los hechos en crudo', 'Ingreso con el dominio de la institución', 'Soporte con nombre y apellido'],
  },
]

/* --------------------------------------------------------------- avisos --- */

export type NotifKind = 'entrega' | 'traba' | 'invitacion' | 'comentario' | 'publicada'

export type Notif = {
  id: string
  kind: NotifKind
  who: string
  /** Lo que hizo. El sujeto va aparte para poder ponerlo en negrita. */
  action: string
  target?: string
  body?: string
  time: string
  unread: boolean
  /** Un aviso que espera una decisión trae los botones adentro de la fila. */
  decision?: boolean
}

export const notifications: Notif[] = [
  { id: 'n1', kind: 'entrega', who: 'Malena Ferreyra', action: 'entregó', target: 'El barrio como mapa', body: 'Subió tres fotos y el mapa dibujado a mano.', time: 'hace 20 min', unread: true },
  { id: 'n2', kind: 'traba', who: 'Tomás Aguirre', action: 'quedó trabado en', target: 'Fracciones con la receta de la abuela', body: 'Dos intentos en la fase de cálculo, sin avanzar.', time: 'hace 1 h', unread: true },
  { id: 'n3', kind: 'invitacion', who: 'Paula Giménez', action: 'te invitó a acompañar', target: 'Ciencias · 6.º A', body: 'Quedarías como acompañante: ves las entregas, no las calificás.', time: 'hace 3 h', unread: true, decision: true },
  { id: 'n4', kind: 'comentario', who: 'Ignacio Ruiz', action: 'comentó en', target: 'La sombra a lo largo del día', body: 'Che, la fase de cierre quedó muy corta para lo que pide la consigna.', time: 'hace 5 h', unread: false },
  { id: 'n5', kind: 'publicada', who: 'Vera Sosa', action: 'publicó', target: 'Un diario del recreo', body: 'Ya la podés copiar a cualquiera de tus espacios.', time: 'ayer', unread: false },
  { id: 'n6', kind: 'entrega', who: 'Grupo de 5.º B', action: 'completó', target: 'Inventario de plantas del patio', body: 'Entregaron los 28.', time: 'ayer', unread: false },
]

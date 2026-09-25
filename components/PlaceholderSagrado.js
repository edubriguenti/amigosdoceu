/**
 * Capa temática para cards sem imagem (orações, novenas…): gradiente suave + ícone da
 * categoria. Permite publicar conteúdo sem depender de imagem — preencha `imagem` depois.
 */
const ICONES = [
  [/marian/i, '🌹'],
  [/anjo/i, '👼'],
  [/esp[ií]rito|penit/i, '🕊️'],
  [/prote/i, '🛡️'],
  [/di[aá]ri/i, '☀️'],
  [/devo/i, '🕯️'],
  [/santo/i, '✨'],
]

export function iconeDaCategoria(categoria = '') {
  return ICONES.find(([re]) => re.test(categoria))?.[1] || '✝️'
}

export default function PlaceholderSagrado({ categoria }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent-100 via-primary-100 to-secondary-100"
      aria-hidden="true"
    >
      <span className="text-5xl drop-shadow-sm opacity-80">{iconeDaCategoria(categoria)}</span>
    </div>
  )
}

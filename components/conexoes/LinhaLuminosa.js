/**
 * Efeito heróico #1 — Linha luminosa AT ↔ NT.
 * SVG puro com gradiente azul→dourado, energia fluindo (stroke-dasharray
 * animado), pulso lento de opacidade. Reage ao hover do par via prop `intense`.
 */
export default function LinhaLuminosa({ intense = false, vertical = false, className = '' }) {
  const id = 'lum-grad'
  return (
    <svg
      viewBox={vertical ? '0 0 4 200' : '0 0 200 4'}
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation={intense ? '2.5' : '1.5'} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1={vertical ? '2' : '0'}
        y1={vertical ? '0' : '2'}
        x2={vertical ? '2' : '200'}
        y2={vertical ? '200' : '2'}
        stroke={`url(#${id})`}
        strokeWidth={intense ? 2 : 1.5}
        strokeDasharray="6 4"
        strokeLinecap="round"
        filter="url(#glow)"
        className="motion-safe:animate-flow-line motion-safe:animate-pulse-glow"
        style={{ opacity: intense ? 1 : 0.85 }}
      />
    </svg>
  )
}

import { memo } from 'react'
import Link from 'next/link'
import { DIFICULDADES, arquivoGpxEtapa, formatarTempo, hrefGoogleMaps } from '../../lib/peregrinacoesRegras'

const ICONE_PARADA = { igreja: '⛪', aparicao: '🌹', santo: '✨', local: '✝' }
const COR_DIFICULDADE = {
  facil: 'border-emerald-400/40 text-emerald-300',
  moderada: 'border-amber-400/40 text-amber-300',
  dificil: 'border-rose-400/40 text-rose-300',
}

const km = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const metros = (v) => v.toLocaleString('pt-BR')

/** Perfil de relevo da etapa (altitudes amostradas ao longo do trecho). */
function Relevo({ perfil, altMinM, altMaxM, subidaM, descidaM }) {
  if (!perfil || perfil.length < 2) return null
  const L = 300
  const A = 56
  const min = Math.min(...perfil)
  const max = Math.max(...perfil)
  // Etapas planas não devem parecer montanhas: a escala vertical cobre pelo menos 300 m.
  const faixa = Math.max(max - min, 300)
  const base = min - (faixa - (max - min)) / 2
  const pontos = perfil.map((h, i) => [(i / (perfil.length - 1)) * L, A - 4 - ((h - base) / faixa) * (A - 10)])
  const linha = pontos.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${L} ${A}`}
        preserveAspectRatio="none"
        className="w-full h-14"
        role="img"
        aria-label={`Relevo: de ${metros(altMinM)} a ${metros(altMaxM)} metros de altitude, ${metros(subidaM)} metros de subida e ${metros(descidaM)} de descida`}
      >
        <path d={`${linha} L${L} ${A} L0 ${A} Z`} fill="rgba(251,191,36,0.14)" />
        <path d={linha} fill="none" stroke="#fbbf24" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <figcaption className="mt-1 flex justify-between text-[11px] text-neutral-400">
        <span>
          ↗ {metros(subidaM)} m · ↘ {metros(descidaM)} m
        </span>
        <span>
          altitude {metros(altMinM)}–{metros(altMaxM)} m
        </span>
      </figcaption>
    </figure>
  )
}

function EtapaCard({ rotaSlug, etapa, ativa, feita, carregado, onAlternar, onFocar }) {
  const e = etapa
  const temRelevo = e.subidaM != null
  return (
    <article
      id={`etapa-${e.numero}`}
      data-etapa={e.numero}
      aria-labelledby={`etapa-${e.numero}-titulo`}
      className={`scroll-mt-[calc(38vh+5.5rem)] lg:scroll-mt-24 rounded-2xl border p-5 md:p-6 transition-colors ${
        ativa ? 'border-cosmic-gold/70 bg-cosmic-surface' : 'border-cosmic-border bg-cosmic-surface/50'
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-cosmic-gold">
            Etapa {e.numero}
            {carregado && feita && <span className="ml-2 normal-case tracking-normal text-emerald-300">✓ feita</span>}
          </p>
          <h3 id={`etapa-${e.numero}-titulo`} className="mt-1 font-serif text-xl md:text-2xl text-neutral-50 leading-snug">
            {e.origem} <span className="text-cosmic-gold" aria-hidden="true">→</span>
            <span className="sr-only"> até </span> {e.destino}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onFocar(e.numero)}
          className="shrink-0 rounded-full border border-cosmic-border px-3 py-1.5 text-xs text-neutral-200 hover:border-cosmic-gold/60 hover:text-cosmic-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
        >
          Ver no mapa
        </button>
      </header>

      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {e.distanciaKm != null && (
          <li className="rounded-full border border-cosmic-border bg-cosmic-bg/40 px-3 py-1 text-neutral-100">
            <strong className="font-semibold">{km(e.distanciaKm)} km</strong>
          </li>
        )}
        {e.dificuldade && <li className={`rounded-full border bg-cosmic-bg/40 px-3 py-1 ${COR_DIFICULDADE[e.dificuldade]}`}>{DIFICULDADES[e.dificuldade]}</li>}
        {e.tempoH != null && (
          <li className="rounded-full border border-cosmic-border bg-cosmic-bg/40 px-3 py-1 text-neutral-300">
            cerca de {formatarTempo(e.tempoH)} a pé
          </li>
        )}
      </ul>

      {temRelevo && <Relevo perfil={e.perfil} altMinM={e.altMinM} altMaxM={e.altMaxM} subidaM={e.subidaM} descidaM={e.descidaM} />}

      {e.descricao && <p className="mt-4 text-neutral-200 leading-relaxed">{e.descricao}</p>}

      {e.paradas.length > 0 && (
        <section className="mt-5" aria-label="Paradas sagradas">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Paradas sagradas</h4>
          <ul className="space-y-2">
            {e.paradas.map((p) => (
              <li key={p.nome} className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 w-6 shrink-0 text-center">
                  {ICONE_PARADA[p.tipo] || '✝'}
                </span>
                <span className="min-w-0">
                  {p.href ? (
                    <Link href={p.href} className="font-serif text-neutral-50 underline decoration-cosmic-gold/50 underline-offset-4 hover:text-cosmic-gold">
                      {p.nome}
                    </Link>
                  ) : (
                    <span className="font-serif text-neutral-50">{p.nome}</span>
                  )}
                  {p.nota && <span className="block text-sm text-neutral-400">{p.nota}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(e.meditacao || e.oracao) && (
        <section className="mt-5 rounded-xl border-l-2 border-cosmic-gold/60 bg-cosmic-bg/40 px-4 py-3" aria-label="Oração do trecho">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">🙏 Para rezar no trecho</h4>
          {e.meditacao && <p className="font-serif italic text-neutral-100 leading-relaxed">{e.meditacao}</p>}
          {e.oracao && (
            <p className="mt-2 text-sm">
              <Link href={e.oracao.href} className="text-cosmic-gold underline underline-offset-4 hover:text-amber-300">
                Rezar: {e.oracao.nome} →
              </Link>
            </p>
          )}
        </section>
      )}

      <footer className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onAlternar(e.numero)}
          aria-pressed={carregado ? feita : false}
          disabled={!carregado}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold disabled:opacity-60 ${
            carregado && feita ? 'border border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20' : 'bg-cosmic-gold text-[#1b1406] hover:bg-amber-300'
          }`}
        >
          {carregado && feita ? '✓ Etapa feita' : 'Marcar como feita'}
        </button>
        {e.inicio && e.fim && (
          <a
            href={hrefGoogleMaps(e.inicio, e.fim)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-full border border-cosmic-border bg-cosmic-surface-2 px-4 py-2 text-sm text-neutral-100 hover:border-cosmic-gold/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
          >
            Abrir no Google Maps<span className="sr-only"> (nova aba)</span>
          </a>
        )}
        <a
          href={arquivoGpxEtapa(rotaSlug, e.numero)}
          download
          className="inline-flex min-h-[44px] items-center rounded-full border border-cosmic-border bg-cosmic-surface-2 px-4 py-2 text-sm text-neutral-100 hover:border-cosmic-gold/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
        >
          Baixar GPX
        </a>
      </footer>
    </article>
  )
}

export default memo(EtapaCard)

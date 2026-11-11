/**
 * Mapa geral dos lugares sagrados: igrejas, aparições e rotas de peregrinação,
 * no estilo de mapa antigo (components/mapa/MapaBase.js).
 *
 * Depende de `window`: importe com next/dynamic({ ssr: false }) — ver pages/mapa/index.js.
 * Props (já enxutas, vindas do getStaticProps):
 *   locais = [{ tipo: 'igreja'|'aparicao', slug, nome, local, quando, latitude, longitude }]
 *   rotas  = [{ slug, nome, distanciaKm, totalEtapas, inicio, destino }]
 */
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Marker, Polyline, Popup, Tooltip } from 'react-leaflet'
import MapaBase, { Enquadrar } from './mapa/MapaBase'
import { CORES_MAPA, iconeLugar } from './mapa/icones'
import { distanciaKm, limites } from '../lib/geo'
import { arquivoTrajeto } from '../lib/peregrinacoesRegras'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'igreja', rotulo: 'Igrejas' },
  { id: 'aparicao', rotulo: 'Aparições' },
]

const hrefLocal = (l) => (l.tipo === 'igreja' ? `/igrejas/${l.slug}` : `/aparicoes/${l.slug}`)
const numero = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

const botaoFiltro = (ativo) =>
  `min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold ${
    ativo ? 'bg-cosmic-gold text-[#1b1406]' : 'border border-cosmic-border bg-cosmic-surface-2 text-neutral-100 hover:border-cosmic-gold/60'
  }`

export default function MapaInterativo({ locais, rotas = [] }) {
  const [filtro, setFiltro] = useState('todos')
  const [mostrarRotas, setMostrarRotas] = useState(true)
  const [tracados, setTracados] = useState({})
  const [posicao, setPosicao] = useState(null)
  const [aviso, setAviso] = useState('')
  const [localizando, setLocalizando] = useState(false)
  const [enquadramento, setEnquadramento] = useState(null)

  // Traçado real de cada rota (uma linha por rota, juntando as etapas).
  useEffect(() => {
    let vivo = true
    rotas.forEach((r) => {
      fetch(arquivoTrajeto(r.slug))
        .then((resp) => (resp.ok ? resp.json() : Promise.reject(new Error(String(resp.status)))))
        .then((d) => vivo && setTracados((t) => ({ ...t, [r.slug]: d.etapas.flat() })))
        .catch(() => {})
    })
    return () => {
      vivo = false
    }
  }, [rotas])

  const visiveis = useMemo(() => locais.filter((l) => filtro === 'todos' || l.tipo === filtro), [locais, filtro])

  const maisProximos = useMemo(() => {
    if (!posicao) return []
    return locais
      .map((l) => ({ ...l, distancia: distanciaKm(posicao[0], posicao[1], l.latitude, l.longitude) }))
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 5)
  }, [locais, posicao])

  const localizar = () => {
    if (!navigator.geolocation) {
      setAviso('Este navegador não informa a localização.')
      return
    }
    setLocalizando(true)
    setAviso('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const p = [coords.latitude, coords.longitude]
        setPosicao(p)
        setLocalizando(false)
        setEnquadramento([
          [p[0] - 4, p[1] - 6],
          [p[0] + 4, p[1] + 6],
        ])
      },
      () => {
        setLocalizando(false)
        setAviso('Não foi possível obter a sua localização. Verifique a permissão do navegador e tente de novo.')
      },
      { timeout: 15000 }
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cosmic-border bg-cosmic-surface/50 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filtrar lugares" className="flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFiltro(f.id)} aria-pressed={filtro === f.id} className={botaoFiltro(filtro === f.id)}>
                {f.rotulo}
              </button>
            ))}
          </div>
          {rotas.length > 0 && (
            <button type="button" onClick={() => setMostrarRotas((v) => !v)} aria-pressed={mostrarRotas} className={botaoFiltro(mostrarRotas)}>
              Rotas de peregrinação
            </button>
          )}
          <button
            type="button"
            onClick={localizar}
            disabled={localizando}
            className="min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border border-cosmic-border bg-cosmic-surface-2 text-neutral-100 hover:border-cosmic-gold/60 transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold md:ml-auto"
          >
            {localizando ? 'Localizando…' : '📍 Perto de mim'}
          </button>
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300" aria-label="Legenda">
          <li className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-[#f4ead2]" style={{ background: CORES_MAPA.igreja }} aria-hidden="true" /> Igrejas
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-[#f4ead2]" style={{ background: CORES_MAPA.aparicao }} aria-hidden="true" /> Aparições
          </li>
          {rotas.length > 0 && (
            <li className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-[#f4ead2]" style={{ background: CORES_MAPA.rota }} aria-hidden="true" /> Rotas de peregrinação
            </li>
          )}
          {posicao && (
            <li className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-[#f4ead2]" style={{ background: CORES_MAPA.usuario }} aria-hidden="true" /> Você
            </li>
          )}
        </ul>

        <p className="mt-3 text-sm text-amber-200" role="status" aria-live="polite">
          {aviso}
        </p>
      </div>

      <MapaBase centro={[20, -20]} zoom={2} rotulo="Mapa dos lugares sagrados" className="h-[62vh] min-h-[380px] md:h-[640px]">
        <Enquadrar limites={enquadramento} zoomMaximo={11} />

        {mostrarRotas &&
          rotas.map((r) =>
            tracados[r.slug] ? (
              <Polyline
                key={r.slug}
                positions={tracados[r.slug]}
                pathOptions={{ color: CORES_MAPA.rota, weight: 4, opacity: 0.95, dashArray: '2 7', lineCap: 'round' }}
              >
                <Tooltip sticky>{r.nome}</Tooltip>
                <Popup>
                  <strong className="font-serif text-base">{r.nome}</strong>
                  <span className="block mt-1 text-sm">
                    {r.inicio} → {r.destino}
                  </span>
                  <span className="block text-sm">
                    {r.distanciaKm != null ? `${numero(r.distanciaKm)} km · ` : ''}
                    {r.totalEtapas} etapas
                  </span>
                  <Link href={`/peregrinacoes/${r.slug}`} className="block mt-2 text-sm">
                    Ver o roteiro etapa por etapa →
                  </Link>
                </Popup>
              </Polyline>
            ) : null
          )}

        {/* De longe a linha some: um selo com a concha marca onde a rota está. */}
        {mostrarRotas &&
          rotas.map((r) => {
            const linha = tracados[r.slug]
            if (!linha) return null
            return (
              <Marker
                key={`selo-${r.slug}`}
                position={linha[Math.floor(linha.length / 2)]}
                icon={iconeLugar('rota', 28)}
                title={r.nome}
                alt={r.nome}
                zIndexOffset={300}
                eventHandlers={{ dblclick: () => setEnquadramento(limites(linha)) }}
              >
                <Popup>
                  <strong className="font-serif text-base">{r.nome}</strong>
                  <span className="block mt-1 text-sm">
                    {r.inicio} → {r.destino}
                  </span>
                  <span className="block text-sm">
                    {r.distanciaKm != null ? `${numero(r.distanciaKm)} km · ` : ''}
                    {r.totalEtapas} etapas
                  </span>
                  <button type="button" onClick={() => setEnquadramento(limites(linha))} className="mt-2 block text-sm font-semibold text-[#7a1f1f] underline">
                    Aproximar o mapa da rota
                  </button>
                  <Link href={`/peregrinacoes/${r.slug}`} className="block mt-1 text-sm">
                    Ver o roteiro etapa por etapa →
                  </Link>
                </Popup>
              </Marker>
            )
          })}

        {visiveis.map((l) => (
          <Marker key={`${l.tipo}:${l.slug}`} position={[l.latitude, l.longitude]} icon={iconeLugar(l.tipo)} title={l.nome} alt={l.nome}>
            <Popup>
              <strong className="font-serif text-base">{l.nome}</strong>
              {l.local && <span className="block mt-1 text-sm">{l.local}</span>}
              {l.quando && <span className="block text-sm">{l.quando}</span>}
              <Link href={hrefLocal(l)} className="block mt-2 text-sm">
                Conhecer →
              </Link>
            </Popup>
          </Marker>
        ))}

        {posicao && (
          <Marker position={posicao} icon={iconeLugar('usuario', 24)} title="Você está aqui" alt="Você está aqui" zIndexOffset={1000}>
            <Popup>Você está aqui.</Popup>
          </Marker>
        )}
      </MapaBase>

      {maisProximos.length > 0 && (
        <section aria-labelledby="proximos-titulo" className="rounded-2xl border border-cosmic-border bg-cosmic-surface/50 p-5">
          <h2 id="proximos-titulo" className="font-serif text-2xl text-neutral-50 mb-3">
            Mais perto de você
          </h2>
          <ul className="divide-y divide-cosmic-border">
            {maisProximos.map((l) => (
              <li key={`${l.tipo}:${l.slug}`} className="flex items-center justify-between gap-4 py-3">
                <span className="min-w-0">
                  <Link href={hrefLocal(l)} className="font-serif text-neutral-50 underline decoration-cosmic-gold/50 underline-offset-4 hover:text-cosmic-gold">
                    {l.nome}
                  </Link>
                  {l.local && <span className="block text-sm text-neutral-400">{l.local}</span>}
                </span>
                <span className="shrink-0 font-serif text-lg text-cosmic-gold">{numero(l.distancia)} km</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

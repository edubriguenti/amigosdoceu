/**
 * Mapa de uma rota de peregrinação: traçado por etapa, etapa em foco em vermelho,
 * etapas feitas em dourado, selos numerados no fim de cada etapa e as paradas da etapa em foco.
 *
 * Depende de `window`: importe com next/dynamic({ ssr: false }).
 */
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Marker, Polyline, Popup, Tooltip } from 'react-leaflet'
import MapaBase, { Enquadrar } from '../mapa/MapaBase'
import { CORES_MAPA, iconeEtapa, iconeLugar } from '../mapa/icones'
import { limites } from '../../lib/geo'
import { arquivoTrajeto } from '../../lib/peregrinacoesRegras'

export default function RotaMapa({ slug, nome, etapas, ativa, feitas, onSelecionar, className = '' }) {
  const [trajeto, setTrajeto] = useState(null)
  const [erro, setErro] = useState(false)
  // null = enquadra a etapa em foco; 'rota' = enquadra a rota inteira
  const [visao, setVisao] = useState('rota')

  useEffect(() => {
    let vivo = true
    fetch(arquivoTrajeto(slug))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => vivo && setTrajeto(d.etapas))
      .catch(() => vivo && setErro(true))
    return () => {
      vivo = false
    }
  }, [slug])

  // Ao trocar a etapa em foco, o mapa volta a acompanhar a etapa.
  useEffect(() => {
    if (ativa != null) setVisao(null)
  }, [ativa])

  const limitesDaRota = useMemo(() => (trajeto ? limites(trajeto.flat()) : null), [trajeto])
  const linhaAtiva = trajeto && ativa != null ? trajeto[ativa - 1] : null
  const enquadramento = visao === 'rota' || !linhaAtiva ? limitesDaRota : limites(linhaAtiva)
  const etapaAtiva = etapas.find((e) => e.numero === ativa)

  // Limites iniciais aproximados pelas pontas das etapas, enquanto o traçado carrega.
  const limitesIniciais = useMemo(() => limites(etapas.flatMap((e) => [e.inicio, e.fim]).filter(Boolean)), [etapas])

  return (
    <div className={`relative ${className}`}>
      <MapaBase limites={limitesIniciais} rotulo={`Mapa da rota ${nome}`} className="h-full">
        <Enquadrar limites={enquadramento} zoomMaximo={13} />

        {trajeto?.map((linha, i) => {
          const numero = i + 1
          if (numero === ativa) return null
          const feita = Boolean(feitas[numero])
          return (
            <Polyline
              key={`${numero}-${feita}`}
              positions={linha}
              pathOptions={{
                color: feita ? CORES_MAPA.feita : CORES_MAPA.tinta,
                weight: feita ? 4 : 3,
                opacity: feita ? 0.95 : 0.8,
                dashArray: feita ? null : '2 7',
                lineCap: 'round',
              }}
              eventHandlers={{ click: () => onSelecionar(numero) }}
            />
          )
        })}

        {linhaAtiva && (
          <>
            <Polyline positions={linhaAtiva} pathOptions={{ color: '#f4ead2', weight: 9, opacity: 0.9, lineCap: 'round' }} interactive={false} />
            <Polyline positions={linhaAtiva} pathOptions={{ color: CORES_MAPA.rota, weight: 5, opacity: 1, lineCap: 'round' }} interactive={false} />
          </>
        )}

        {etapas.map((e) =>
          e.fim ? (
            <Marker
              key={`fim-${e.numero}-${e.numero === ativa ? 'ativa' : feitas[e.numero] ? 'feita' : 'normal'}`}
              position={e.fim}
              icon={iconeEtapa(e.numero, e.numero === ativa ? 'ativa' : feitas[e.numero] ? 'feita' : 'normal')}
              zIndexOffset={e.numero === ativa ? 500 : 0}
              eventHandlers={{ click: () => onSelecionar(e.numero) }}
              keyboard={false}
            >
              <Tooltip direction="top">
                Etapa {e.numero}: {e.destino}
              </Tooltip>
            </Marker>
          ) : null
        )}

        {etapaAtiva?.paradas
          .filter((p) => p.coord)
          .map((p) => (
            <Marker key={`${etapaAtiva.numero}-${p.nome}`} position={p.coord} icon={iconeLugar(p.tipo, 28)} zIndexOffset={800}>
              <Popup>
                <strong className="font-serif">{p.nome}</strong>
                {p.nota && <span className="block mt-1 text-sm">{p.nota}</span>}
                {p.href && (
                  <Link href={p.href} className="block mt-2 text-sm">
                    Conhecer →
                  </Link>
                )}
              </Popup>
            </Marker>
          ))}
      </MapaBase>

      <div className="absolute top-4 right-4 z-[500] flex flex-col items-end gap-2">
        {visao !== 'rota' && limitesDaRota && (
          <button
            type="button"
            onClick={() => setVisao('rota')}
            className="inline-flex min-h-[44px] items-center rounded-full border border-[#8a6a3a] bg-[#f1e6cb] px-4 py-1.5 text-xs font-semibold text-[#3b2f24] shadow hover:bg-[#e6d7b5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a1c1c]"
          >
            Ver rota inteira
          </button>
        )}
      </div>

      {!trajeto && (
        <p className="absolute bottom-4 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-[#8a6a3a] bg-[#f1e6cb] px-3 py-1 text-xs text-[#3b2f24] shadow" role="status">
          {erro ? 'Não foi possível carregar o traçado.' : 'Desenhando o caminho…'}
        </p>
      )}
    </div>
  )
}

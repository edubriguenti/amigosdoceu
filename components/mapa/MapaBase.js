/**
 * Base do mapa antigo de peregrino: Leaflet + tiles do OpenStreetMap com tom sépia,
 * moldura e textura de pergaminho (estilos em styles/globals.css, `.mapa-antigo`).
 *
 * Depende de `window`: importe sempre com next/dynamic({ ssr: false }), como fazem
 * components/MapaInterativo.js e components/peregrinacoes/RotaMapa.js.
 */
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

/** Ajusta o enquadramento quando `limites` muda ([[latMin, lngMin], [latMax, lngMax]]). */
export function Enquadrar({ limites, margem = 40, zoomMaximo = 14 }) {
  const map = useMap()
  const chave = limites ? limites.flat().join(',') : ''
  useEffect(() => {
    if (!limites) return
    // O contêiner pode ter mudado de tamanho desde o último cálculo (layout fixo, rotação).
    map.invalidateSize({ animate: false })
    const semMovimento = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    map.flyToBounds(limites, { padding: [margem, margem], maxZoom: zoomMaximo, duration: semMovimento ? 0 : 0.8 })
    // `chave` resume `limites`: evita refazer o voo a cada render com um array novo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, map, margem, zoomMaximo])
  return null
}

/** Recalcula o tamanho do mapa quando o contêiner muda (layout fixo/sticky, rotação do celular). */
function AjustarTamanho() {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer()
    if (typeof ResizeObserver === 'undefined') return
    const obs = new ResizeObserver(() => map.invalidateSize({ animate: false }))
    obs.observe(el)
    return () => obs.disconnect()
  }, [map])
  return null
}

export default function MapaBase({ centro = [20, 0], zoom = 2, limites = null, rolarComRoda = true, rotulo = 'Mapa', className = '', children }) {
  return (
    <div className={`mapa-moldura ${className}`}>
      <div className="mapa-antigo" role="region" aria-label={rotulo}>
        <MapContainer
          center={centro}
          zoom={zoom}
          bounds={limites || undefined}
          boundsOptions={{ padding: [30, 30] }}
          scrollWheelZoom={rolarComRoda}
          // Altura já no primeiro render: sem isso o Leaflet inicia com tamanho zero e
          // calcula o enquadramento e o recorte das linhas errados.
          style={{ height: '100%', width: '100%' }}
          minZoom={2}
          zoomSnap={0.5}
          worldCopyJump
        >
          <TileLayer
            attribution='&copy; colaboradores do <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AjustarTamanho />
          {children}
        </MapContainer>
      </div>
    </div>
  )
}

/**
 * Esboço de uma rota (o traçado reduzido a um <path> pequeno) para os cartões.
 * Server-only: lê public/rotas/<slug>/trajeto.json com `fs` — use só em getStaticProps.
 */
import fs from 'node:fs'
import path from 'node:path'
import { simplificar } from './geo'

const LARGURA = 300
const ALTURA = 110
const MARGEM = 12

/** { d, inicio: [x, y], fim: [x, y] } em viewBox 0 0 300 110, ou null se o traçado não existir. */
export function esbocoDaRota(slug) {
  const arquivo = path.join(process.cwd(), 'public', 'rotas', slug, 'trajeto.json')
  if (!fs.existsSync(arquivo)) return null
  const pontos = JSON.parse(fs.readFileSync(arquivo, 'utf8')).etapas.flat()
  if (pontos.length < 2) return null

  // Tolerância proporcional ao tamanho da rota: o esboço fica com poucas dezenas de pontos.
  const lats = pontos.map((p) => p[0])
  const lngs = pontos.map((p) => p[1])
  const [latMin, latMax, lngMin, lngMax] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)]
  const fatorLng = Math.cos(((latMin + latMax) / 2) * (Math.PI / 180))
  const larguraGraus = (lngMax - lngMin) * fatorLng
  const alturaGraus = latMax - latMin
  const linha = simplificar(pontos, Math.max(larguraGraus, alturaGraus) * 111320 * 0.004)

  const escala = Math.min((LARGURA - 2 * MARGEM) / larguraGraus, (ALTURA - 2 * MARGEM) / alturaGraus)
  const dx = (LARGURA - larguraGraus * escala) / 2
  const dy = (ALTURA - alturaGraus * escala) / 2
  const xy = ([lat, lng]) => [+(dx + (lng - lngMin) * fatorLng * escala).toFixed(1), +(dy + (latMax - lat) * escala).toFixed(1)]
  const pts = linha.map(xy)
  return { d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(''), inicio: pts[0], fim: pts[pts.length - 1] }
}

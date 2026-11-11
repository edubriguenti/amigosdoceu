/**
 * Geometria simples sobre coordenadas [lat, lng] — lógica pura (sem React, sem JSON).
 * Usada pelo mapa, pelas páginas de peregrinação e por scripts/build-rota.mjs.
 */

const RAIO_TERRA_KM = 6371
const RAD = Math.PI / 180

/** Distância em km entre dois pontos (fórmula de Haversine). */
export function distanciaKm(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * RAD
  const dLon = (lon2 - lon1) * RAD
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2
  return 2 * RAIO_TERRA_KM * Math.asin(Math.sqrt(a))
}

/** Comprimento em km de uma linha [[lat, lng], …]. */
export function comprimentoKm(pontos) {
  let total = 0
  for (let i = 1; i < pontos.length; i++) {
    total += distanciaKm(pontos[i - 1][0], pontos[i - 1][1], pontos[i][0], pontos[i][1])
  }
  return total
}

/** Caixa envolvente [[latMin, lngMin], [latMax, lngMax]] de uma linha (null se vazia). */
export function limites(pontos) {
  if (!pontos?.length) return null
  let [latMin, lngMin, latMax, lngMax] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const [lat, lng] of pontos) {
    if (lat < latMin) latMin = lat
    if (lat > latMax) latMax = lat
    if (lng < lngMin) lngMin = lng
    if (lng > lngMax) lngMax = lng
  }
  return [[latMin, lngMin], [latMax, lngMax]]
}

/**
 * Simplifica uma linha (Douglas-Peucker) com tolerância em metros.
 * Iterativo (sem recursão) para aguentar rotas com dezenas de milhares de pontos.
 */
export function simplificar(pontos, toleranciaM) {
  if (pontos.length < 3) return pontos.slice()
  const latMedia = pontos.reduce((s, p) => s + p[0], 0) / pontos.length
  const mPorGrauLat = 111320
  const mPorGrauLng = 111320 * Math.cos(latMedia * RAD)
  const xy = pontos.map(([lat, lng]) => [lng * mPorGrauLng, lat * mPorGrauLat])

  const distSegmento = (p, a, b) => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len2 = dx * dx + dy * dy
    if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1])
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2))
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
  }

  const manter = new Uint8Array(pontos.length)
  manter[0] = 1
  manter[pontos.length - 1] = 1
  const pilha = [[0, pontos.length - 1]]
  while (pilha.length) {
    const [ini, fim] = pilha.pop()
    let maior = 0
    let indice = -1
    for (let i = ini + 1; i < fim; i++) {
      const d = distSegmento(xy[i], xy[ini], xy[fim])
      if (d > maior) {
        maior = d
        indice = i
      }
    }
    if (indice !== -1 && maior > toleranciaM) {
      manter[indice] = 1
      pilha.push([ini, indice], [indice, fim])
    }
  }
  return pontos.filter((_, i) => manter[i])
}

/** Pontos igualmente espaçados (a cada `passoKm`) ao longo de uma linha, incluindo as pontas. */
export function amostrar(pontos, passoKm) {
  if (pontos.length < 2) return pontos.slice()
  const saida = [pontos[0]]
  let falta = passoKm
  for (let i = 1; i < pontos.length; i++) {
    let a = pontos[i - 1]
    const b = pontos[i]
    let seg = distanciaKm(a[0], a[1], b[0], b[1])
    while (seg >= falta && seg > 0) {
      const t = falta / seg
      a = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      saida.push(a)
      seg -= falta
      falta = passoKm
    }
    falta -= seg
  }
  const ultimo = pontos[pontos.length - 1]
  const fim = saida[saida.length - 1]
  if (fim[0] !== ultimo[0] || fim[1] !== ultimo[1]) saida.push(ultimo)
  return saida
}

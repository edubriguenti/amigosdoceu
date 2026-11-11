/**
 * Ícones do mapa antigo: selos de lacre com um desenho a traço (L.divIcon).
 * Só pode ser importado por componentes carregados sem SSR (dependem de `leaflet`).
 */
import L from 'leaflet'

export const CORES_MAPA = {
  igreja: '#7a4a21',
  aparicao: '#2f4a7d',
  santo: '#6b4c8a',
  local: '#8a1c1c',
  usuario: '#1f6f54',
  tinta: '#5c4b36',
  rota: '#8a1c1c',
  feita: '#b8860b',
}

const traco = (largura = 1.8) => `fill="none" stroke="currentColor" stroke-width="${largura}" stroke-linecap="round" stroke-linejoin="round"`

const DESENHOS = {
  // Igreja: torre com cruz
  igreja: `<svg viewBox="0 0 24 24" ${traco()} aria-hidden="true"><path d="M12 2v4M10.3 3.6h3.4M12 6l-5.5 5v9h11v-9z"/><path d="M10.2 20v-4a1.8 1.8 0 0 1 3.6 0v4"/></svg>`,
  // Aparição: estrela mariana
  aparicao: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l2.3 5.9 6.3.4-4.9 4 1.6 6.1L12 15.6 6.7 19l1.6-6.1-4.9-4 6.3-.4z"/></svg>`,
  // Santo: auréola sobre o busto
  santo: `<svg viewBox="0 0 24 24" ${traco()} aria-hidden="true"><ellipse cx="12" cy="5" rx="4.5" ry="1.6"/><circle cx="12" cy="11" r="3"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>`,
  // Parada à beira do caminho: cruz latina
  local: `<svg viewBox="0 0 24 24" ${traco(2.4)} aria-hidden="true"><path d="M12 3v18M7 8.5h10"/></svg>`,
  // Rota de peregrinação: concha de vieira
  rota: `<svg viewBox="0 0 24 24" ${traco(1.6)} aria-hidden="true"><path d="M12 20.5L4.2 10a8.4 8.4 0 0 1 15.6 0z"/><path d="M12 20.5V5.6M12 20.5L7.6 6.8M12 20.5l4.4-13.7"/></svg>`,
  // Você está aqui
  usuario: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="5"/></svg>`,
}

const cache = new Map()

/** Selo com desenho para um tipo de lugar: 'igreja' | 'aparicao' | 'santo' | 'local' | 'rota' | 'usuario'. */
export function iconeLugar(tipo, tamanho = 30) {
  const chave = `${tipo}:${tamanho}`
  if (!cache.has(chave)) {
    const t = DESENHOS[tipo] ? tipo : 'local'
    cache.set(
      chave,
      L.divIcon({
        className: '',
        html: `<div class="selo-mapa" style="background:${CORES_MAPA[t]}">${DESENHOS[t]}</div>`,
        iconSize: [tamanho, tamanho],
        iconAnchor: [tamanho / 2, tamanho / 2],
        popupAnchor: [0, -tamanho / 2],
        tooltipAnchor: [0, -tamanho / 2],
      })
    )
  }
  return cache.get(chave)
}

/** Selo numerado do fim de cada etapa. estado: 'normal' | 'ativa' | 'feita'. */
export function iconeEtapa(numero, estado = 'normal') {
  const chave = `etapa:${numero}:${estado}`
  if (!cache.has(chave)) {
    const tamanho = estado === 'ativa' ? 30 : 22
    const estilo =
      estado === 'ativa'
        ? `background:${CORES_MAPA.rota};font-size:13px`
        : estado === 'feita'
          ? `background:${CORES_MAPA.feita};font-size:10px`
          : 'font-size:10px'
    cache.set(
      chave,
      L.divIcon({
        className: '',
        html: `<div class="selo-mapa ${estado === 'normal' ? 'selo-mapa--papel' : ''}" style="${estilo}">${numero}</div>`,
        iconSize: [tamanho, tamanho],
        iconAnchor: [tamanho / 2, tamanho / 2],
        tooltipAnchor: [0, -tamanho / 2],
      })
    )
  }
  return cache.get(chave)
}

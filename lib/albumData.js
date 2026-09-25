import album from '../data/album/album.json'
import santos from '../data/santos.json'
import aparicoes from '../data/aparicoes.json'
import igrejas from '../data/igrejas.json'
import vidaCristo from '../data/vida-cristo.json'
import calendario from '../data/calendario-liturgico.json'
import { getCelebracaoDoDia } from './calendarUtils'
import { construirCatalogo, escolherFigurinhaDoDia } from './albumCatalogo'

export { formatarNumero, rotacaoPorId, TIPO_LABEL, RARIDADES } from './albumCatalogo'

// Catálogo montado uma única vez. Figurinhas, páginas e volume são congelados (somente leitura).
const catalogo = construirCatalogo({ album, santos, aparicoes, igrejas, vidaCristo, calendario })

if (catalogo.erros.length && process.env.NODE_ENV !== 'production') {
  catalogo.erros.forEach((e) => console.warn(`Álbum: ${e}`))
}

export function getVolume() {
  return catalogo.volume
}

export function getPaginas() {
  return catalogo.paginas
}

export function getPaginaBySlug(slug) {
  return catalogo.paginasBySlug.get(slug) || null
}

export function getFigurinhas() {
  return catalogo.figurinhas
}

export function getFigurinhasDaPagina(slug) {
  const pagina = getPaginaBySlug(slug)
  return pagina ? pagina.figurinhaIds.map((id) => catalogo.byId.get(id)) : []
}

export function getFigurinhaById(id) {
  return catalogo.byId.get(id) || null
}

export function getFigurinhaPorRef(tipo, slug) {
  return catalogo.byId.get(`${tipo}:${slug}`) || null
}

export function getTotalFigurinhas() {
  return catalogo.figurinhas.length
}

export function getFigurinhaDoDia(date = new Date()) {
  const celebracao = getCelebracaoDoDia(date)
  return escolherFigurinhaDoDia(catalogo, date, celebracao?.santos || [])
}

/**
 * Link para a figurinha dentro do álbum (abre o modal direto nela).
 * Sempre usar este helper — nunca interpolar o id na URL.
 */
export function hrefFigurinha(figurinha) {
  return `/album-sagrado/${figurinha.paginaSlug}?${new URLSearchParams({ figurinha: figurinha.id })}`
}

/**
 * Estatísticas do progresso a partir do mapa `coletadas` do useAlbum.
 * Só conta ids que existem no catálogo (progresso legado de santos ainda não
 * cadastrados fica guardado, mas fora da contagem).
 */
export function calcularStats(coletadas = {}) {
  const porPagina = {}
  let total = 0
  catalogo.paginas.forEach((p) => {
    const n = p.figurinhaIds.filter((id) => coletadas[id]).length
    porPagina[p.slug] = { coletadas: n, total: p.figurinhaIds.length }
    total += n
  })
  return { coletadas: total, total: catalogo.figurinhas.length, porPagina }
}

/**
 * Resumo serializável de uma figurinha para páginas fora do álbum (via getStaticProps),
 * evitando carregar o catálogo inteiro no bundle dessas páginas.
 */
export function resumoFigurinha(tipo, slug) {
  const f = getFigurinhaPorRef(tipo, slug)
  if (!f) return null
  return {
    id: f.id,
    numero: f.numero,
    nome: f.nome,
    imagem: f.imagem,
    raridade: f.raridade,
    subtitulo: f.subtitulo,
    href: hrefFigurinha(f),
  }
}

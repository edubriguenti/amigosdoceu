/**
 * Leitores somente-leitura do progresso local de outras áreas, para Minha Jornada.
 *
 * Funções puras em relação ao React: nada de hooks, nada de escrita. Cada leitor tolera
 * localStorage ausente, bloqueado ou corrompido e devolve um padrão — nenhum cartão
 * pode derrubar a página. Não use useRosario aqui: o efeito de gravação dele escreve
 * no mount.
 */
import { idFigurinha } from './albumCatalogo'

export const ROSARIO_KEY = 'rosario-data'
export const INTENCOES_KEY = 'amigos-do-ceu-intencoes'

function lerJson(chave) {
  try {
    const raw = localStorage.getItem(chave)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const numero = (v) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : 0)

export const ROSARIO_PADRAO = Object.freeze({
  completos: 0,
  tempoTotal: 0,
  ultimo: null,
  emProgresso: false,
  misterioAtual: null,
})

/** { completos, tempoTotal (s), ultimo (ISO|null), emProgresso, misterioAtual } */
export function getRosarioStats() {
  const d = lerJson(ROSARIO_KEY)
  if (!d || typeof d !== 'object') return ROSARIO_PADRAO
  const e = d.estatisticas && typeof d.estatisticas === 'object' ? d.estatisticas : {}
  return {
    completos: numero(e.rosariosCompletos),
    tempoTotal: numero(e.tempoTotal),
    ultimo: typeof e.ultimoRosario === 'string' ? e.ultimoRosario : null,
    emProgresso: d.emProgresso === true,
    misterioAtual: typeof d.misterioAtual === 'string' ? d.misterioAtual : null,
  }
}

export const INTENCOES_PADRAO = Object.freeze({ total: 0, rezadasNaSemana: 0, atendidas: 0 })

/** { total, rezadasNaSemana (intenções com "Rezei por isto" nos últimos 7 dias), atendidas } */
export function getIntencoesResumo(hoje = new Date()) {
  const lista = lerJson(INTENCOES_KEY)
  if (!Array.isArray(lista)) return INTENCOES_PADRAO
  const validas = lista.filter((i) => i && typeof i.texto === 'string')
  const limite = new Date(hoje)
  limite.setDate(limite.getDate() - 7)
  const desde = `${limite.getFullYear()}-${String(limite.getMonth() + 1).padStart(2, '0')}-${String(limite.getDate()).padStart(2, '0')}`
  return {
    total: validas.length,
    rezadasNaSemana: validas.filter((i) => typeof i.ultimaVez === 'string' && i.ultimaVez > desde).length,
    atendidas: validas.filter((i) => i.atendida === true).length,
  }
}

/**
 * Progresso na Vida de Cristo, derivado das figurinhas `cristo` coletadas no álbum
 * (abrir um evento cola a figurinha dele). `eventos` = [{ slug, titulo }] em ordem.
 * `proximo` é o primeiro evento ainda não visto (ou null se todos foram vistos).
 */
export function getProgressoCristo(coletadas = {}, eventos = []) {
  const visto = (e) => Boolean(coletadas?.[idFigurinha('cristo', e.slug)])
  const vistos = eventos.filter(visto).length
  return { vistos, total: eventos.length, proximo: eventos.find((e) => !visto(e)) || null }
}

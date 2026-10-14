/**
 * Leitores somente-leitura do progresso local de outras áreas, para Minha Jornada.
 *
 * Funções puras em relação ao React: nada de hooks, nada de escrita. Cada leitor tolera
 * localStorage ausente, bloqueado ou corrompido e devolve um padrão — nenhum cartão
 * pode derrubar a página. Não use useRosario aqui: o efeito de gravação dele escreve
 * no mount.
 */
import { idFigurinha } from './albumCatalogo'
import { diaLocal } from './datas'

export const ROSARIO_KEY = 'rosario-data'
export const INTENCOES_KEY = 'amigos-do-ceu-intencoes'
export const NOVENAS_KEY = 'amigos-do-ceu-novenas'

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

/**
 * Novenas em andamento (as mais recentemente tocadas primeiro), para o bloco "Hoje".
 * `hoje` = data ISO do dia exibido. `rezouHoje` = último dia marcado foi hoje (no fuso do usuário);
 * `pronta` = todos os dias marcados, falta só finalizar.
 */
export function getNovenasEmAndamento(hoje = diaLocal()) {
  const d = lerJson(NOVENAS_KEY)
  if (!d || !Array.isArray(d.emProgresso)) return []
  return d.emProgresso
    .filter((n) => n && typeof n.slug === 'string' && typeof n.nome === 'string')
    .map((n) => {
      const duracao = Number(n.duracao) > 0 ? Number(n.duracao) : 9
      const marcados = Array.isArray(n.diasCompletados) ? n.diasCompletados.length : 0
      const toque = new Date(n.ultimaAtualizacao || n.dataInicio || NaN)
      return {
        slug: n.slug,
        nome: n.nome,
        duracao,
        marcados,
        diaAtual: Math.min(Math.max(Number(n.diaAtual) || 1, 1), duracao),
        pronta: marcados >= duracao,
        rezouHoje: marcados > 0 && !Number.isNaN(toque.getTime()) && diaLocal(toque) === hoje,
        toque: Number.isNaN(toque.getTime()) ? 0 : toque.getTime(),
      }
    })
    .sort((a, b) => b.toque - a.toque)
}

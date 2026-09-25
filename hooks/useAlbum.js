import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { LEGACY_MAP } from '../lib/albumCatalogo'
import { diaLocal } from '../lib/datas'
import { oracaoRegistradaHoje } from './useOracoes'

/**
 * Progresso do Álbum Sagrado.
 *
 * O localStorage é a fonte da verdade e toda mutação lê → decide → grava de forma
 * SÍNCRONA. Isso torna as operações idempotentes mesmo com efeitos executados duas
 * vezes (React Strict Mode) ou chamados de várias páginas/abas:
 *   coletar(id) duas vezes → { nova: true } e depois { nova: false }, um único registro.
 *
 * A chave de persistência é sempre o id "tipo:slug" — nunca o número da figurinha.
 */

const STORAGE_KEY = 'amigos-do-ceu:album'
const LEGACY_DESBLOQUEIOS_KEY = 'album-sagrado-desbloqueios'

const ESTADO_INICIAL = Object.freeze({
  coletadas: {},
  novas: [],
  figurinhaDoDiaResgatada: null,
  migradoLegado: false,
})

let cache = null
const listeners = new Set()

/** Garante o formato e a invariante novas ⊆ coletadas (sem duplicatas). */
function normalizar(bruto) {
  const e = { ...ESTADO_INICIAL, ...(bruto || {}) }
  const coletadas = e.coletadas && typeof e.coletadas === 'object' ? e.coletadas : {}
  const novas = Array.isArray(e.novas) ? [...new Set(e.novas)].filter((id) => coletadas[id]) : []
  return { ...e, coletadas, novas }
}

/**
 * Migração única do álbum antigo. Só `album-sagrado-desbloqueios` representa progresso
 * real (figurinhas destravadas rezando). As chaves antigas NÃO são apagadas.
 * Refs que ainda não existem no catálogo ficam guardados com origem 'legado'.
 */
function migrarLegado(estado) {
  if (estado.migradoLegado) return estado
  const coletadas = { ...estado.coletadas }
  const novas = [...estado.novas]
  try {
    const raw = localStorage.getItem(LEGACY_DESBLOQUEIOS_KEY)
    const legado = raw ? JSON.parse(raw) : {}
    const em = new Date().toISOString()
    Object.entries(legado).forEach(([idAntigo, desbloqueado]) => {
      if (desbloqueado !== true) return
      const ref = LEGACY_MAP[idAntigo]
      if (!ref) {
        console.warn('Álbum: id legado sem correspondência', idAntigo)
        return
      }
      if (!coletadas[ref]) {
        coletadas[ref] = { em, origem: 'legado' }
        novas.push(ref)
      }
    })
  } catch (e) {
    console.error('Álbum: erro ao migrar progresso antigo:', e)
  }
  return normalizar({ ...estado, coletadas, novas, migradoLegado: true })
}

function lerDoStorage() {
  let estado = normalizar(null)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) estado = normalizar(JSON.parse(raw))
  } catch (e) {
    console.error('Álbum: erro ao carregar progresso:', e)
  }
  if (!estado.migradoLegado) {
    estado = migrarLegado(estado)
    gravarNoStorage(estado)
  }
  return estado
}

function gravarNoStorage(estado) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
  } catch (e) {
    console.error('Álbum: erro ao salvar progresso:', e)
  }
}

function getEstado() {
  if (typeof window === 'undefined') return ESTADO_INICIAL
  if (!cache) cache = lerDoStorage()
  return cache
}

function setEstado(novo) {
  cache = normalizar(novo)
  gravarNoStorage(cache)
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = lerDoStorage()
      listeners.forEach((l) => l())
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const getServerSnapshot = () => ESTADO_INICIAL

/* ---------- Mutações (idempotentes) ---------- */

export function coletar(id, origem = 'visita') {
  if (!id || typeof window === 'undefined') return { nova: false }
  const atual = getEstado()
  if (atual.coletadas[id]) return { nova: false }
  setEstado({
    ...atual,
    coletadas: { ...atual.coletadas, [id]: { em: new Date().toISOString(), origem } },
    novas: [...atual.novas, id],
  })
  return { nova: true }
}

export function marcarVista(id) {
  const atual = getEstado()
  if (!atual.novas.includes(id)) return
  setEstado({ ...atual, novas: atual.novas.filter((n) => n !== id) })
}

/**
 * Resgata a figurinha do dia: no máximo uma vez por data local.
 *
 * Regra: a figurinha do dia só vem de rezar a oração do dia. Recebe a figurinha oficial
 * `{ id, data, oracaoRef }` como veio do servidor (lib/hoje.js → montarDia) e recusa se:
 * - `data` não é o dia local de hoje                      → motivo 'outro-dia'
 * - a oração do dia (`oracaoRef`) não foi registrada hoje  → motivo 'sem-oracao'
 * - a figurinha de hoje já foi recebida                    → motivo 'ja-resgatada'
 * Quem orquestra o fluxo é components/OracaoDoDiaModal.js.
 */
export function resgatarFigurinhaDoDia(figurinhaDoDia, date = new Date()) {
  const hoje = diaLocal(date)
  if (!figurinhaDoDia?.id || figurinhaDoDia.data !== hoje) return { ok: false, nova: false, motivo: 'outro-dia' }
  if (!oracaoRegistradaHoje(figurinhaDoDia.oracaoRef)) return { ok: false, nova: false, motivo: 'sem-oracao' }
  const atual = getEstado()
  if (atual.figurinhaDoDiaResgatada === hoje) return { ok: false, nova: false, motivo: 'ja-resgatada' }
  setEstado({ ...atual, figurinhaDoDiaResgatada: hoje })
  const { nova } = coletar(figurinhaDoDia.id, 'dia')
  return { ok: true, nova }
}

export function useAlbum() {
  const estado = useSyncExternalStore(subscribe, getEstado, getServerSnapshot)
  // `loaded` só vira true após a hidratação — use para evitar mismatch SSR/cliente.
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])

  const isColetada = useCallback((id) => Boolean(estado.coletadas[id]), [estado])
  const isNova = useCallback((id) => estado.novas.includes(id), [estado])

  return {
    loaded,
    estado,
    isColetada,
    isNova,
    coletar,
    marcarVista,
    resgatarFigurinhaDoDia,
    figurinhaDoDiaJaResgatada: estado.figurinhaDoDiaResgatada === diaLocal(),
  }
}

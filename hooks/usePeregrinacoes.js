import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { diaLocal } from '../lib/datas'
import { PEREGRINACOES_KEY, normalizarPeregrinacoes } from '../lib/jornada'

/**
 * Progresso das peregrinações: etapas que o peregrino marcou como feitas.
 *
 * Formato (chave `amigos-do-ceu:peregrinacoes`):
 *   { [rotaSlug]: { feitas: { [numeroDaEtapa]: 'YYYY-MM-DD' } } }
 *
 * Mesmo padrão de hooks/useAlbum.js: o localStorage é a fonte da verdade e toda
 * mutação lê → decide → grava de forma SÍNCRONA (idempotente sob Strict Mode e entre abas).
 * Marcar uma etapa só registra progresso — não dá figurinha nem conta como oração rezada.
 */

const VAZIO = Object.freeze({})
let cache = null
const listeners = new Set()

function lerDoStorage() {
  try {
    const raw = localStorage.getItem(PEREGRINACOES_KEY)
    return normalizarPeregrinacoes(raw ? JSON.parse(raw) : null)
  } catch (e) {
    console.error('Peregrinações: erro ao carregar progresso:', e)
    return {}
  }
}

function getEstado() {
  if (typeof window === 'undefined') return VAZIO
  if (!cache) cache = lerDoStorage()
  return cache
}

function setEstado(novo) {
  cache = normalizarPeregrinacoes(novo)
  try {
    localStorage.setItem(PEREGRINACOES_KEY, JSON.stringify(cache))
  } catch (e) {
    console.error('Peregrinações: erro ao salvar progresso:', e)
  }
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (e) => {
    if (e.key === PEREGRINACOES_KEY || e.key === null) {
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

const getServerSnapshot = () => VAZIO

/** Marca ou desmarca uma etapa. Devolve { feita } com o novo estado. */
export function alternarEtapa(rotaSlug, numero) {
  if (!rotaSlug || !Number.isInteger(numero) || typeof window === 'undefined') return { feita: false }
  const atual = getEstado()
  const feitas = { ...(atual[rotaSlug]?.feitas || {}) }
  const feita = !feitas[numero]
  if (feita) feitas[numero] = diaLocal()
  else delete feitas[numero]
  setEstado({ ...atual, [rotaSlug]: { feitas } })
  return { feita }
}

export function usePeregrinacoes() {
  const estado = useSyncExternalStore(subscribe, getEstado, getServerSnapshot)
  // `loaded` só vira true após a hidratação — use para evitar mismatch SSR/cliente.
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])

  /** { [numero]: 'YYYY-MM-DD' } das etapas feitas da rota. */
  const feitasDe = useCallback((rotaSlug) => estado[rotaSlug]?.feitas || VAZIO, [estado])

  return { loaded, estado, feitasDe, alternarEtapa }
}

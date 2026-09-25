import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { diaLocal } from '../lib/datas'
import { ESTADO_VAZIO, normalizar, registrarOracaoNoEstado, resumirOracoes, rezouNoDia } from '../lib/oracoesRezadas'

/**
 * Orações rezadas pelo usuário (regras em lib/oracoesRezadas.js).
 *
 * Mesmo padrão do useAlbum: o localStorage é a fonte da verdade e as mutações leem →
 * decidem → gravam de forma SÍNCRONA (idempotentes com Strict Mode, várias páginas/abas).
 *
 * A data nunca vem de fora: registrarOracaoHoje() usa sempre diaLocal(), então nenhum
 * componente consegue registrar uma oração retroativa.
 */

const STORAGE_KEY = 'amigos-do-ceu:oracoes'

let cache = null
const listeners = new Set()

function lerDoStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizar(JSON.parse(raw)) : normalizar(null)
  } catch (e) {
    console.error('Orações: erro ao carregar:', e)
    return normalizar(null)
  }
}

function getEstado() {
  if (typeof window === 'undefined') return ESTADO_VAZIO
  if (!cache) cache = lerDoStorage()
  return cache
}

function setEstado(novo) {
  cache = novo
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novo))
  } catch (e) {
    console.error('Orações: erro ao salvar:', e)
  }
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

const getServerSnapshot = () => ESTADO_VAZIO

/** Registra que `ref` foi rezada hoje (dia local). Idempotente: { nova }. */
export function registrarOracaoHoje(ref) {
  if (!ref || typeof window === 'undefined') return { nova: false }
  const { estado, nova } = registrarOracaoNoEstado(getEstado(), ref, diaLocal())
  if (nova) setEstado(estado)
  return { nova }
}

/** `ref` já foi rezada hoje? Leitura síncrona do storage (usada pelo resgate do álbum). */
export function oracaoRegistradaHoje(ref) {
  if (!ref || typeof window === 'undefined') return false
  return rezouNoDia(getEstado(), ref, diaLocal())
}

export function useOracoes() {
  const estado = useSyncExternalStore(subscribe, getEstado, getServerSnapshot)
  // `loaded` só vira true após a hidratação — use para evitar mismatch SSR/cliente.
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])

  const rezouHoje = useCallback((ref) => rezouNoDia(estado, ref, diaLocal()), [estado])
  const resumo = useMemo(() => resumirOracoes(estado, diaLocal()), [estado])

  return { loaded, rezouHoje, resumo, registrarOracaoHoje }
}

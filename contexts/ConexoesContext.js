import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useProgresso } from '../hooks/useProgresso'
import { useTTS } from '../hooks/useTTS'
import { getAllConexoes, getConexaoBySlug, getConexoesByEvento } from '../lib/conexoesData'

const ConexoesContext = createContext(null)

export function ConexoesProvider({ children }) {
  const router = useRouter()
  const progresso = useProgresso()
  const tts = useTTS()

  const todasConexoes = useMemo(() => getAllConexoes(), [])

  const [eventoAtivo, setEventoAtivoState] = useState(null)
  const [conexaoAtiva, setConexaoAtivaState] = useState(todasConexoes[0])
  const [descobertaRecente, setDescobertaRecente] = useState(null)

  const conexoesFiltradas = useMemo(
    () => (eventoAtivo ? getConexoesByEvento(eventoAtivo) : todasConexoes),
    [eventoAtivo, todasConexoes]
  )

  // Deep-link: ?ref=<slug>
  useEffect(() => {
    if (!router.isReady) return
    const ref = router.query.ref
    if (typeof ref === 'string') {
      const c = getConexaoBySlug(ref)
      if (c) {
        setConexaoAtivaState(c)
        setEventoAtivoState(c.eventoId)
      }
    }
  }, [router.isReady, router.query.ref])

  // Registrar visualização sempre que conexão muda (após hidratação)
  useEffect(() => {
    if (!progresso.loaded || !conexaoAtiva) return
    const r = progresso.registrarVisualizacao(conexaoAtiva.id)
    if (!r.jaDescoberta) {
      setDescobertaRecente({ conexao: conexaoAtiva, xpGanho: r.xpGanho })
    }
    tts.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conexaoAtiva?.id, progresso.loaded])

  const setEventoAtivo = useCallback(
    (id) => {
      setEventoAtivoState((prev) => (prev === id ? null : id))
      const filtradas = id ? getConexoesByEvento(id) : todasConexoes
      if (filtradas.length > 0) {
        setConexaoAtivaState(filtradas[0])
      }
    },
    [todasConexoes]
  )

  const setConexaoAtiva = useCallback(
    (c) => {
      setConexaoAtivaState(c)
      router.replace({ pathname: '/conexoes', query: { ref: c.slug } }, undefined, { shallow: true })
    },
    [router]
  )

  const proximaConexao = useCallback(() => {
    if (!conexoesFiltradas.length) return
    const i = conexoesFiltradas.findIndex((c) => c.id === conexaoAtiva?.id)
    const next = conexoesFiltradas[(i + 1) % conexoesFiltradas.length]
    setConexaoAtiva(next)
  }, [conexoesFiltradas, conexaoAtiva, setConexaoAtiva])

  const conexaoAnterior = useCallback(() => {
    if (!conexoesFiltradas.length) return
    const i = conexoesFiltradas.findIndex((c) => c.id === conexaoAtiva?.id)
    const prev = conexoesFiltradas[(i - 1 + conexoesFiltradas.length) % conexoesFiltradas.length]
    setConexaoAtiva(prev)
  }, [conexoesFiltradas, conexaoAtiva, setConexaoAtiva])

  const limparDescoberta = useCallback(() => setDescobertaRecente(null), [])

  const value = {
    eventoAtivo,
    conexaoAtiva,
    conexoesFiltradas,
    setEventoAtivo,
    setConexaoAtiva,
    proximaConexao,
    conexaoAnterior,
    descobertaRecente,
    limparDescoberta,
    progresso,
    tts,
  }

  return <ConexoesContext.Provider value={value}>{children}</ConexoesContext.Provider>
}

export function useConexoes() {
  const ctx = useContext(ConexoesContext)
  if (!ctx) throw new Error('useConexoes deve ser usado dentro de ConexoesProvider')
  return ctx
}

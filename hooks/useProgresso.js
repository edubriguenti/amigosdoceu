import { useState, useEffect, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'amigos-do-ceu:progresso-conexoes'

const XP_POR_NIVEL = 200

const TITULOS = [
  { min: 1, max: 3, nome: 'Peregrino' },
  { min: 4, max: 7, nome: 'Buscador da Verdade' },
  { min: 8, max: 12, nome: 'Discípulo' },
  { min: 13, max: Infinity, nome: 'Guardião das Promessas' },
]

const ESTADO_INICIAL = {
  xp: 0,
  conexoesDescobertas: [],
  trilhasConcluidas: [],
  desafiosRespondidos: {},
  ultimaAtividade: null,
  streak: 0,
}

function tituloPorNivel(nivel) {
  const faixa = TITULOS.find((t) => nivel >= t.min && nivel <= t.max)
  return faixa ? faixa.nome : 'Peregrino'
}

function ymd(date) {
  return date.toISOString().slice(0, 10)
}

function diferencaDias(de, para) {
  const a = new Date(de + 'T00:00:00')
  const b = new Date(para + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

export function useProgresso() {
  const [estado, setEstado] = useState(ESTADO_INICIAL)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setEstado({ ...ESTADO_INICIAL, ...JSON.parse(raw) })
    } catch (e) {
      console.error('Erro ao carregar progresso:', e)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
    } catch (e) {
      console.error('Erro ao salvar progresso:', e)
    }
  }, [estado, loaded])

  const tocarAtividade = useCallback((prev) => {
    const hoje = ymd(new Date())
    if (prev.ultimaAtividade === hoje) return prev
    let streak = prev.streak
    if (prev.ultimaAtividade && diferencaDias(prev.ultimaAtividade, hoje) === 1) {
      streak += 1
    } else {
      streak = 1
    }
    return { ...prev, ultimaAtividade: hoje, streak }
  }, [])

  const registrarVisualizacao = useCallback(
    (conexaoId) => {
      let resultado = { jaDescoberta: true, xpGanho: 0 }
      setEstado((prev) => {
        if (prev.conexoesDescobertas.includes(conexaoId)) {
          return tocarAtividade(prev)
        }
        resultado = { jaDescoberta: false, xpGanho: 10 }
        const next = tocarAtividade({
          ...prev,
          xp: prev.xp + 10,
          conexoesDescobertas: [...prev.conexoesDescobertas, conexaoId],
        })
        return next
      })
      return resultado
    },
    [tocarAtividade]
  )

  const registrarDesafio = useCallback(
    (desafioId, acertou) => {
      const hoje = ymd(new Date())
      let xpGanho = 0
      setEstado((prev) => {
        if (prev.desafiosRespondidos[hoje]) return prev
        if (acertou) xpGanho = 25
        return tocarAtividade({
          ...prev,
          xp: prev.xp + xpGanho,
          desafiosRespondidos: {
            ...prev.desafiosRespondidos,
            [hoje]: { id: desafioId, acertou },
          },
        })
      })
      return { xpGanho }
    },
    [tocarAtividade]
  )

  const desafioRespondidoHoje = useMemo(() => {
    const hoje = ymd(new Date())
    return estado.desafiosRespondidos[hoje] || null
  }, [estado.desafiosRespondidos])

  const nivel = Math.floor(estado.xp / XP_POR_NIVEL) + 1
  const xpAtualNoNivel = estado.xp % XP_POR_NIVEL
  const xpProximoNivel = XP_POR_NIVEL
  const titulo = tituloPorNivel(nivel)

  const resetar = useCallback(() => {
    setEstado(ESTADO_INICIAL)
  }, [])

  return {
    loaded,
    xp: estado.xp,
    nivel,
    xpAtualNoNivel,
    xpProximoNivel,
    titulo,
    streak: estado.streak,
    conexoesDescobertas: estado.conexoesDescobertas,
    trilhasConcluidas: estado.trilhasConcluidas,
    desafiosRespondidos: estado.desafiosRespondidos,
    desafioRespondidoHoje,
    registrarVisualizacao,
    registrarDesafio,
    resetar,
  }
}

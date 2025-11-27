import { useState, useEffect } from 'react'

const STORAGE_KEY = 'album-sagrado-desbloqueios'
const ORACOES_KEY = 'album-sagrado-oracoes-completas'

export function useOracaoDesbloqueio() {
  const [desbloqueios, setDesbloqueios] = useState({})
  const [oracoesCompletas, setOracoesCompletas] = useState({})

  // Carregar desbloqueios do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setDesbloqueios(JSON.parse(saved))
        } catch (e) {
          console.error('Erro ao carregar desbloqueios:', e)
        }
      }

      const savedOracoes = localStorage.getItem(ORACOES_KEY)
      if (savedOracoes) {
        try {
          setOracoesCompletas(JSON.parse(savedOracoes))
        } catch (e) {
          console.error('Erro ao carregar orações completas:', e)
        }
      }
    }
  }, [])

  // Verificar se uma figurinha está desbloqueada
  const isDesbloqueada = (figurinhaId) => {
    return desbloqueios[figurinhaId] === true
  }

  // Verificar se uma oração foi completada
  const isOracaoCompleta = (figurinhaId) => {
    return oracoesCompletas[figurinhaId] === true
  }

  // Completar uma oração e desbloquear a figurinha
  const completarOracao = (figurinhaId) => {
    if (typeof window !== 'undefined') {
      const novosDesbloqueios = { ...desbloqueios, [figurinhaId]: true }
      const novasOracoes = { ...oracoesCompletas, [figurinhaId]: true }
      
      setDesbloqueios(novosDesbloqueios)
      setOracoesCompletas(novasOracoes)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosDesbloqueios))
      localStorage.setItem(ORACOES_KEY, JSON.stringify(novasOracoes))
      
      return true
    }
    return false
  }

  // Resetar desbloqueios (útil para testes)
  const resetarDesbloqueios = () => {
    if (typeof window !== 'undefined') {
      setDesbloqueios({})
      setOracoesCompletas({})
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(ORACOES_KEY)
    }
  }

  return {
    isDesbloqueada,
    isOracaoCompleta,
    completarOracao,
    resetarDesbloqueios,
    desbloqueios,
    oracoesCompletas
  }
}


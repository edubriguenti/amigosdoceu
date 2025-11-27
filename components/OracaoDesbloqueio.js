import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOracaoDesbloqueio } from '../hooks/useOracaoDesbloqueio'

export default function OracaoDesbloqueio({ figurinha, onDesbloqueio }) {
  const [tempoLeitura, setTempoLeitura] = useState(0)
  const [mostrarBotao, setMostrarBotao] = useState(false)
  const [completada, setCompletada] = useState(false)
  const { isOracaoCompleta, completarOracao } = useOracaoDesbloqueio()

  const jaCompletada = isOracaoCompleta(figurinha.id)

  // Calcular tempo mínimo de leitura (baseado no tamanho da oração)
  const tempoMinimo = Math.max(10, Math.ceil(figurinha.oracao.length / 20)) // ~20 caracteres por segundo

  const handleIniciarLeitura = () => {
    const intervalo = setInterval(() => {
      setTempoLeitura((prev) => {
        const novo = prev + 1
        if (novo >= tempoMinimo) {
          setMostrarBotao(true)
          clearInterval(intervalo)
        }
        return novo
      })
    }, 1000)
  }

  const handleCompletarOracao = () => {
    if (completarOracao(figurinha.id)) {
      setCompletada(true)
      if (onDesbloqueio) {
        setTimeout(() => {
          onDesbloqueio(figurinha)
        }, 500)
      }
    }
  }

  if (jaCompletada || completada) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400 rounded-lg p-6 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6 }}
          className="text-5xl mb-4"
        >
          ✅
        </motion.div>
        <h3 className="text-xl font-serif text-green-800 mb-2">Oração Completada!</h3>
        <p className="text-sm text-green-700">
          {figurinha.nome} foi desbloqueado(a)!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-secondary-50 border-2 border-secondary-300 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🙏</div>
        <h3 className="text-xl font-serif text-secondary-800 mb-2">
          Faça a Oração para Desbloquear
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Leia a oração com devoção para desbloquear <strong>{figurinha.nome}</strong>
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-secondary-500 shadow-sm">
        <div className="prose max-w-none">
          <p className="text-gray-800 italic leading-relaxed text-lg text-center">
            {figurinha.oracao}
          </p>
        </div>
      </div>

      {tempoLeitura === 0 ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleIniciarLeitura}
          className="w-full py-4 bg-secondary-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-secondary-600 transition-colors"
        >
          Iniciar Oração
        </motion.button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tempo de leitura</span>
              <span className="text-sm font-semibold text-secondary-700">
                {tempoLeitura}s / {tempoMinimo}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(tempoLeitura / tempoMinimo) * 100}%` }}
                className="bg-secondary-500 h-2 rounded-full"
              />
            </div>
          </div>

          <AnimatePresence>
            {mostrarBotao && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCompletarOracao}
                className="w-full py-4 bg-gradient-to-r from-accent-500 to-secondary-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:from-accent-600 hover:to-secondary-600 transition-all"
              >
                ✨ Completar Oração e Desbloquear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}


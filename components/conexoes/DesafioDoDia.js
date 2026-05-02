import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConexoes } from '../../contexts/ConexoesContext'
import { getDesafioDoDia } from '../../lib/conexoesData'

export default function DesafioDoDia() {
  const { progresso } = useConexoes()
  const [desafio, setDesafio] = useState(null)
  const [escolhida, setEscolhida] = useState(null)
  const [confirmada, setConfirmada] = useState(false)
  const [shakeId, setShakeId] = useState(null)

  useEffect(() => {
    setDesafio(getDesafioDoDia())
  }, [])

  // Se já respondeu hoje, mostra estado anterior
  useEffect(() => {
    if (!progresso.loaded || !desafio) return
    if (progresso.desafioRespondidoHoje?.id === desafio.id) {
      const correta = desafio.alternativas.find((a) => a.correta)
      const acertou = progresso.desafioRespondidoHoje.acertou
      setEscolhida(acertou ? correta?.id : null)
      setConfirmada(true)
    }
  }, [progresso.loaded, progresso.desafioRespondidoHoje, desafio])

  if (!desafio) {
    return <div className="bg-cosmic-surface/70 border border-cosmic-border rounded-2xl p-5 h-64 animate-pulse" />
  }

  const correta = desafio.alternativas.find((a) => a.correta)
  const jaRespondidoHoje = progresso.desafioRespondidoHoje?.id === desafio.id

  function confirmar() {
    if (!escolhida || confirmada || jaRespondidoHoje) return
    const acertou = escolhida === correta?.id
    if (!acertou) {
      setShakeId(escolhida)
      setTimeout(() => setShakeId(null), 500)
    }
    setConfirmada(true)
    progresso.registrarDesafio(desafio.id, acertou)
  }

  return (
    <div className="bg-cosmic-surface/70 backdrop-blur-md border border-cosmic-border rounded-2xl p-5 md:p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl" aria-hidden="true">🔥</span>
        <h3 className="font-serif text-lg text-white">Desafio do dia</h3>
      </div>

      <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
        Qual passagem do Antigo Testamento se conecta com este versículo do Novo Testamento?
      </p>

      <div className="bg-cosmic-bg/60 border border-cosmic-border rounded-xl p-4 mb-4">
        <p className="font-serif text-base text-white mb-1">{desafio.versiculoNT.referencia}</p>
        <p className="text-xs text-neutral-400 italic leading-relaxed">"{desafio.versiculoNT.texto}"</p>
      </div>

      <div role="radiogroup" aria-label="Alternativas" className="space-y-2 mb-4">
        {desafio.alternativas.map((alt) => {
          const selecionada = escolhida === alt.id
          const showCorreta = confirmada && alt.correta
          const showErrada = confirmada && selecionada && !alt.correta
          return (
            <motion.button
              key={alt.id}
              type="button"
              role="radio"
              aria-checked={selecionada}
              disabled={confirmada}
              onClick={() => !confirmada && setEscolhida(alt.id)}
              animate={shakeId === alt.id ? { x: [0, -4, 4, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light ${
                showCorreta
                  ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : showErrada
                  ? 'bg-amber-500/10 border-amber-400/50 text-amber-100'
                  : selecionada
                  ? 'bg-cosmic-blue/15 border-cosmic-blue/60 text-white'
                  : 'bg-cosmic-bg/40 border-cosmic-border text-neutral-300 hover:bg-white/5'
              }`}
            >
              <span className={`w-6 h-6 flex-shrink-0 rounded flex items-center justify-center text-xs font-bold uppercase ${
                showCorreta ? 'bg-emerald-400 text-cosmic-bg' :
                showErrada ? 'bg-amber-400 text-cosmic-bg' :
                selecionada ? 'bg-cosmic-blue text-white' : 'bg-white/10 text-neutral-400'
              }`}>
                {alt.id}
              </span>
              <span className="text-sm flex-1">{alt.texto}</span>
              {showCorreta && (
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {confirmada && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className="text-xs text-neutral-400 leading-relaxed mb-4"
          >
            {desafio.explicacao}
          </motion.p>
        )}
      </AnimatePresence>

      {!confirmada ? (
        <button
          type="button"
          onClick={confirmar}
          disabled={!escolhida}
          className="w-full py-3 bg-cosmic-blue hover:bg-blue-600 disabled:bg-white/5 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
        >
          Confirmar resposta
        </button>
      ) : (
        <p className="text-center text-xs text-neutral-500">
          Volte amanhã para o próximo desafio.
        </p>
      )}
    </div>
  )
}

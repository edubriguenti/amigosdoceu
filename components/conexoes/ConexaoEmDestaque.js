import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useConexoes } from '../../contexts/ConexoesContext'
import LinhaLuminosa from './LinhaLuminosa'
import EmptyState from './EmptyState'

/**
 * Efeito heróico #3 — Transição da conexão em destaque.
 * Crossfade elegante via AnimatePresence (mode='wait'), sem piscar.
 * Símbolo central pulsa devagar; linha luminosa intensifica no hover.
 */
export default function ConexaoEmDestaque() {
  const { conexaoAtiva, conexoesFiltradas, proximaConexao, conexaoAnterior, setConexaoAtiva } = useConexoes()
  const [hover, setHover] = useState(false)

  if (!conexaoAtiva || conexoesFiltradas.length === 0) {
    return (
      <EmptyState
        icon="🔗"
        titulo="Nenhuma conexão para este evento ainda"
        descricao="Estamos adicionando mais conexões a cada dia. Explore outros eventos da timeline."
      />
    )
  }

  const indice = conexoesFiltradas.findIndex((c) => c.id === conexaoAtiva.id)

  return (
    <div className="relative bg-cosmic-surface/70 backdrop-blur-md border border-cosmic-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-cosmic-border">
        <h2 className="font-serif text-lg md:text-xl text-white">Conexão em destaque</h2>
        <button
          type="button"
          aria-label="Salvar nos favoritos"
          className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-cosmic-gold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div
        className="relative p-5 md:p-6"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={conexaoAtiva.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative"
          >
            <CardLado
              tipo="ANTIGO TESTAMENTO"
              corLabel="text-cosmic-gold"
              dado={conexaoAtiva.antigoTestamento}
              lado="AT"
            />
            <CardLado
              tipo="NOVO TESTAMENTO"
              corLabel="text-cosmic-blue-light"
              dado={conexaoAtiva.novoTestamento}
              lado="NT"
            />

            {/* Linha luminosa horizontal (desktop) entre os 2 cards */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 z-10 pointer-events-none">
              <LinhaLuminosa intense={hover} />
            </div>

            {/* Símbolo central pulsante */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-cosmic-bg border-2 border-cosmic-gold flex items-center justify-center motion-safe:animate-pulse-scale shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tema */}
        <div className="flex justify-center mt-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs md:text-sm bg-white/5 border border-cosmic-border rounded-full text-neutral-300">
            <span className="text-cosmic-blue-light">TEMA:</span>
            <span className="font-medium">{conexaoAtiva.tema}</span>
          </span>
        </div>
      </div>

      {/* Navegação + dots */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-cosmic-border">
        <button
          type="button"
          onClick={conexaoAnterior}
          aria-label="Conexão anterior"
          className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Conexões disponíveis">
          {conexoesFiltradas.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === indice}
              aria-label={`Conexão ${i + 1}`}
              onClick={() => setConexaoAtiva(c)}
              className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light ${
                i === indice ? 'w-6 bg-cosmic-blue-light' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={proximaConexao}
          aria-label="Próxima conexão"
          className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function CardLado({ tipo, corLabel, dado, lado }) {
  const fundoGradiente = lado === 'AT'
    ? 'bg-gradient-to-br from-amber-900/30 via-orange-950/40 to-cosmic-bg'
    : 'bg-gradient-to-br from-blue-900/30 via-indigo-950/40 to-cosmic-bg'
  return (
    <div className={`relative rounded-xl overflow-hidden ${fundoGradiente} border border-cosmic-border min-h-[280px] md:min-h-[320px]`}>
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-bg/40 via-cosmic-bg/70 to-cosmic-bg/95" />
      <div className="relative p-5 md:p-6 flex flex-col h-full">
        <p className={`text-xs tracking-[0.25em] font-semibold mb-3 ${corLabel}`}>{tipo}</p>
        <h3 className="font-serif text-xl md:text-2xl text-white mb-3">{dado.referencia}</h3>
        <p className="text-sm text-neutral-300 leading-relaxed flex-1">{dado.texto}</p>
      </div>
    </div>
  )
}

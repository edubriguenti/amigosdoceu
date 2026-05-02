import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConexoes } from '../../contexts/ConexoesContext'

export default function DescobertaToast() {
  const { descobertaRecente, limparDescoberta } = useConexoes()

  useEffect(() => {
    if (!descobertaRecente) return
    const t = setTimeout(limparDescoberta, 3500)
    return () => clearTimeout(t)
  }, [descobertaRecente, limparDescoberta])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {descobertaRecente && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto bg-cosmic-surface/95 backdrop-blur-md border border-cosmic-gold/40 rounded-xl px-5 py-3.5 shadow-[0_20px_60px_-20px_rgba(251,191,36,0.4)] flex items-center gap-4"
            role="status"
            aria-live="polite"
          >
            <span className="text-2xl" aria-hidden="true">✨</span>
            <div>
              <p className="text-sm font-semibold text-white">Conexão descoberta!</p>
              <p className="text-xs text-neutral-300">{descobertaRecente.conexao.tema}</p>
            </div>
            <span className="ml-2 px-2.5 py-1 rounded-md bg-cosmic-gold/20 text-cosmic-gold text-sm font-bold">
              +{descobertaRecente.xpGanho} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

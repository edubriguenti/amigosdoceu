import { motion, useReducedMotion } from 'framer-motion'
import ModalBase from './ModalBase'

/** Aparece quando o usuário cola a última figurinha de uma página. */
export default function CompletionOverlay({ pagina, proxima, onClose, onProxima }) {
  const reduzir = useReducedMotion()

  return (
    <ModalBase onClose={onClose} label={`Página ${pagina.titulo} completa`}>
      <motion.div
        initial={reduzir ? { opacity: 0 } : { scale: 0.9, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={reduzir ? { duration: 0.2 } : { type: 'spring', stiffness: 220, damping: 18 }}
        className="album-papel w-[min(90vw,400px)] rounded-[6px] p-8 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]"
      >
        <div
          aria-hidden
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-[radial-gradient(circle_at_35%_30%,#f7e7a1,#c9a227_55%,#8a6a14)] shadow-[0_4px_10px_rgba(0,0,0,.35),inset_0_0_0_3px_rgba(255,255,255,.25)]"
        >
          {pagina.icone}
        </div>
        <h2 className="mt-5 font-serif text-2xl text-[#2e241b]">Página completa</h2>
        <p className="mt-2 text-[#6b5a45]">
          Você colou todas as figurinhas de <em className="font-serif">{pagina.titulo}</em>.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {proxima && (
            <button
              type="button"
              onClick={onProxima}
              className="w-full py-3 rounded-full bg-[#1e4fa8] text-white font-medium hover:bg-[#163a7d] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e4fa8] focus-visible:ring-offset-[#ece2cb]"
            >
              Ir para {proxima.titulo}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full border border-[#8a7556]/60 text-[#3b2f24] hover:bg-[#8a7556]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6a14]"
          >
            Continuar nesta página
          </button>
        </div>
      </motion.div>
    </ModalBase>
  )
}

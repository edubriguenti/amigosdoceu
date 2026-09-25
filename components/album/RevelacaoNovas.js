import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { formatarNumero } from '../../lib/albumCatalogo'
import { FaceFigurinha, VersoFechado } from './Figurinha'
import ModalBase from './ModalBase'

/**
 * Revela as figurinhas novas uma por uma: carta fechada → aproxima → vira → brilha.
 * Cada "Colar no álbum" chama onColar(id) (marcarVista). Com reduced motion, só um fade.
 * `figurinhas` pode trazer `paginaTitulo` para dizer em que página ela entra.
 */
export default function RevelacaoNovas({ figurinhas, onColar, onClose }) {
  const [indice, setIndice] = useState(0)
  const reduzir = useReducedMotion()
  const atual = figurinhas[indice]
  if (!atual) return null
  const ultima = indice === figurinhas.length - 1

  const colar = () => {
    onColar(atual.id)
    if (ultima) onClose()
    else setIndice((i) => i + 1)
  }

  return (
    <ModalBase onClose={onClose} label="Figurinhas novas">
      <div className="w-[min(80vw,300px)] text-center">
        {figurinhas.length > 1 && (
          <p className="mb-4 text-sm text-neutral-300 tabular-nums" aria-live="polite">
            {indice + 1} de {figurinhas.length}
          </p>
        )}

        <div className="relative aspect-[3/4] [perspective:1400px]">
          {reduzir ? (
            <motion.div key={atual.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
              <FaceFigurinha figurinha={atual} tamanho="lg" />
            </motion.div>
          ) : (
            <motion.div
              key={atual.id}
              className="absolute inset-0 preserve-3d"
              initial={{ rotateY: 180, scale: 0.86, y: 10 }}
              animate={{ rotateY: 0, scale: 1, y: 0 }}
              transition={{
                scale: { duration: 0.15 },
                y: { duration: 0.15 },
                rotateY: { delay: 0.15, duration: 0.35, ease: [0.3, 0.7, 0.3, 1] },
              }}
            >
              <div className="absolute inset-0 backface-hidden [transform:rotateY(0deg)]">
                <FaceFigurinha figurinha={atual} tamanho="lg" />
                {/* brilho curto quando a figurinha termina de virar */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[5px] bg-[radial-gradient(circle_at_50%_40%,rgba(255,236,170,.75),rgba(255,236,170,0)_65%)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 0.5, duration: 0.45 }}
                />
              </div>
              <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                <VersoFechado />
              </div>
            </motion.div>
          )}
        </div>

        <p className="mt-5 font-serif text-lg text-neutral-100">
          {formatarNumero(atual.numero)} {atual.nome}
        </p>
        {atual.paginaTitulo && (
          <p className="mt-1 text-sm text-neutral-400">
            Vai para a página <em className="font-serif not-italic text-neutral-300">{atual.paginaTitulo}</em>
          </p>
        )}

        <button
          type="button"
          onClick={colar}
          className="mt-5 px-6 py-2.5 rounded-full bg-[#c9a227] text-[#1b1406] font-medium hover:bg-[#dcb53a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {ultima ? 'Colar no álbum' : 'Colar e ver a próxima'}
        </button>
      </div>
    </ModalBase>
  )
}

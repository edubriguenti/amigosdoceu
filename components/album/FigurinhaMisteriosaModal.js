import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatarNumero } from '../../lib/albumCatalogo'
import ModalBase from './ModalBase'
import OracaoDesbloqueio from './OracaoDesbloqueio'

const QUEM_E = {
  santo: 'um santo',
  aparicao: 'uma aparição',
  igreja: 'um lugar sagrado',
  cristo: 'uma cena da Vida de Cristo',
}

const ONDE_DESCOBRIR = {
  santo: 'Ela aparece quando você abrir a página deste santo.',
  aparicao: 'Ela aparece quando você abrir a página desta aparição.',
  igreja: 'Ela aparece quando você abrir a página deste lugar.',
  cristo: 'Ela aparece quando você abrir esta cena na Vida de Cristo.',
}

/**
 * Figurinha ainda não descoberta: mostra só o número e uma dica.
 * Caminhos: rezar (se houver oração) ou descobrir no site (a visita coleta).
 */
export default function FigurinhaMisteriosaModal({ figurinha, pagina, onClose, onRezou }) {
  const [rezando, setRezando] = useState(false)
  const temOracao = Boolean(figurinha.verso.oracao)

  return (
    <ModalBase onClose={onClose} label={`Figurinha ${formatarNumero(figurinha.numero)} ainda não descoberta`}>
      <motion.div
        initial={{ scale: 0.95, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="album-papel w-[min(92vw,440px)] rounded-[6px] p-6 md:p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]"
      >
        <p className="text-center font-serif tabular-nums text-[#8a6a14] text-sm">{formatarNumero(figurinha.numero)}</p>
        <h2 className="mt-1 text-center font-serif text-2xl md:text-3xl text-[#2e241b]">Quem será?</h2>
        <p className="mt-3 text-center text-sm text-[#6b5a45] leading-relaxed">
          É <strong className="font-medium text-[#3b2f24]">{QUEM_E[figurinha.tipo]}</strong>, na página{' '}
          <em className="font-serif">{pagina.titulo}</em>. {ONDE_DESCOBRIR[figurinha.tipo]}
        </p>

        <div className="mt-6 border-t border-[#8a7556]/30 pt-6">
          {rezando ? (
            <OracaoDesbloqueio oracao={figurinha.verso.oracao} onCompletar={() => onRezou(figurinha)} />
          ) : (
            <div className="flex flex-col gap-2.5">
              {temOracao && (
                <button
                  type="button"
                  onClick={() => setRezando(true)}
                  className="w-full py-3 rounded-full bg-[#1e4fa8] text-white font-medium hover:bg-[#163a7d] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e4fa8] focus-visible:ring-offset-[#ece2cb]"
                >
                  Rezar para descobrir
                </button>
              )}
              <Link
                href={figurinha.link}
                className={`w-full py-3 rounded-full text-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8a6a14] focus-visible:ring-offset-[#ece2cb] ${
                  temOracao
                    ? 'border border-[#8a7556]/60 text-[#3b2f24] hover:bg-[#8a7556]/10'
                    : 'bg-[#1e4fa8] text-white hover:bg-[#163a7d]'
                }`}
              >
                Descobrir no site
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 block mx-auto text-sm text-[#6b5a45] hover:text-[#2e241b] underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6a14] rounded"
        >
          Voltar ao álbum
        </button>
      </motion.div>
    </ModalBase>
  )
}

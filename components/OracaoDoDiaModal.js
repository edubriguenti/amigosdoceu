import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ModalBase from './album/ModalBase'
import OracaoDesbloqueio from './album/OracaoDesbloqueio'
import { FaceFigurinha } from './album/Figurinha'
import { useAlbum, resgatarFigurinhaDoDia } from '../hooks/useAlbum'
import { useOracoes, registrarOracaoHoje } from '../hooks/useOracoes'

/**
 * A oração do dia, rezada sem sair da página. É o ÚNICO lugar que orquestra o fluxo:
 *
 *   OracaoDesbloqueio (leitura → tempo mínimo → "Amém")
 *     → registrarOracaoHoje(dia.oracao.ref)
 *     → resgatarFigurinhaDoDia(dia.figurinha)   // só funciona com a oração registrada hoje
 *
 * Fechar antes do "Amém" não registra nada. `dia` vem de lib/hoje.js (montarDia).
 */

const linkPapel =
  'inline-flex items-center justify-center px-5 py-2.5 rounded-full font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8a6a14] focus-visible:ring-offset-[#ece2cb]'

function textoSequencia(n) {
  if (n <= 1) return 'Primeiro dia da sua sequência de oração.'
  return `${n} dias seguidos de oração.`
}

export default function OracaoDoDiaModal({ dia, onClose, onConcluir }) {
  const { isColetada } = useAlbum()
  const { resumo } = useOracoes()
  const [resultado, setResultado] = useState(null)
  const { oracao, figurinha } = dia

  const concluir = () => {
    const { nova: oracaoNova } = registrarOracaoHoje(oracao.ref)
    let situacao = null
    if (figurinha) {
      const jaTinha = isColetada(figurinha.id)
      const r = resgatarFigurinhaDoDia(figurinha)
      if (r.ok) situacao = jaTinha ? 'ja-tinha' : 'nova'
      else if (r.motivo === 'ja-resgatada') situacao = 'ja-recebida'
    }
    setResultado({ oracaoNova, figurinha: situacao })
    onConcluir?.({ figurinha: situacao })
  }

  return (
    <ModalBase onClose={onClose} label={`Rezar: ${oracao.titulo}`}>
      <motion.div
        initial={{ scale: 0.95, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="album-papel relative w-[min(92vw,480px)] max-h-[90vh] overflow-y-auto rounded-[6px] p-6 md:p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full text-[#6b5a45] hover:bg-[#8a7556]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6a14]"
          aria-label="Fechar"
        >
          ×
        </button>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#8a6a14]">🙏 Uma oração para hoje</p>
        <h2 className="mt-1 text-center font-serif text-2xl text-[#2e241b]">{oracao.titulo}</h2>

        {!resultado ? (
          <div className="mt-5">
            <OracaoDesbloqueio oracao={oracao.texto} onCompletar={concluir} rotuloConcluir="Amém 🙏" />
          </div>
        ) : (
          <div className="mt-6 space-y-5" role="status" aria-live="polite">
            <div className="text-center">
              <p className="font-serif text-lg text-[#2e241b]">
                {resultado.oracaoNova ? '🙏 Oração registrada na sua jornada' : '🙏 Você já tinha rezado esta oração hoje'}
              </p>
              <p className="mt-1 text-sm text-[#6b5a45]">{textoSequencia(resumo.sequencia)}</p>
            </div>

            {figurinha && resultado.figurinha && (
              <div className="border-t border-[#8a7556]/30 pt-5 flex items-center gap-4">
                {resultado.figurinha !== 'ja-recebida' && (
                  <motion.div
                    className="w-24 shrink-0"
                    initial={resultado.figurinha === 'nova' ? { rotateY: 90, opacity: 0 } : false}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <FaceFigurinha figurinha={figurinha} tamanho="sm" nova={resultado.figurinha === 'nova'} />
                  </motion.div>
                )}
                <div className="min-w-0">
                  {resultado.figurinha === 'nova' && (
                    <p className="font-serif text-xl text-[#2e241b]">✨ Nova figurinha!</p>
                  )}
                  {resultado.figurinha === 'ja-tinha' && (
                    <p className="font-serif text-lg text-[#2e241b]">Já estava no seu álbum</p>
                  )}
                  {resultado.figurinha === 'ja-recebida' && (
                    <p className="font-serif text-lg text-[#2e241b]">A figurinha de hoje já foi recebida</p>
                  )}
                  <p className="text-sm text-[#6b5a45]">{figurinha.nome}</p>
                  <Link href={figurinha.href} className={`${linkPapel} mt-3 !px-4 !py-2 text-sm bg-[#1e4fa8] text-white hover:bg-[#163a7d]`}>
                    Ver no Álbum
                  </Link>
                </div>
              </div>
            )}

            <div className="border-t border-[#8a7556]/30 pt-5 flex flex-col sm:flex-row gap-2.5">
              <Link href="/minha-jornada" className={`${linkPapel} flex-1 bg-[#c9a227] text-[#1b1406] hover:bg-[#dcb53a]`}>
                Continuar minha jornada →
              </Link>
              <button type="button" onClick={onClose} className={`${linkPapel} border border-[#8a7556]/40 text-[#3b2f24] hover:bg-[#8a7556]/10`}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </ModalBase>
  )
}

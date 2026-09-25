import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { formatarNumero, TIPO_LABEL } from '../../lib/albumCatalogo'
import { FaceFigurinha } from './Figurinha'
import { estiloRaridade } from './raridade'
import ModalBase from './ModalBase'

function Linha({ icone, rotulo, children }) {
  if (!children) return null
  return (
    <div className="flex gap-2.5 text-sm leading-snug">
      <span aria-hidden className="w-5 shrink-0 text-center">{icone}</span>
      <p>
        <span className="sr-only">{rotulo}: </span>
        {children}
      </p>
    </div>
  )
}

/** Verso da figurinha: ficha enxuta, com o texto longo recolhido em "Ler mais". */
function Verso({ figurinha }) {
  const [aberto, setAberto] = useState(false)
  const { verso } = figurinha
  const r = estiloRaridade(figurinha.raridade)
  const textoExtra = verso.oracao || verso.escritura

  return (
    <div className="album-papel h-full rounded-[5px] p-3 shadow-[0_8px_20px_-6px_rgba(0,0,0,.6)]">
      <div className="h-full rounded-[3px] border border-[#8a7556]/40 flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-[#8a7556]/30 text-center">
          <p className="font-serif text-xs text-[#6b5a45] tabular-nums">
            {formatarNumero(figurinha.numero)}, {TIPO_LABEL[figurinha.tipo].toLowerCase()}
          </p>
          <h2 className="mt-1 font-serif text-xl leading-tight text-[#2e241b] [font-variant:small-caps] tracking-wide">
            {figurinha.nome}
          </h2>
          <p className="mt-1 text-[11px] text-[#6b5a45]">
            {r.label}, moldura {r.cor}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2 text-[#2e241b]">
          <Linha icone="📅" rotulo="Datas">{verso.datas}</Linha>
          <Linha icone="📍" rotulo="Local">{verso.local}</Linha>
          {verso.destaque && (
            <Linha icone={verso.destaque.icone} rotulo={verso.destaque.rotulo}>
              <span className="text-[#6b5a45]">{verso.destaque.rotulo}:</span> {verso.destaque.texto}
            </Linha>
          )}
          {verso.resumo && (
            <p className={`pt-2 text-sm leading-relaxed font-serif text-[#3b2f24] ${aberto ? '' : 'line-clamp-4'}`}>
              {verso.resumo}
            </p>
          )}
          {aberto && textoExtra && (
            <blockquote className="mt-2 border-l-2 border-[#8a6a14]/60 pl-3 text-sm italic leading-relaxed font-serif text-[#3b2f24]">
              {verso.oracao ? verso.oracao : verso.escritura}
            </blockquote>
          )}
          {(verso.resumo || textoExtra) && (
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              className="text-sm font-medium text-[#1e4fa8] underline underline-offset-2 hover:text-[#163a7d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e4fa8] rounded"
              aria-expanded={aberto}
            >
              {aberto ? 'Ler menos' : verso.oracao ? 'Ler mais e rezar' : 'Ler mais'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FigurinhaModal({ figurinha, onClose }) {
  const [virada, setVirada] = useState(false)
  const reduzir = useReducedMotion()

  return (
    <ModalBase onClose={onClose} label={`Figurinha ${formatarNumero(figurinha.numero)}: ${figurinha.nome}`}>
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: reduzir ? 0 : 0.25 }}
        className="w-[min(86vw,340px)]"
      >
        <div className="relative aspect-[3/4] [perspective:1400px]">
          {reduzir ? (
            <div className="absolute inset-0">{virada ? <Verso figurinha={figurinha} /> : <FaceFigurinha figurinha={figurinha} tamanho="lg" />}</div>
          ) : (
            <motion.div
              className="absolute inset-0 preserve-3d"
              animate={{ rotateY: virada ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.3, 0.7, 0.3, 1] }}
            >
              <div className="absolute inset-0 backface-hidden [transform:rotateY(0deg)]" aria-hidden={virada}>
                <FaceFigurinha figurinha={figurinha} tamanho="lg" />
              </div>
              <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]" aria-hidden={!virada}>
                <Verso figurinha={figurinha} />
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setVirada((v) => !v)}
            className="px-4 py-2 rounded-full bg-[#c9a227] text-[#1b1406] font-medium text-sm hover:bg-[#dcb53a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {virada ? 'Ver a frente' : 'Virar a figurinha'}
          </button>
          <Link
            href={figurinha.link}
            className="px-4 py-2 rounded-full border border-white/25 text-neutral-100 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Abrir página completa
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-neutral-300 text-sm hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </ModalBase>
  )
}

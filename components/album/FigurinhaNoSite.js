import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useAlbum, coletar } from '../../hooks/useAlbum'
import { formatarNumero } from '../../lib/albumCatalogo'
import { FaceFigurinha } from './Figurinha'

/**
 * Aviso flutuante "nova figurinha colada". Some sozinho depois de alguns segundos.
 * `figurinha` é o resumo serializável gerado por resumoFigurinha() em lib/albumData.js.
 */
export function AvisoNovaFigurinha({ figurinha, onFechar }) {
  const reduzir = useReducedMotion()

  useEffect(() => {
    if (!figurinha) return
    const t = setTimeout(onFechar, 6000)
    return () => clearTimeout(t)
  }, [figurinha, onFechar])

  return (
    <div aria-live="polite" className="fixed z-[60] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 pointer-events-none">
      <AnimatePresence>
        {figurinha && (
          <motion.div
            key={figurinha.id}
            initial={reduzir ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduzir ? 0 : 12 }}
            transition={{ duration: 0.25 }}
            className="album-papel pointer-events-auto rounded-[6px] p-3 flex gap-3 items-center shadow-[0_20px_40px_-12px_rgba(0,0,0,.8)]"
          >
            <div className="w-12 shrink-0" aria-hidden>
              <FaceFigurinha figurinha={figurinha} tamanho="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#6b5a45]">Nova figurinha colada no seu álbum</p>
              <p className="font-serif text-[#2e241b] truncate">
                {formatarNumero(figurinha.numero)} {figurinha.nome}
              </p>
              <Link href={figurinha.href} className="text-sm font-medium text-[#1e4fa8] underline underline-offset-2 hover:text-[#163a7d]">
                Ver no álbum
              </Link>
            </div>
            <button
              type="button"
              onClick={onFechar}
              className="self-start -mt-1 -mr-1 w-7 h-7 rounded-full text-[#6b5a45] hover:bg-[#8a7556]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6a14]"
              aria-label="Fechar aviso"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Colocado nas páginas de santo, aparição e igreja: a visita cola a figurinha
 * (idempotente — ver hooks/useAlbum.js) e mostra o caminho de volta ao álbum.
 */
export default function FigurinhaNoSite({ figurinha }) {
  const { loaded, isColetada } = useAlbum()
  const [aviso, setAviso] = useState(null)
  const fecharAviso = useCallback(() => setAviso(null), [])

  useEffect(() => {
    if (!figurinha) return
    const { nova } = coletar(figurinha.id, 'visita')
    if (nova) setAviso(figurinha)
  }, [figurinha])

  if (!figurinha) return null

  return (
    <>
      {loaded && isColetada(figurinha.id) && (
        <aside className="max-w-4xl mx-auto px-4 mt-10">
          <div className="flex items-center gap-4 rounded-[8px] border border-white/10 bg-cosmic-surface/70 p-4">
            <div className="w-14 shrink-0" aria-hidden>
              <FaceFigurinha figurinha={figurinha} tamanho="sm" />
            </div>
            <div className="min-w-0">
              <p className="text-neutral-200">
                A figurinha {formatarNumero(figurinha.numero)} já está no seu Álbum Sagrado.
              </p>
              <Link href={figurinha.href} className="text-sm font-medium text-[#e3c565] underline underline-offset-2 hover:text-[#ecd07a]">
                Ver no álbum
              </Link>
            </div>
          </div>
        </aside>
      )}
      <AvisoNovaFigurinha figurinha={aviso} onFechar={fecharAviso} />
    </>
  )
}

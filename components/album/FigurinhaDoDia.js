import { FaceFigurinha, VersoFechado } from './Figurinha'

/**
 * Figurinha de hoje. Antes de receber: verso fechado + botão.
 * Depois: a figurinha aberta. Só pode ser recebida uma vez por dia.
 */
export default function FigurinhaDoDia({ figurinha, santoDoDia, jaResgatada, jaTinha, onReceber, onAbrir }) {
  if (!figurinha) return null

  return (
    <section aria-labelledby="figurinha-dia" className="rounded-[8px] border border-white/10 bg-cosmic-surface/70 p-5 sm:p-6 flex gap-5 sm:gap-7 items-center">
      <div className="w-28 sm:w-36 shrink-0">
        {jaResgatada ? (
          <button
            type="button"
            onClick={onAbrir}
            className="block w-full rounded-[5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
            aria-label={`Abrir ${figurinha.nome}`}
          >
            <FaceFigurinha figurinha={figurinha} tamanho="sm" />
          </button>
        ) : (
          <VersoFechado />
        )}
      </div>

      <div className="min-w-0">
        <h2 id="figurinha-dia" className="font-serif text-2xl text-neutral-100">
          Figurinha de hoje
        </h2>
        {jaResgatada ? (
          <>
            <p className="mt-2 font-serif text-lg text-[#ecd07a]">{figurinha.nome}</p>
            <p className="mt-1 text-neutral-300 leading-relaxed">
              {santoDoDia ? 'Hoje a Igreja celebra este santo. ' : ''}
              {jaTinha ? 'A figurinha já estava no seu álbum.' : 'A figurinha foi colada no seu álbum.'}
            </p>
            <p className="mt-2 text-sm text-neutral-400">Amanhã tem outra.</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-neutral-300 leading-relaxed">
              {santoDoDia ? 'Hoje a Igreja celebra um santo que está no álbum.' : 'Todo dia uma figurinha diferente espera por você.'}
            </p>
            <button
              type="button"
              onClick={onReceber}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#c9a227] text-[#1b1406] font-medium hover:bg-[#dcb53a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Receber figurinha
            </button>
          </>
        )}
      </div>
    </section>
  )
}

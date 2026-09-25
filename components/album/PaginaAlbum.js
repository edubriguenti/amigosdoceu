import { formatarNumero, rotacaoPorId } from '../../lib/albumCatalogo'
import Figurinha from './Figurinha'

/** Espaço vazio impresso na folha: número em tinta e um "?" apagado. */
function SlotImpresso({ figurinha, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="album-slot group relative w-full aspect-[3/4] rounded-[4px] flex flex-col items-center justify-center text-[#7a6242] transition-colors hover:bg-[rgba(120,92,55,0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6a14] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ece2cb]"
      aria-label={`Figurinha ${formatarNumero(figurinha.numero)}: ainda não descoberta`}
    >
      <span className="font-serif text-4xl md:text-5xl leading-none text-[#7a6242]/35 group-hover:text-[#7a6242]/55 transition-colors" aria-hidden>
        ?
      </span>
      <span className="mt-2 font-serif tabular-nums text-xs md:text-sm tracking-wide">{formatarNumero(figurinha.numero)}</span>
    </button>
  )
}

/**
 * Uma página física do álbum: papel envelhecido, título impresso e slots numerados.
 * Antes de `loaded` (hidratação), tudo aparece como slot impresso.
 */
export default function PaginaAlbum({ pagina, numeroPagina, figurinhas, isColetada, isNova, loaded, onAbrir, onMisteriosa }) {
  const coletadas = loaded ? figurinhas.filter((f) => isColetada(f.id)).length : 0

  return (
    <section
      aria-labelledby={`pagina-${pagina.slug}`}
      className="album-papel relative rounded-[6px] px-4 pt-8 pb-6 sm:px-8 md:px-12 md:pt-12 md:pb-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,.75),0_0_0_1px_rgba(0,0,0,.25)]"
    >
      {/* filete impresso na margem */}
      <div aria-hidden className="pointer-events-none absolute inset-2 md:inset-4 rounded-[3px] border border-[#8a7556]/30" />

      <header className="relative text-center max-w-xl mx-auto mb-8 md:mb-10">
        <p className="font-serif text-[#8a6a14] text-lg leading-none" aria-hidden>
          ⁂
        </p>
        <h1 id={`pagina-${pagina.slug}`} className="mt-3 font-serif text-3xl md:text-4xl text-[#2e241b]">
          {pagina.titulo}
        </h1>
        <p className="mt-2 font-serif italic text-[#6b5a45] text-sm md:text-base">{pagina.descricao}</p>
      </header>

      <ol className="relative grid justify-center grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(150px,190px))] gap-x-4 gap-y-6 md:gap-x-7 md:gap-y-9 max-w-4xl mx-auto">
        {figurinhas.map((f) => (
          <li key={f.id}>
            {loaded && isColetada(f.id) ? (
              <Figurinha figurinha={f} nova={isNova(f.id)} rotacao={rotacaoPorId(f.id)} onClick={() => onAbrir(f)} />
            ) : (
              <SlotImpresso figurinha={f} onClick={() => onMisteriosa(f)} />
            )}
          </li>
        ))}
      </ol>

      <footer className="relative mt-10 flex items-end justify-between font-serif text-[#6b5a45] text-sm">
        <span>
          {coletadas} de {figurinhas.length} coladas
        </span>
        <span className="italic tabular-nums">— {numeroPagina} —</span>
      </footer>
    </section>
  )
}

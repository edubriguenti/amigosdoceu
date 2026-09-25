import Link from 'next/link'

/**
 * Sumário do álbum, como o índice impresso de um livro:
 * página, título, pontilhado e quantas figurinhas já foram coladas.
 */
export default function SumarioPaginas({ paginas, stats, loaded }) {
  return (
    <section aria-labelledby="sumario-titulo" className="album-papel relative rounded-[6px] px-5 py-8 sm:px-10 md:px-14 md:py-12 shadow-[0_30px_60px_-20px_rgba(0,0,0,.75)]">
      <div aria-hidden className="pointer-events-none absolute inset-2 md:inset-4 rounded-[3px] border border-[#8a7556]/30" />
      <h2 id="sumario-titulo" className="relative text-center font-serif text-3xl text-[#2e241b]">
        Sumário
      </h2>

      <ol className="relative mt-8 space-y-1">
        {paginas.map((p, i) => {
          const s = stats.porPagina[p.slug]
          const completa = loaded && s.coletadas === s.total
          return (
            <li key={p.slug}>
              <Link
                href={`/album-sagrado/${p.slug}`}
                className="group flex items-baseline gap-3 rounded-[3px] px-2 py-2.5 -mx-2 text-[#2e241b] hover:bg-[#8a7556]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6a14]"
              >
                <span className="w-6 shrink-0 text-right font-serif italic tabular-nums text-[#8a6a14]">{i + 1}</span>
                <span aria-hidden className="shrink-0 w-6 text-center">{p.icone}</span>
                <span className="font-serif text-lg group-hover:underline underline-offset-4 decoration-[#8a6a14]/60">{p.titulo}</span>
                <span aria-hidden className="flex-1 min-w-4 border-b border-dotted border-[#8a7556]/60 translate-y-[-4px]" />
                <span className="shrink-0 font-serif tabular-nums text-sm text-[#6b5a45]">
                  {completa ? (
                    <span className="text-[#3f7a55]">
                      <span aria-hidden>✓ </span>completa
                    </span>
                  ) : (
                    <>
                      {loaded ? s.coletadas : 0}/{s.total}
                    </>
                  )}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

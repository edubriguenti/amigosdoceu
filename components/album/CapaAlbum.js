/**
 * Capa do álbum em couro azul-mariano com letras douradas estampadas.
 * O progresso aparece como uma etiqueta gravada na própria capa.
 */
export default function CapaAlbum({ volume, coletadas, total, loaded }) {
  const pct = total ? Math.round((coletadas / total) * 100) : 0

  return (
    <section
      aria-label="Capa do álbum"
      className="album-capa relative mx-auto max-w-3xl rounded-[10px] rounded-l-[4px] px-6 py-10 sm:px-12 md:py-14 shadow-[0_40px_80px_-30px_rgba(0,0,0,.9),inset_10px_0_18px_-10px_rgba(0,0,0,.6)]"
    >
      {/* lombada */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-3 sm:w-4 rounded-l-[4px] bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      {/* filetes dourados gravados */}
      <div aria-hidden className="pointer-events-none absolute inset-3 sm:inset-5 rounded-[6px] border border-[#c9a227]/55" />
      <div aria-hidden className="pointer-events-none absolute inset-[18px] sm:inset-[26px] rounded-[4px] border border-[#c9a227]/25" />

      <div className="relative text-center text-[#e3c565]">
        <p className="font-serif text-3xl leading-none" aria-hidden>
          ✠
        </p>
        <h1 className="mt-4 font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-[#ecd07a] [text-shadow:0_1px_0_rgba(0,0,0,.55),0_-1px_0_rgba(255,240,190,.18)]">
          {volume.titulo}
        </h1>
        <p className="mt-3 font-serif italic text-lg text-[#d9bd66]">{volume.edicao}</p>
        <p className="mt-5 mx-auto max-w-md text-sm sm:text-base text-[#cdd6f2]/85 leading-relaxed">{volume.subtitulo}</p>

        <div className="mt-8 mx-auto max-w-xs">
          <div className="rounded-[4px] border border-[#c9a227]/50 bg-black/20 px-4 py-3">
            <p className="font-serif text-[#ecd07a] tabular-nums" aria-live="polite">
              {loaded ? (
                <>
                  <span className="text-2xl">{coletadas}</span>
                  <span className="text-[#d9bd66]"> de {total} figurinhas coladas</span>
                </>
              ) : (
                <span className="text-[#d9bd66]">{total} figurinhas para colecionar</span>
              )}
            </p>
            <div
              className="mt-2 h-1 rounded-full bg-[#c9a227]/20 overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={loaded ? coletadas : 0}
              aria-label="Progresso do álbum"
            >
              <div className="h-full bg-[#e3c565] transition-[width] duration-700" style={{ width: `${loaded ? pct : 0}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

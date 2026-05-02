import { useRef, useEffect } from 'react'
import { useConexoes } from '../../contexts/ConexoesContext'
import { getEventos } from '../../lib/conexoesData'

const eventos = getEventos()

const COR_CLASSES = {
  emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/40',
  purple: 'from-purple-400 to-purple-600 shadow-purple-500/40',
  amber: 'from-amber-400 to-amber-600 shadow-amber-500/40',
  orange: 'from-orange-400 to-orange-600 shadow-orange-500/40',
  blue: 'from-blue-400 to-blue-600 shadow-blue-500/40',
  indigo: 'from-indigo-400 to-indigo-600 shadow-indigo-500/40',
  violet: 'from-violet-400 to-violet-600 shadow-violet-500/40',
}

export default function TimelineInterativa() {
  const { eventoAtivo, setEventoAtivo } = useConexoes()
  const itemsRef = useRef({})

  useEffect(() => {
    if (eventoAtivo && itemsRef.current[eventoAtivo]) {
      itemsRef.current[eventoAtivo].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [eventoAtivo])

  function onKeyDown(e) {
    const idx = eventos.findIndex((ev) => ev.id === eventoAtivo)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = idx >= 0 ? eventos[(idx + 1) % eventos.length] : eventos[0]
      setEventoAtivo(next.id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = idx >= 0 ? eventos[(idx - 1 + eventos.length) % eventos.length] : eventos[eventos.length - 1]
      setEventoAtivo(prev.id)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setEventoAtivo(eventos[0].id)
    } else if (e.key === 'End') {
      e.preventDefault()
      setEventoAtivo(eventos[eventos.length - 1].id)
    }
  }

  return (
    <section className="relative bg-cosmic-surface/60 border-y border-cosmic-border backdrop-blur-md py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl md:text-2xl text-white">Linha do tempo interativa</h2>
            <p className="text-sm text-neutral-400">Navegue pela história e veja como tudo se conecta</p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Eventos bíblicos"
          onKeyDown={onKeyDown}
          className="relative flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-2 px-2"
        >
          {/* Linha de fundo */}
          <div className="absolute left-0 right-0 top-[36px] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {eventos.map((ev, i) => {
            const ativo = eventoAtivo === ev.id
            return (
              <button
                key={ev.id}
                ref={(el) => (itemsRef.current[ev.id] = el)}
                role="tab"
                aria-selected={ativo}
                tabIndex={ativo || (!eventoAtivo && i === 0) ? 0 : -1}
                onClick={() => setEventoAtivo(ev.id)}
                className="group relative flex flex-col items-center min-w-[110px] snap-center px-2 py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
              >
                <span
                  className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${COR_CLASSES[ev.cor]} shadow-lg motion-safe:transition-all motion-safe:duration-300 ${
                    ativo
                      ? 'scale-110 shadow-[0_0_40px_rgba(251,191,36,0.5)] ring-2 ring-cosmic-gold'
                      : 'opacity-80 group-hover:opacity-100 motion-safe:group-hover:scale-105'
                  }`}
                >
                  <span aria-hidden="true">{ev.icone}</span>
                </span>
                <span className={`mt-3 font-serif text-sm md:text-base ${ativo ? 'text-white' : 'text-neutral-300'}`}>
                  {ev.nome}
                </span>
                <span className="text-xs text-neutral-500 mt-0.5">{ev.referencia}</span>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-neutral-500 mt-4">
          {eventoAtivo ? 'Clique novamente para ver todas as conexões' : '✨ Clique em um evento para explorar suas conexões'}
        </p>
      </div>
    </section>
  )
}

import { memo } from 'react'
import Image from 'next/image'

function TrilhaCardImpl({ trilha, conexoesDescobertas = 0 }) {
  const pct = trilha.totalConexoes ? Math.round((conexoesDescobertas / trilha.totalConexoes) * 100) : 0
  return (
    <button
      type="button"
      className="group text-left relative overflow-hidden rounded-2xl bg-cosmic-surface/60 border border-cosmic-border min-h-[200px] md:min-h-[240px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light motion-safe:hover:scale-[1.02] transition-transform"
    >
      <div className="absolute inset-0">
        <Image
          src={trilha.imagem}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-bg via-cosmic-bg/70 to-transparent" />
      </div>
      <div className="relative h-full flex flex-col justify-end p-4">
        <h3 className="font-serif text-base md:text-lg text-white mb-1 leading-tight">{trilha.nome}</h3>
        <p className="text-xs text-neutral-300 mb-3 line-clamp-2">{trilha.descricao}</p>
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
          <span>{conexoesDescobertas}/{trilha.totalConexoes} conexões</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  )
}

export default memo(TrilhaCardImpl)

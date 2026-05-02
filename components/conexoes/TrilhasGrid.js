import { useMemo } from 'react'
import { useConexoes } from '../../contexts/ConexoesContext'
import { getTrilhas, getConexoesByTrilha } from '../../lib/conexoesData'
import TrilhaCard from './TrilhaCard'

const trilhas = getTrilhas()

export default function TrilhasGrid() {
  const { progresso } = useConexoes()

  const descobertasPorTrilha = useMemo(() => {
    const set = new Set(progresso.conexoesDescobertas)
    const acc = {}
    for (const t of trilhas) {
      acc[t.id] = getConexoesByTrilha(t.id).filter((c) => set.has(c.id)).length
    }
    return acc
  }, [progresso.conexoesDescobertas])

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-serif text-xl md:text-2xl text-white">Trilhas temáticas</h2>
          <p className="text-sm text-neutral-400">Aprenda através de jornadas guiadas</p>
        </div>
        <a href="#" className="text-sm text-cosmic-blue-light hover:underline">Ver todas as trilhas →</a>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {trilhas.map((t) => (
          <TrilhaCard
            key={t.id}
            trilha={t}
            conexoesDescobertas={descobertasPorTrilha[t.id] || 0}
          />
        ))}
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import FigurinhaCard from './FigurinhaCard'

export default function AlbumPage({ figurinhas, onFigurinhaClick, paginaAtual, totalPaginas }) {
  const figurinhasPorPagina = 6
  const inicio = (paginaAtual - 1) * figurinhasPorPagina
  const fim = inicio + figurinhasPorPagina
  const figurinhasPagina = figurinhas.slice(inicio, fim)

  const slots = Array(figurinhasPorPagina).fill(null).map((_, idx) => {
    return figurinhasPagina[idx] || { bloqueada: true, posicao: inicio + idx + 1 }
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-primary-50 to-amber-50 rounded-lg border-2 md:border-4 border-secondary-400 shadow-xl">
      {slots.map((figurinha, idx) => (
        <motion.div
          key={`slot-${inicio + idx}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="relative"
        >
          <FigurinhaCard
            figurinha={figurinha}
            onClick={() => onFigurinhaClick && onFigurinhaClick(figurinha)}
            pequeno={false}
          />
        </motion.div>
      ))}

      <div className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 bg-secondary-100 px-3 md:px-4 py-1 rounded-full text-xs md:text-sm text-gray-700 font-medium shadow whitespace-nowrap">
        Página {paginaAtual} / {totalPaginas}
      </div>
    </div>
  )
}

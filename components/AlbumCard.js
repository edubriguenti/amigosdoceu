import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AlbumCard({ colecao, progresso }) {
  const porcentagem = Math.round((progresso.desbloqueadas / colecao.totalFigurinhas) * 100)
  const corClasses = {
    accent: 'border-accent-400 bg-accent-50 hover:shadow-accent-200',
    secondary: 'border-secondary-400 bg-secondary-50 hover:shadow-secondary-200'
  }

  return (
    <Link href={`/album-sagrado/${colecao.slug}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className={`relative border-2 rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer ${corClasses[colecao.cor]}`}
      >
        <div className="text-5xl mb-4 text-center">{colecao.icone}</div>
        <h3 className="text-xl font-serif mb-2 text-center">{colecao.nome}</h3>
        <p className="text-sm text-gray-700 mb-4 text-center line-clamp-2">{colecao.descricao}</p>

        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{progresso.desbloqueadas} / {colecao.totalFigurinhas}</span>
            <span>{porcentagem}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                colecao.cor === 'accent' ? 'bg-accent-500' : 'bg-secondary-500'
              }`}
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>

        {progresso.desbloqueadas === colecao.totalFigurinhas && (
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 rounded-full w-12 h-12 flex items-center justify-center text-2xl animate-bounce">
            ✓
          </div>
        )}
      </motion.div>
    </Link>
  )
}

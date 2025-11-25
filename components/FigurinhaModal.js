import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function FigurinhaModal({ figurinha, onClose }) {
  const [abaAtiva, setAbaAtiva] = useState('historia')

  if (!figurinha) return null

  const abas = [
    { id: 'historia', label: 'História', icone: '📖' },
    { id: 'oracao', label: 'Oração', icone: '🙏' },
    { id: 'igrejas', label: 'Igrejas', icone: '⛪' },
    { id: 'curiosidades', label: 'Curiosidades', icone: '✨' }
  ]

  const raridadeColors = {
    comum: 'border-gray-400',
    rara: 'border-accent-500',
    epica: 'border-secondary-500'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10`} />
            <img
              src={figurinha.imagem}
              alt={figurinha.nome}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23e5e7eb" width="800" height="400"/%3E%3C/svg%3E'
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <h2 className="text-3xl font-serif text-white mb-2">{figurinha.nome}</h2>
              <p className="text-sm text-white/90">{figurinha.descricao}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-bold text-xl transition-colors"
            >
              ×
            </button>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {abas.map((aba) => (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex-1 min-w-fit px-6 py-3 text-sm font-medium transition-colors ${
                    abaAtiva === aba.id
                      ? 'border-b-2 border-accent-500 text-accent-700 bg-accent-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{aba.icone}</span>
                  {aba.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-96">
            {abaAtiva === 'historia' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="prose max-w-none"
              >
                <p className="text-gray-700 leading-relaxed">{figurinha.historia}</p>
              </motion.div>
            )}

            {abaAtiva === 'oracao' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-amber-50 border-l-4 border-secondary-500 p-6 rounded-r"
              >
                <p className="text-gray-800 italic leading-relaxed">{figurinha.oracao}</p>
              </motion.div>
            )}

            {abaAtiva === 'igrejas' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ul className="space-y-3">
                  {figurinha.igrejas?.map((igreja, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-2xl mr-3">⛪</span>
                      <span className="text-gray-700">{igreja}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {abaAtiva === 'curiosidades' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ul className="space-y-3">
                  {figurinha.curiosidades?.map((curiosidade, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-xl mr-3">✨</span>
                      <span className="text-gray-700">{curiosidade}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors text-sm">
                📤 Compartilhar
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

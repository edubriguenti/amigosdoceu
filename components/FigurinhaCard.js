import { motion } from 'framer-motion'

export default function FigurinhaCard({ figurinha, onClick, pequeno = false }) {
  const raridadeStyles = {
    comum: 'border-gray-300 bg-gray-50',
    rara: 'border-accent-400 bg-accent-50 shadow-accent-100',
    epica: 'border-secondary-500 bg-gradient-to-br from-secondary-50 to-amber-100 shadow-secondary-200'
  }

  const raridadeLabels = {
    comum: 'Comum',
    rara: 'Rara',
    epica: 'Épica'
  }

  if (figurinha.bloqueada) {
    // Se não tem id, é um slot vazio - não deve ser clicável
    if (!figurinha.id) {
      return (
        <div className={`relative border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg ${pequeno ? 'p-2' : 'p-4'} flex items-center justify-center`}>
          <div className="text-center">
            <div className={`text-gray-400 ${pequeno ? 'text-2xl' : 'text-4xl'} mb-2`}>🔲</div>
            {!pequeno && figurinha.posicao && <p className="text-xs text-gray-400">#{figurinha.posicao}</p>}
          </div>
        </div>
      )
    }
    
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg ${pequeno ? 'p-2' : 'p-4'} flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors`}
        onClick={onClick}
      >
        <div className="text-center">
          <div className={`text-gray-400 ${pequeno ? 'text-2xl' : 'text-4xl'} mb-2`}>🔒</div>
          {!pequeno && <p className="text-xs text-gray-500">Clique para desbloquear</p>}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: pequeno ? 0 : 2 }}
      whileTap={{ scale: 0.95 }}
      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${raridadeStyles[figurinha.raridade]} ${pequeno ? 'p-2' : 'p-3'} shadow-md hover:shadow-xl transition-all`}
      onClick={onClick}
    >
      <div className={`relative ${pequeno ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
        <div className="w-full h-full bg-white rounded-md overflow-hidden border border-gray-200">
          <img
            src={figurinha.imagem}
            alt={figurinha.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23f0f0f0" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="serif" font-size="16" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ESanto%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>

        {!pequeno && (
          <>
            <div className="absolute top-1 right-1 bg-white/90 rounded px-2 py-0.5 text-xs font-semibold">
              {raridadeLabels[figurinha.raridade]}
            </div>
            {figurinha.raridade === 'epica' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-transparent pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </>
        )}
      </div>

      {!pequeno && (
        <div className="mt-2 text-center">
          <h4 className="font-serif text-sm font-semibold line-clamp-2">{figurinha.nome}</h4>
        </div>
      )}
    </motion.div>
  )
}

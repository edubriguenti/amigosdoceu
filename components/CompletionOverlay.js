import { motion } from 'framer-motion'

export default function CompletionOverlay({ colecao, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="bg-gradient-to-br from-secondary-50 to-amber-100 rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-secondary-500 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          className="text-8xl mb-6"
        >
          🏆
        </motion.div>

        <h2 className="text-3xl font-serif mb-4 text-secondary-800">
          Coleção Completa!
        </h2>

        <p className="text-lg text-gray-700 mb-6">
          Parabéns! Você completou a coleção <strong>{colecao.nome}</strong>!
        </p>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-inner">
          <div className="text-6xl mb-2">{colecao.icone}</div>
          <p className="text-sm text-gray-600">Medalha de Conquista</p>
          <p className="font-serif text-xl text-secondary-700">{colecao.nome}</p>
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>

        <button
          onClick={onClose}
          className="px-6 py-3 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-600 transition-colors shadow-lg"
        >
          Continuar Explorando
        </button>
      </motion.div>
    </motion.div>
  )
}

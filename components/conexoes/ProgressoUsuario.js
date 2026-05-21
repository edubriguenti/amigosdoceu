import { motion } from 'framer-motion'
import { useConexoes } from '../../contexts/ConexoesContext'

export default function ProgressoUsuario() {
  const { progresso } = useConexoes()
  if (!progresso.loaded) {
    return <div className="bg-cosmic-surface/70 border border-cosmic-border rounded-2xl p-5 h-64 animate-pulse" />
  }

  const pct = Math.min(100, Math.round((progresso.xpAtualNoNivel / progresso.xpProximoNivel) * 100))

  return (
    <div className="bg-cosmic-surface/70 backdrop-blur-md border border-cosmic-border rounded-2xl p-5 md:p-6">
      <h3 className="font-serif text-lg text-white mb-4">Seu progresso</h3>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-cosmic-blue-light text-sm">
          Nível <span className="font-semibold">{progresso.nivel}</span>
          <span className="text-neutral-400 ml-2">{progresso.titulo}</span>
        </p>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-cosmic-blue to-cosmic-blue-light rounded-full"
        />
      </div>
      <p className="text-xs text-neutral-500 mb-6 text-right">
        {progresso.xpAtualNoNivel} / {progresso.xpProximoNivel} XP
      </p>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat
          icon="🔗"
          label="Conexões descobertas"
          value={progresso.conexoesDescobertas.length}
          color="text-cosmic-gold"
        />
        <Stat
          icon="🌿"
          label="Trilhas concluídas"
          value={progresso.trilhasConcluidas.length}
          color="text-emerald-400"
        />
        <Stat
          icon="🔥"
          label="Sequência de dias"
          value={progresso.streak}
          color="text-orange-400"
        />
      </div>

    </div>
  )
}

function Stat({ icon, label, value, color }) {
  return (
    <div>
      <div className="text-xl mb-1" aria-hidden="true">{icon}</div>
      <p className="text-xs text-neutral-400 mb-1 leading-tight">{label}</p>
      <p className={`text-2xl font-serif ${color}`}>{value}</p>
    </div>
  )
}

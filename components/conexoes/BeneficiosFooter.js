const BENEFICIOS = [
  { icon: '📖', cor: 'bg-cosmic-purple/15 text-cosmic-purple', titulo: 'Aprenda de forma interativa', desc: 'Conecte passagens e descubra padrões incríveis da Bíblia.' },
  { icon: '🏆', cor: 'bg-emerald-500/15 text-emerald-400', titulo: 'Ganhe pontos e conquistas', desc: 'Seja recompensado por cada conexão descoberta.' },
  { icon: '👥', cor: 'bg-pink-500/15 text-pink-400', titulo: 'Compartilhe e discuta', desc: 'Troque aprendizados com amigos e na comunidade.' },
  { icon: '⚡', cor: 'bg-cosmic-gold/15 text-cosmic-gold', titulo: 'Cresça todos os dias', desc: 'Desafios diários para fortalecer seu conhecimento.' },
]

export default function BeneficiosFooter() {
  return (
    <section className="border-t border-cosmic-border bg-cosmic-surface/40 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {BENEFICIOS.map((b) => (
          <div key={b.titulo} className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${b.cor}`}>
              <span aria-hidden="true">{b.icon}</span>
            </div>
            <div>
              <h3 className="font-serif text-sm text-white mb-1">{b.titulo}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

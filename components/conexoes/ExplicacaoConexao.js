import Link from 'next/link'
import { useConexoes } from '../../contexts/ConexoesContext'

export default function ExplicacaoConexao() {
  const { conexaoAtiva, tts } = useConexoes()
  if (!conexaoAtiva) return null

  function ouvir() {
    if (tts.isSpeaking) {
      tts.stop()
    } else {
      const texto = conexaoAtiva.tradicaoCatolica
        ? `${conexaoAtiva.explicacao} Tradição da Igreja: ${conexaoAtiva.tradicaoCatolica}`
        : conexaoAtiva.explicacao
      tts.speak(texto)
    }
  }

  return (
    <div className="bg-cosmic-surface/40 backdrop-blur-md border border-cosmic-border rounded-2xl p-5 md:p-6">
      <h3 className="font-serif text-lg md:text-xl text-white mb-3">Explicação da conexão</h3>
      <p className="text-neutral-300 leading-relaxed mb-5 text-sm md:text-base">{conexaoAtiva.explicacao}</p>

      {conexaoAtiva.tradicaoCatolica && (
        <div className="mb-5 rounded-xl border border-cosmic-gold/40 bg-gradient-to-br from-cosmic-gold/10 via-cosmic-bg/30 to-transparent p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xs tracking-[0.2em] font-semibold text-cosmic-gold uppercase">Tradição da Igreja</p>
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed">{conexaoAtiva.tradicaoCatolica}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {tts.isSupported && (
          <button
            type="button"
            onClick={ouvir}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-cosmic-border rounded-lg text-sm text-neutral-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
          >
            {tts.isSpeaking ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pausar
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Ouvir explicação
              </>
            )}
          </button>
        )}

        {conexaoAtiva.trilhaId && (
          <Link
            href={`/conexoes/trilhas/${conexaoAtiva.trilhaId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cosmic-blue/10 hover:bg-cosmic-blue/20 border border-cosmic-blue/40 rounded-lg text-sm text-cosmic-blue-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
          >
            Estudar mais
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

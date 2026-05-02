import { useConexoes } from '../../contexts/ConexoesContext'

export default function ExplicacaoConexao() {
  const { conexaoAtiva, tts } = useConexoes()
  if (!conexaoAtiva) return null

  function ouvir() {
    if (tts.isSpeaking) {
      tts.stop()
    } else {
      tts.speak(conexaoAtiva.explicacao)
    }
  }

  return (
    <div className="bg-cosmic-surface/40 backdrop-blur-md border border-cosmic-border rounded-2xl p-5 md:p-6">
      <h3 className="font-serif text-lg md:text-xl text-white mb-3">Explicação da conexão</h3>
      <p className="text-neutral-300 leading-relaxed mb-5 text-sm md:text-base">{conexaoAtiva.explicacao}</p>

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

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cosmic-blue/10 hover:bg-cosmic-blue/20 border border-cosmic-blue/40 rounded-lg text-sm text-cosmic-blue-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light"
        >
          Estudar mais
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

/**
 * Leitura orante da oração com tempo mínimo (~20 caracteres por segundo, mínimo 10s).
 * Ao concluir, chama `onCompletar` — quem coleta a figurinha é o chamador.
 */
export default function OracaoDesbloqueio({ oracao, onCompletar }) {
  const tempoMinimo = Math.max(10, Math.ceil(oracao.length / 20))
  const [rezando, setRezando] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const pronto = segundos >= tempoMinimo

  useEffect(() => {
    if (!rezando || pronto) return
    const intervalo = setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => clearInterval(intervalo)
  }, [rezando, pronto])

  return (
    <div>
      <blockquote className="font-serif italic text-[#2e241b] text-base md:text-lg leading-relaxed text-center px-2">
        {oracao}
      </blockquote>

      <div className="mt-6">
        {!rezando ? (
          <button
            type="button"
            onClick={() => setRezando(true)}
            className="w-full py-3 rounded-full bg-[#1e4fa8] text-white font-medium hover:bg-[#163a7d] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e4fa8] focus-visible:ring-offset-[#ece2cb]"
          >
            Começar a rezar
          </button>
        ) : pronto ? (
          <button
            type="button"
            onClick={onCompletar}
            className="w-full py-3 rounded-full bg-[#c9a227] text-[#1b1406] font-medium hover:bg-[#dcb53a] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8a6a14] focus-visible:ring-offset-[#ece2cb]"
          >
            Amém. Colar a figurinha
          </button>
        ) : (
          <div role="status" aria-live="polite">
            <div className="h-1.5 rounded-full bg-[#8a7556]/25 overflow-hidden">
              <div
                className="h-full bg-[#8a6a14] transition-[width] duration-1000 ease-linear"
                style={{ width: `${(segundos / tempoMinimo) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-center text-sm text-[#6b5a45]">Reze com calma. Faltam {tempoMinimo - segundos}s.</p>
          </div>
        )}
      </div>
    </div>
  )
}

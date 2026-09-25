import Link from 'next/link'
import { useOracoes, registrarOracaoHoje } from '../hooks/useOracoes'

/**
 * "🙏 Rezei": registra esta oração na jornada do usuário (dias rezados, sequência).
 * Não gera figurinha — a única recompensa do álbum ligada a oração é a oração do dia
 * (OracaoDoDiaModal). `ref` no formato "oracao:<slug>" ou "santo:<slug>".
 */

const TEMAS = {
  escuro: {
    botao: 'bg-cosmic-gold text-[#1b1406] hover:bg-amber-300',
    texto: 'text-neutral-300',
    feito: 'text-emerald-300',
    link: 'text-cosmic-blue-light',
  },
  claro: {
    botao: 'bg-accent-600 text-white hover:bg-accent-700',
    texto: 'text-neutral-600',
    feito: 'text-green-700',
    link: 'text-accent-700',
  },
}

function diasDeOracao(n) {
  return n === 1 ? '1 dia de oração' : `${n} dias de oração`
}

export default function BotaoRezei({ oracaoRef, tema = 'escuro', className = '' }) {
  const { loaded, rezouHoje, resumo } = useOracoes()
  const t = TEMAS[tema] || TEMAS.escuro
  const rezada = loaded && rezouHoje(oracaoRef)

  return (
    <div className={`flex flex-col items-center gap-1.5 text-center ${className}`} aria-live="polite">
      {rezada ? (
        <>
          <p className={`font-medium ${t.feito}`}>
            ✓ Rezada hoje · {diasDeOracao(resumo.diasRezados)}
          </p>
          <Link href="/minha-jornada" className={`text-sm hover:underline ${t.link}`}>
            Continuar minha jornada →
          </Link>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => registrarOracaoHoje(oracaoRef)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cosmic-gold ${t.botao}`}
          >
            🙏 Rezei
          </button>
          <p className={`text-sm ${t.texto}`}>Registra esta oração na sua jornada.</p>
        </>
      )}
    </div>
  )
}

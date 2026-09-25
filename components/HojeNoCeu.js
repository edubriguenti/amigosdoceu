import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaceFigurinha, VersoFechado } from './album/Figurinha'
import OracaoDoDiaModal from './OracaoDoDiaModal'
import { useAlbum } from '../hooks/useAlbum'
import { useOracoes } from '../hooks/useOracoes'
import useDiaAtual from '../hooks/useDiaAtual'
import { dataPorExtenso } from '../lib/datas'

/**
 * "Hoje no Amigos do Céu" — o ritual diário da home: a celebração, a oração e a figurinha.
 * A oração do dia é rezada aqui mesmo (OracaoDoDiaModal) e é ela que libera a figurinha do dia.
 *
 * Recebe a janela de dias pronta do servidor (lib/hoje.js → janelaDeDias). Não importe
 * aqui lib/hoje.js, lib/albumData.js ou lib/calendarUtils.js: eles puxam os JSONs
 * inteiros para o bundle da home.
 */

function saudacao(hora) {
  if (hora < 5) return 'Boa noite 🌙'
  if (hora < 12) return 'Bom dia ☀️'
  if (hora < 18) return 'Boa tarde 🌤️'
  return 'Boa noite 🌙'
}

const rotulo = 'text-xs font-semibold uppercase tracking-widest text-cosmic-gold'
const botaoSecundario =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-cosmic-border bg-cosmic-surface-2 text-neutral-100 hover:border-cosmic-gold/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold'
const botaoPrimario =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-cosmic-gold text-[#1b1406] hover:bg-amber-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white'

function HojeNaIgreja({ celebracao, santos, onRezar }) {
  const santo = santos[0]
  return (
    <div className="p-6 flex flex-col">
      <h3 className={rotulo}>✨ Hoje na Igreja</h3>
      {celebracao ? (
        <>
          <p className="mt-3 font-serif text-2xl text-neutral-100 leading-snug">{celebracao.nome}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-neutral-300">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full ring-1 ring-white/30"
              style={{ backgroundColor: celebracao.corHex }}
              aria-hidden="true"
            />
            {celebracao.tipo}
          </p>
          {celebracao.descricao && (
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed line-clamp-3">{celebracao.descricao}</p>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 font-serif text-2xl text-neutral-100">Um dia comum</p>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Nenhuma celebração especial no calendário hoje. É um bom dia para conhecer um santo novo.
          </p>
        </>
      )}
      <div className="mt-auto pt-5 flex flex-wrap gap-2">
        <Link href={santo ? `/santos/${santo.slug}` : '/santos-do-dia'} className={botaoSecundario}>
          Conhecer
        </Link>
        <button type="button" onClick={onRezar} className={botaoSecundario}>
          Rezar
        </button>
      </div>
    </div>
  )
}

function FigurinhaDeHoje({ figurinha, ehSantoDoDia, recemColada, onRezar }) {
  const { loaded, figurinhaDoDiaJaResgatada } = useAlbum()
  const reduzir = useReducedMotion()

  if (!figurinha) return null
  const aberta = loaded && figurinhaDoDiaJaResgatada

  return (
    <div className="p-6 flex gap-5 items-center md:flex-col md:items-start">
      <div className="w-24 sm:w-28 shrink-0 md:order-2 md:mx-auto">
        {aberta ? (
          <motion.div
            key="face"
            initial={recemColada && !reduzir ? { rotateY: 90, opacity: 0 } : false}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <Link href={figurinha.href} aria-label={`Ver ${figurinha.nome} no álbum`} className="block rounded-[5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold">
              <FaceFigurinha figurinha={figurinha} tamanho="sm" />
            </Link>
          </motion.div>
        ) : (
          <VersoFechado />
        )}
      </div>
      <div className="min-w-0 md:order-1 md:w-full">
        <h3 className={rotulo}>🃏 Sua figurinha do dia</h3>
        {aberta ? (
          <>
            <p className="mt-3 font-serif text-xl text-[#ecd07a] leading-snug">{figurinha.nome}</p>
            <p className="mt-1 text-sm text-neutral-400">Colada no seu álbum. Amanhã tem outra.</p>
            <Link href={figurinha.href} className="mt-3 inline-block text-sm text-cosmic-blue-light hover:underline">
              Ver no álbum →
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
              {ehSantoDoDia ? 'Hoje a Igreja celebra um santo que está no álbum. ' : ''}
              Reze a oração de hoje para receber.
            </p>
            <noscript>
              <p className="mt-1 text-sm text-neutral-400">Figurinha de hoje: {figurinha.nome}</p>
            </noscript>
            <button type="button" onClick={onRezar} className={`mt-4 ${botaoPrimario}`}>
              Rezar para receber
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function OracaoDeHoje({ oracao, onRezar }) {
  const { loaded, rezouHoje } = useOracoes()
  if (!oracao) return null
  const rezada = loaded && rezouHoje(oracao.ref)
  return (
    <div className="p-6 flex flex-col">
      <h3 className={rotulo}>🙏 Uma oração para hoje</h3>
      <p className="mt-3 font-serif text-xl text-neutral-100 leading-snug">{oracao.titulo}</p>
      <p className="mt-2 text-sm text-neutral-400 italic leading-relaxed line-clamp-4">{oracao.trecho}</p>
      <div className="mt-auto pt-5 flex flex-wrap items-center gap-3">
        {rezada ? (
          <>
            <span className="text-sm text-emerald-300">✓ Rezada hoje</span>
            <button type="button" onClick={onRezar} className={botaoSecundario}>
              Rezar de novo
            </button>
          </>
        ) : (
          <button type="button" onClick={onRezar} className={botaoPrimario}>
            Rezar agora
          </button>
        )}
      </div>
    </div>
  )
}

export default function HojeNoCeu({ dias, hojeServidor }) {
  const dia = useDiaAtual(dias, hojeServidor)
  const [ola, setOla] = useState(null)
  const [rezando, setRezando] = useState(false)
  const [recemColada, setRecemColada] = useState(false)
  const abrirOracao = () => setRezando(true)

  // Saudação depende do relógio do usuário: só depois da hidratação.
  useEffect(() => setOla(saudacao(new Date().getHours())), [])

  if (!dia) return null

  return (
    <section id="hoje" aria-labelledby="hoje-titulo" className="px-4 pb-10 scroll-mt-4">
      <div className="max-w-6xl mx-auto rounded-3xl border border-cosmic-border bg-gradient-to-br from-cosmic-surface via-cosmic-surface/80 to-cosmic-bg shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] overflow-hidden">
        <header className="px-6 pt-6 pb-4 border-b border-cosmic-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="hoje-titulo" className="font-serif text-2xl md:text-3xl text-neutral-100 min-h-[2.25rem]">
            {ola || 'Hoje'}
          </h2>
          <p className="text-sm text-neutral-400 first-letter:uppercase">{dataPorExtenso(dia.data)}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cosmic-border md:min-h-[17rem]">
          <HojeNaIgreja celebracao={dia.celebracao} santos={dia.santos} onRezar={abrirOracao} />
          <FigurinhaDeHoje
            figurinha={dia.figurinha}
            ehSantoDoDia={dia.figurinhaEhSantoDoDia}
            recemColada={recemColada}
            onRezar={abrirOracao}
          />
          <OracaoDeHoje oracao={dia.oracao} onRezar={abrirOracao} />
        </div>
        <footer className="px-6 py-3 border-t border-cosmic-border text-right">
          <Link href="/minha-jornada" className="text-sm text-cosmic-blue-light hover:underline">
            Continuar minha jornada →
          </Link>
        </footer>
      </div>

      <AnimatePresence>
        {rezando && dia.oracao && (
          <OracaoDoDiaModal
            key="oracao-do-dia"
            dia={dia}
            onClose={() => setRezando(false)}
            onConcluir={({ figurinha }) => setRecemColada(figurinha === 'nova')}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

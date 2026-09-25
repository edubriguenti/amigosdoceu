import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useAlbum } from '../hooks/useAlbum'
import useNovena from '../hooks/useNovena'
import { useProgresso } from '../hooks/useProgresso'
import { useFavoritos } from '../hooks/useFavoritos'
import { getPaginas } from '../lib/albumData'
import { getTrilhas } from '../lib/conexoesData'
import { getIntencoesResumo, getProgressoCristo, getRosarioStats, INTENCOES_PADRAO, ROSARIO_PADRAO } from '../lib/jornada'
import vidaCristo from '../data/vida-cristo.json'

// Só os totais estáticos vêm do build; o progresso é lido do navegador após o mount.
export async function getStaticProps() {
  return {
    props: {
      paginas: getPaginas().map((p) => ({ slug: p.slug, titulo: p.titulo, icone: p.icone || null, ids: [...p.figurinhaIds] })),
      eventos: vidaCristo.map((e) => ({ slug: e.slug, titulo: e.title })),
      totalTrilhas: getTrilhas().length,
    },
  }
}

const MISTERIOS = { gozosos: 'Gozosos', dolorosos: 'Dolorosos', gloriosos: 'Gloriosos', luminosos: 'Luminosos' }
// Domingo → sábado
const MISTERIO_DO_DIA = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos']

const botao =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold'
const botaoPrimario = `${botao} bg-cosmic-gold text-[#1b1406] hover:bg-amber-300`
const botaoSecundario = `${botao} border border-cosmic-border bg-cosmic-surface-2 text-neutral-100 hover:border-cosmic-gold/60`

function Barra({ valor, total, rotulo }) {
  const pct = total ? Math.round((valor / total) * 100) : 0
  return (
    <div
      className="h-2 rounded-full bg-cosmic-surface-2 overflow-hidden"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rotulo}
    >
      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cosmic-gold transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Esqueleto({ className = '' }) {
  return <div className={`rounded-2xl border border-cosmic-border bg-cosmic-surface/50 animate-pulse ${className}`} aria-hidden="true" />
}

function Cartao({ icone, titulo, numero, contexto, children, acao }) {
  return (
    <section className="rounded-2xl border border-cosmic-border bg-cosmic-surface/60 p-5 flex flex-col min-h-[12rem]">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
        <span aria-hidden="true">{icone}</span> {titulo}
      </h2>
      <p className="mt-3 font-serif text-3xl text-neutral-100">{numero}</p>
      {contexto && <p className="mt-1 text-sm text-neutral-400">{contexto}</p>}
      {children}
      <div className="mt-auto pt-4">{acao}</div>
    </section>
  )
}

function CartaoAlbum({ paginas, coletadas }) {
  const porPagina = paginas.map((p) => ({ ...p, n: p.ids.filter((id) => coletadas[id]).length, total: p.ids.length }))
  const total = porPagina.reduce((s, p) => s + p.total, 0)
  const tenho = porPagina.reduce((s, p) => s + p.n, 0)
  const completo = total > 0 && tenho === total
  const incompletas = porPagina.filter((p) => p.n < p.total)
  // Continuar pela página menos completa (proporcionalmente); destacar as mais perto do fim.
  const continuar = [...incompletas].sort((a, b) => a.n / a.total - b.n / b.total)[0]
  const quase = [...incompletas].filter((p) => p.n > 0).sort((a, b) => (a.total - a.n) - (b.total - b.n)).slice(0, 3)

  return (
    <section className="rounded-3xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-surface via-cosmic-surface/80 to-cosmic-bg p-6 md:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-cosmic-gold">📖 Álbum Sagrado</h2>
          <p className="mt-3 font-serif text-4xl md:text-5xl text-neutral-100">
            {tenho} <span className="text-neutral-500 text-2xl md:text-3xl">/ {total}</span>
          </p>
          <p className="mt-1 text-neutral-300">
            {completo ? '🎉 Álbum completo!' : tenho === 0 ? 'Seu álbum ainda está em branco.' : 'Continue colecionando.'}
          </p>
        </div>
        <Link href={continuar ? `/album-sagrado/${continuar.slug}` : '/album-sagrado'} className={botaoPrimario}>
          {completo ? 'Ver álbum' : tenho === 0 ? 'Abrir o álbum' : 'Continuar'} →
        </Link>
      </div>
      <div className="mt-5">
        <Barra valor={tenho} total={total} rotulo="Progresso do álbum" />
      </div>
      {quase.length > 0 && (
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quase.map((p) => (
            <li key={p.slug}>
              <Link href={`/album-sagrado/${p.slug}`} className="block rounded-xl border border-cosmic-border bg-cosmic-bg/40 p-3 hover:border-cosmic-gold/50 transition-colors">
                <span className="block text-sm text-neutral-100 truncate">
                  {p.icone && <span aria-hidden="true">{p.icone} </span>}
                  {p.titulo}
                </span>
                <span className="block text-xs text-neutral-400 mb-2">
                  Faltam {p.total - p.n} de {p.total}
                </span>
                <Barra valor={p.n} total={p.total} rotulo={`Progresso em ${p.titulo}`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function CartaoCristo({ progresso }) {
  const { vistos, total, proximo } = progresso
  return (
    <Cartao
      icone="✝️"
      titulo="Vida de Cristo"
      numero={`${vistos} / ${total}`}
      contexto={proximo ? `Próximo: ${proximo.titulo}` : 'Você contemplou todos os eventos.'}
      acao={
        <Link href={proximo ? `/vida-de-cristo?evento=${encodeURIComponent(proximo.slug)}` : '/vida-de-cristo'} className={vistos ? botaoPrimario : botaoSecundario}>
          {proximo ? (vistos ? 'Continuar' : 'Começar') : 'Rever'} →
        </Link>
      }
    >
      <div className="mt-3">
        <Barra valor={vistos} total={total} rotulo="Progresso na Vida de Cristo" />
      </div>
    </Cartao>
  )
}

function CartaoRosario({ stats, misterioDeHoje }) {
  const minutos = Math.round(stats.tempoTotal / 60)
  const contexto = stats.emProgresso
    ? `Terço em andamento${stats.misterioAtual && MISTERIOS[stats.misterioAtual] ? ` · Mistérios ${MISTERIOS[stats.misterioAtual]}` : ''}`
    : stats.completos
      ? `${minutos} min em oração`
      : `Hoje: Mistérios ${MISTERIOS[misterioDeHoje]}`
  return (
    <Cartao
      icone="📿"
      titulo="Rosário"
      numero={stats.completos === 1 ? '1 completo' : `${stats.completos} completos`}
      contexto={contexto}
      acao={
        <Link href="/rosario" className={stats.emProgresso ? botaoPrimario : botaoSecundario}>
          {stats.emProgresso ? 'Retomar' : 'Rezar o terço de hoje'} →
        </Link>
      }
    />
  )
}

function CartaoNovenas({ novenas }) {
  // useNovena devolve o que estiver no localStorage: normaliza antes de usar.
  const emProgresso = Array.isArray(novenas?.emProgresso) ? novenas.emProgresso.filter((n) => n && n.slug) : []
  const ativa = emProgresso[0]
  const concluidas = Array.isArray(novenas?.completadas) ? novenas.completadas.length : 0
  const duracao = ativa ? Number(ativa.duracao) || 9 : 9
  return (
    <Cartao
      icone="🕯️"
      titulo="Novenas"
      numero={ativa ? `Dia ${Math.min(ativa.diaAtual || 1, duracao)} / ${duracao}` : concluidas ? `${concluidas} concluída${concluidas > 1 ? 's' : ''}` : 'Nenhuma ainda'}
      contexto={
        ativa
          ? `${ativa.nome}${emProgresso.length > 1 ? ` · +${emProgresso.length - 1} em andamento` : ''}`
          : 'Nove dias de oração por uma intenção.'
      }
      acao={
        <Link href={ativa ? `/novenas/${ativa.slug}` : '/novenas'} className={ativa ? botaoPrimario : botaoSecundario}>
          {ativa ? 'Continuar' : 'Começar uma novena'} →
        </Link>
      }
    >
      {ativa && (
        <div className="mt-3">
          <Barra valor={Array.isArray(ativa.diasCompletados) ? ativa.diasCompletados.length : 0} total={duracao} rotulo={`Progresso na ${ativa.nome}`} />
        </div>
      )}
    </Cartao>
  )
}

function CartaoConexoes({ progresso, totalTrilhas }) {
  const comecou = progresso.xp > 0
  return (
    <Cartao
      icone="🧭"
      titulo="Conexões da Bíblia"
      numero={`Nível ${progresso.nivel}`}
      contexto={`${progresso.titulo} · ${progresso.xp} XP${progresso.streak ? ` · 🔥 ${progresso.streak} dia${progresso.streak > 1 ? 's' : ''}` : ''}`}
      acao={
        <Link href="/conexoes" className={comecou ? botaoPrimario : botaoSecundario}>
          {comecou ? 'Continuar trilha' : 'Começar a explorar'} →
        </Link>
      }
    >
      <p className="mt-2 text-xs text-neutral-500">
        {progresso.trilhasConcluidas.length} de {totalTrilhas} trilhas concluídas
      </p>
    </Cartao>
  )
}

export default function MinhaJornada({ paginas, eventos, totalTrilhas }) {
  const album = useAlbum()
  const { novenas, isLoaded: novenasLoaded } = useNovena()
  const progresso = useProgresso()
  const { favoritos, loaded: favoritosLoaded } = useFavoritos()

  const [rosario, setRosario] = useState(ROSARIO_PADRAO)
  const [intencoes, setIntencoes] = useState(INTENCOES_PADRAO)
  const [misterioDeHoje, setMisterioDeHoje] = useState('gozosos')
  const [lido, setLido] = useState(false)

  useEffect(() => {
    setRosario(getRosarioStats())
    setIntencoes(getIntencoesResumo())
    setMisterioDeHoje(MISTERIO_DO_DIA[new Date().getDay()])
    setLido(true)
  }, [])

  const cristo = useMemo(() => getProgressoCristo(album.estado.coletadas, eventos), [album.estado.coletadas, eventos])
  const totalFavoritos = (favoritos?.santos?.length || 0) + (favoritos?.igrejas?.length || 0) + (favoritos?.aparicoes?.length || 0)
  const pronto = lido && album.loaded && novenasLoaded && progresso.loaded && favoritosLoaded

  return (
    <Layout>
      <SEO
        title="Minha Jornada"
        description="Seu caminho pelo Amigos do Céu: álbum, Vida de Cristo, rosário, novenas e conexões bíblicas em um só lugar."
        url="https://amigosdoceu.vercel.app/minha-jornada"
        noindex
      />
      <div className="py-10 max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif mb-3">✨ Minha Jornada</h1>
          <p className="text-lg text-neutral-300">Seu caminho pelo Amigos do Céu. Continue de onde parou.</p>
          <p className="mt-2 text-xs text-neutral-500">🔒 Tudo aqui fica salvo só neste navegador.</p>
        </header>

        {pronto ? (
          <div className="space-y-6">
            <CartaoAlbum paginas={paginas} coletadas={album.estado.coletadas} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CartaoCristo progresso={cristo} />
              <CartaoRosario stats={rosario} misterioDeHoje={misterioDeHoje} />
              <CartaoNovenas novenas={novenas} />
              <CartaoConexoes progresso={progresso} totalTrilhas={totalTrilhas} />
            </div>

            <nav aria-label="Atalhos pessoais" className="flex flex-col sm:flex-row gap-3">
              <Link href="/favoritos" className="flex-1 flex items-center justify-between rounded-2xl border border-cosmic-border bg-cosmic-surface/40 px-5 py-4 hover:border-cosmic-gold/50 transition-colors">
                <span>❤️ Favoritos</span>
                <span className="text-neutral-400 text-sm">{totalFavoritos} →</span>
              </Link>
              <Link href="/intencoes" className="flex-1 flex items-center justify-between rounded-2xl border border-cosmic-border bg-cosmic-surface/40 px-5 py-4 hover:border-cosmic-gold/50 transition-colors">
                <span>🙏 Minhas intenções</span>
                <span className="text-neutral-400 text-sm">
                  {intencoes.total}
                  {intencoes.rezadasNaSemana > 0 && ` · ${intencoes.rezadasNaSemana} rezada${intencoes.rezadasNaSemana > 1 ? 's' : ''} nesta semana`} →
                </span>
              </Link>
            </nav>
          </div>
        ) : (
          <div className="space-y-6">
            <Esqueleto className="h-56" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <Esqueleto key={i} className="h-48" />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import EtapaCard from '../../components/peregrinacoes/EtapaCard'
import { usePeregrinacoes } from '../../hooks/usePeregrinacoes'
import { getRota, getRotasCompletas } from '../../lib/peregrinacoesData'
import { arquivoGpxRota } from '../../lib/peregrinacoesRegras'

const RotaMapa = dynamic(() => import('../../components/peregrinacoes/RotaMapa'), {
  ssr: false,
  loading: () => (
    <div className="mapa-moldura h-full">
      <div className="mapa-antigo flex items-center justify-center text-sm text-[#5c4b36]">Abrindo o mapa…</div>
    </div>
  ),
})

export async function getStaticPaths() {
  return { paths: getRotasCompletas().map((r) => ({ params: { slug: r.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const rota = getRota(params.slug)
  if (!rota) return { notFound: true }
  return { props: { rota } }
}

const numero = (v, casas = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

export default function PaginaRota({ rota }) {
  const router = useRouter()
  const { loaded, feitasDe, alternarEtapa } = usePeregrinacoes()
  const feitas = feitasDe(rota.slug)
  const totalFeitas = loaded ? rota.etapas.filter((e) => feitas[e.numero]).length : 0
  const proxima = loaded ? rota.etapas.find((e) => !feitas[e.numero]) : null

  // Etapa em foco no mapa. Começa sem foco (rota inteira) e passa a seguir a rolagem.
  const [ativa, setAtiva] = useState(null)
  const seguirRolagem = useRef(false)
  const listaRef = useRef(null)

  const irParaEtapa = useCallback((n, { rolar = true } = {}) => {
    setAtiva(n)
    if (!rolar) return
    const el = document.getElementById(`etapa-${n}`)
    if (!el) return
    const semMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' })
  }, [])

  // A etapa que cruza a faixa central da tela vira a etapa em foco.
  useEffect(() => {
    const lista = listaRef.current
    if (!lista || typeof IntersectionObserver === 'undefined') return
    const aoRolar = () => {
      seguirRolagem.current = true
    }
    window.addEventListener('scroll', aoRolar, { passive: true, once: true })
    const obs = new IntersectionObserver(
      (entradas) => {
        if (!seguirRolagem.current) return
        const visivel = entradas.find((en) => en.isIntersecting)
        if (visivel) setAtiva(Number(visivel.target.dataset.etapa))
      },
      { rootMargin: '-50% 0px -45% 0px' }
    )
    lista.querySelectorAll('[data-etapa]').forEach((el) => obs.observe(el))
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', aoRolar)
    }
  }, [rota.slug])

  // Deep-link: /peregrinacoes/<slug>?etapa=<n>
  useEffect(() => {
    if (!router.isReady) return
    const n = Number(router.query.etapa)
    if (Number.isInteger(n) && n >= 1 && n <= rota.totalEtapas) {
      seguirRolagem.current = true
      irParaEtapa(n)
    }
  }, [router.isReady, router.query.etapa, rota.totalEtapas, irParaEtapa])

  const alternar = useCallback((n) => alternarEtapa(rota.slug, n), [alternarEtapa, rota.slug])
  const focar = useCallback(
    (n) => {
      seguirRolagem.current = true
      setAtiva(n)
      // No celular o mapa fica no topo: leva o cartão para logo abaixo dele.
      if (window.matchMedia('(max-width: 1023px)').matches) irParaEtapa(n)
    },
    [irParaEtapa]
  )

  const url = `https://amigosdoceu.vercel.app/peregrinacoes/${rota.slug}`
  const estruturado = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: rota.nome,
    description: rota.resumo,
    url,
    inLanguage: 'pt-BR',
    touristType: 'Peregrinos',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: rota.totalEtapas,
      itemListElement: rota.etapas.map((e) => ({
        '@type': 'ListItem',
        position: e.numero,
        name: `Etapa ${e.numero}: ${e.origem} → ${e.destino}`,
        url: `${url}?etapa=${e.numero}`,
      })),
    },
  }

  return (
    <Layout>
      <SEO
        title={`${rota.nome}: roteiro etapa por etapa`}
        description={`${rota.resumo} Roteiro em ${rota.totalEtapas} etapas, com mapa, distâncias, relevo, paradas sagradas e oração para cada trecho.`}
        url={url}
        keywords={`${rota.nome}, peregrinação, roteiro de peregrinação, etapas, ${rota.destino}, mapa da peregrinação, GPX`}
        structuredData={estruturado}
      />

      <div className="py-8 md:py-10">
        <nav aria-label="Trilha de navegação" className="text-sm text-neutral-400 mb-2 flex flex-wrap items-center">
          <Link href="/peregrinacoes" className="inline-flex min-h-[44px] items-center hover:text-cosmic-gold underline-offset-4 hover:underline">
            Peregrinações
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-neutral-200">{rota.nome}</span>
        </nav>

        <header className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-50">{rota.nome}</h1>
          {rota.subtitulo && <p className="mt-2 text-lg text-cosmic-gold font-serif">{rota.subtitulo}</p>}
          <p className="mt-4 text-lg text-neutral-200 leading-relaxed">{rota.resumo}</p>

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['Distância', rota.distanciaKm != null ? `${numero(rota.distanciaKm)} km` : '—'],
              ['Etapas', rota.totalEtapas],
              ['Subida total', rota.subidaM != null ? `${numero(rota.subidaM)} m` : '—'],
              ['Feitas', loaded ? `${totalFeitas} de ${rota.totalEtapas}` : '—'],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="rounded-xl border border-cosmic-border bg-cosmic-surface/50 px-4 py-3">
                <dt className="text-xs uppercase tracking-widest text-neutral-400">{rotulo}</dt>
                <dd className="mt-1 font-serif text-2xl text-neutral-50">{valor}</dd>
              </div>
            ))}
          </dl>

          <div
            className="mt-3 h-2 rounded-full bg-cosmic-surface-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={totalFeitas}
            aria-valuemin={0}
            aria-valuemax={rota.totalEtapas}
            aria-label={`Etapas feitas no ${rota.nome}`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cosmic-gold transition-[width] duration-700"
              style={{ width: `${(totalFeitas / rota.totalEtapas) * 100}%` }}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {proxima && (
              <button
                type="button"
                onClick={() => {
                  seguirRolagem.current = true
                  irParaEtapa(proxima.numero)
                }}
                className="inline-flex min-h-[44px] items-center rounded-full bg-cosmic-gold px-5 py-2 text-sm font-semibold text-[#1b1406] hover:bg-amber-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-bg"
              >
                {totalFeitas ? `Continuar na etapa ${proxima.numero}` : 'Começar pela etapa 1'} →
              </button>
            )}
            {loaded && !proxima && (
              <p className="inline-flex min-h-[44px] items-center rounded-full border border-emerald-400/50 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-200">
                ✓ Caminho concluído. Deus seja louvado!
              </p>
            )}
            <a
              href={arquivoGpxRota(rota.slug)}
              download
              className="inline-flex min-h-[44px] items-center rounded-full border border-cosmic-border bg-cosmic-surface-2 px-5 py-2 text-sm text-neutral-100 hover:border-cosmic-gold/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
            >
              Baixar a rota inteira (GPX)
            </a>
          </div>

          <details className="mt-6 rounded-xl border border-cosmic-border bg-cosmic-surface/40 px-5 py-4 group">
            <summary className="cursor-pointer min-h-[44px] flex items-center font-serif text-lg text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold rounded">
              História e avisos ao peregrino
            </summary>
            <div className="mt-3 space-y-3 text-neutral-200 leading-relaxed">
              <p>{rota.historia}</p>
              {rota.notaEtapas && <p>{rota.notaEtapas}</p>}
              {rota.notaTracado && <p>{rota.notaTracado}</p>}
              <p className="text-sm text-neutral-400">
                Distâncias e relevo foram medidos sobre o traçado do mapa
                {rota.distanciaOficial ? ` (a distância divulgada oficialmente é de ${rota.distanciaOficial})` : ''}; tempos e dificuldade são estimativas para
                quem caminha em ritmo médio. Hospedagem, preços e horários mudam com frequência e não são listados aqui.
              </p>
              {rota.fonteOficial && (
                <p>
                  Fonte oficial para planejar:{' '}
                  <a href={rota.fonteOficial.url} target="_blank" rel="noopener noreferrer" className="text-cosmic-gold underline underline-offset-4 hover:text-amber-300">
                    {rota.fonteOficial.nome}
                    <span className="sr-only"> (nova aba)</span>
                  </a>
                  .
                </p>
              )}
            </div>
          </details>
        </header>

        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Mapa: preso no topo no celular, fixo à esquerda no computador */}
          <div className="sticky top-14 md:top-16 z-20 -mx-4 px-4 pb-3 bg-cosmic-bg lg:mx-0 lg:px-0 lg:pb-0 lg:bg-transparent lg:top-20 lg:self-start">
            <div className="h-[38vh] min-h-[240px] lg:h-[calc(100vh-7rem)]">
              <RotaMapa slug={rota.slug} nome={rota.nome} etapas={rota.etapas} ativa={ativa} feitas={loaded ? feitas : {}} onSelecionar={irParaEtapa} className="h-full" />
            </div>
          </div>

          <section aria-labelledby="roteiro-titulo" className="mt-6 lg:mt-0">
            <h2 id="roteiro-titulo" className="font-serif text-2xl text-neutral-50 mb-4">
              Roteiro etapa por etapa
            </h2>
            <div ref={listaRef} className="space-y-5">
              {rota.etapas.map((e) => (
                <EtapaCard
                  key={e.numero}
                  rotaSlug={rota.slug}
                  etapa={e}
                  ativa={ativa === e.numero}
                  feita={Boolean(feitas[e.numero])}
                  carregado={loaded}
                  onAlternar={alternar}
                  onFocar={focar}
                />
              ))}
            </div>
            <p className="mt-6 text-xs text-neutral-400">
              🔒 As etapas marcadas ficam salvas só neste navegador. Traçado: © colaboradores do{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
                OpenStreetMap
              </a>{' '}
              (ODbL).
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}

import Link from 'next/link'
import { motion } from 'framer-motion'
import SEO from '../../../components/SEO'
import { getTrilhas, getConexoesByTrilha, getTrilhaById } from '../../../lib/conexoesData'

export async function getStaticPaths() {
  return {
    paths: getTrilhas().map((t) => ({ params: { slug: t.id } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const trilha = getTrilhaById(params.slug)
  if (!trilha) return { notFound: true }
  const conexoes = getConexoesByTrilha(trilha.id)
  return { props: { trilha, conexoes } }
}

export default function TrilhaPage({ trilha, conexoes }) {
  const url = `https://amigosdoceu.vercel.app/conexoes/trilhas/${trilha.id}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: trilha.nome,
    description: trilha.descricao,
    url,
    inLanguage: 'pt-BR',
    learningResourceType: 'Course',
    hasPart: conexoes.map((c) => ({
      '@type': 'LearningResource',
      name: c.tema,
      url: `https://amigosdoceu.vercel.app/conexoes?ref=${c.slug}`,
    })),
  }

  return (
    <>
      <SEO
        title={`${trilha.nome} — Conexões da Bíblia`}
        description={`${trilha.descricao}. ${conexoes.length} conexões entre Antigo e Novo Testamento à luz da tradição católica.`}
        url={url}
        keywords={`${trilha.nome}, conexões bíblicas, tipologia, ${trilha.id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-cosmic-bg text-neutral-100">
        {/* Header próprio (sem MinimalHeader externo, mantemos o tema cosmic da página /conexoes) */}
        <header className="border-b border-cosmic-border bg-cosmic-surface/40 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <Link href="/conexoes" className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para Conexões
            </Link>
            <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Amigos do Céu
            </Link>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <p className="text-xs tracking-[0.25em] font-semibold text-cosmic-gold uppercase mb-3">Trilha temática</p>
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-3">{trilha.nome}</h1>
          <p className="text-neutral-300 text-base md:text-lg max-w-2xl">{trilha.descricao}</p>
          <p className="text-sm text-neutral-500 mt-4">
            {conexoes.length} {conexoes.length === 1 ? 'conexão disponível' : 'conexões disponíveis'}
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 md:px-8 pb-16 space-y-6">
          {conexoes.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
              className="bg-cosmic-surface/60 backdrop-blur-md border border-cosmic-border rounded-2xl overflow-hidden"
            >
              <div className="px-5 md:px-6 py-4 border-b border-cosmic-border flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs tracking-[0.2em] text-cosmic-blue-light uppercase mb-1">Tema</p>
                  <h2 className="font-serif text-xl md:text-2xl text-white">{c.tema}</h2>
                </div>
                <Link
                  href={`/conexoes?ref=${c.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cosmic-blue/10 hover:bg-cosmic-blue/20 border border-cosmic-blue/40 rounded-lg text-sm text-cosmic-blue-light transition-colors"
                >
                  Explorar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">
                <div className="bg-gradient-to-br from-amber-900/20 to-cosmic-bg p-5 md:p-6 md:border-r border-cosmic-border">
                  <p className="text-xs tracking-[0.2em] font-semibold text-cosmic-gold mb-2">ANTIGO TESTAMENTO</p>
                  <h3 className="font-serif text-lg text-white mb-2">{c.antigoTestamento.referencia}</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">{c.antigoTestamento.texto}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/20 to-cosmic-bg p-5 md:p-6 border-t md:border-t-0 border-cosmic-border">
                  <p className="text-xs tracking-[0.2em] font-semibold text-cosmic-blue-light mb-2">NOVO TESTAMENTO</p>
                  <h3 className="font-serif text-lg text-white mb-2">{c.novoTestamento.referencia}</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">{c.novoTestamento.texto}</p>
                </div>
              </div>

              <div className="px-5 md:px-6 py-5 border-t border-cosmic-border space-y-4">
                <p className="text-sm md:text-base text-neutral-200 leading-relaxed">{c.explicacao}</p>
                {c.tradicaoCatolica && (
                  <div className="rounded-xl border border-cosmic-gold/40 bg-gradient-to-br from-cosmic-gold/10 via-cosmic-bg/30 to-transparent p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-xs tracking-[0.2em] font-semibold text-cosmic-gold uppercase">Tradição da Igreja</p>
                    </div>
                    <p className="text-sm text-neutral-200 leading-relaxed">{c.tradicaoCatolica}</p>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </section>

        <div className="border-t border-cosmic-border bg-cosmic-surface/40">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 text-center">
            <Link
              href="/conexoes"
              className="inline-flex items-center gap-2 px-5 py-3 bg-cosmic-blue/15 hover:bg-cosmic-blue/25 border border-cosmic-blue/40 rounded-lg text-sm text-cosmic-blue-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Explorar outras trilhas
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import FavoritoButton from '../../components/FavoritoButton'
import RelacionamentosSanto from '../../components/RelacionamentosSanto'
import saints from '../../data/santos.json'
import { motion } from 'framer-motion'
import FigurinhaNoSite from '../../components/album/FigurinhaNoSite'
import EntidadesRelacionadas from '../../components/EntidadesRelacionadas'
import { resumoFigurinha } from '../../lib/albumData'
import { getRelacionadas, getFestaDoSanto } from '../../lib/relacoes'

const SITE_URL = 'https://amigosdoceu.vercel.app'

export async function getStaticPaths() {
  return {
    paths: saints
      .filter((s) => s.slug)
      .map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const saint = saints.find((s) => s.slug === params.slug) || null
  if (!saint) return { notFound: true }
  return {
    props: {
      saint,
      figurinha: resumoFigurinha('santo', saint.slug),
      festa: getFestaDoSanto(saint.slug),
      // santo↔santo já aparece em RelacionamentosSanto
      relacionadas: getRelacionadas('santo', saint.slug, { excluirTipos: ['santo'] }),
    },
  }
}

function buildSchema(saint) {
  const url = `${SITE_URL}/santos/${saint.slug}`
  const imageUrl = saint.imagem?.startsWith('http')
    ? saint.imagem
    : `${SITE_URL}${saint.imagem || ''}`

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: saint.nome,
    description: saint.descricao,
    url,
    image: imageUrl || undefined,
    birthDate: saint.dataNascimento || undefined,
    deathDate: saint.dataFalecimento || undefined,
    nationality: saint.pais || undefined,
    additionalType: 'https://schema.org/Saint',
    sameAs: undefined,
    memberOf: saint.ordemReligiosa
      ? { '@type': 'Organization', name: saint.ordemReligiosa }
      : undefined,
    additionalProperty: [
      saint.dataCanonizacao && {
        '@type': 'PropertyValue',
        name: 'Data de Canonização',
        value: saint.dataCanonizacao,
      },
      saint.padroeiro?.length && {
        '@type': 'PropertyValue',
        name: 'Padroeiro de',
        value: saint.padroeiro.join(', '),
      },
      saint.doutorIgreja && {
        '@type': 'PropertyValue',
        name: 'Doutor da Igreja',
        value: 'Sim',
      },
    ].filter(Boolean),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Santos', item: `${SITE_URL}/santos` },
      { '@type': 'ListItem', position: 3, name: saint.nome, item: url },
    ],
  }

  return [person, breadcrumb]
}

export default function SaintPage({ saint, figurinha, festa, relacionadas }) {
  const oracaoCompleta = relacionadas.find((g) => g.tipo === 'oracao')?.itens[0]
  const url = `${SITE_URL}/santos/${saint.slug}`
  const description = (saint.descricao || `Vida e devoção de ${saint.nome}.`).slice(0, 160)
  const keywords = [
    saint.nome,
    'santo católico',
    saint.ordemReligiosa,
    saint.pais,
    saint.periodo,
    ...(saint.padroeiro || []).map((p) => `padroeiro de ${p}`),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Layout>
      <SEO
        title={saint.nome}
        description={description}
        url={url}
        image={saint.imagem || '/images/site/og-image.jpg'}
        keywords={keywords}
        type="article"
        structuredData={buildSchema(saint)}
      />
      <article className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative img-hero rounded-lg shadow-lg mb-6 overflow-hidden">
              {saint.imagem && (
                <Image
                  src={saint.imagem}
                  alt={`Imagem de ${saint.nome}${saint.periodo ? ' — ' + saint.periodo : ''}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute top-4 right-4 z-10">
                <FavoritoButton tipo="santos" item={saint} variant="button" size="md" />
              </div>
            </div>
            <h1 className="text-3xl font-serif mb-3">{saint.nome}</h1>
            {festa && (
              <p className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cosmic-gold/40 bg-cosmic-gold/10 text-sm text-cosmic-gold">
                  📅 Festa: {festa.data}
                </span>
              </p>
            )}
            <div className="prose max-w-none">
              <p>{saint.descricao}</p>
            </div>
            {saint.oracao && (
              <section id="oracao" aria-labelledby="oracao-titulo" className="mt-6 rounded-2xl border border-cosmic-border bg-cosmic-surface/50 p-5 scroll-mt-20">
                <h2 id="oracao-titulo" className="text-xs font-semibold uppercase tracking-widest text-cosmic-gold mb-2">🙏 Oração</h2>
                <blockquote className="italic text-neutral-200 leading-relaxed">{saint.oracao}</blockquote>
                {oracaoCompleta && (
                  <Link href={oracaoCompleta.href} className="mt-3 inline-block text-sm text-cosmic-blue-light hover:underline">
                    Rezar a {oracaoCompleta.nome} →
                  </Link>
                )}
              </section>
            )}

            {saint.tags && (
              <div className="mt-6">
                {saint.tags.map((t) => (
                  <span key={t} className="inline-block mr-2 px-3 py-1 text-sm border rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <FigurinhaNoSite figurinha={figurinha} />
        <EntidadesRelacionadas grupos={relacionadas} />
        <RelacionamentosSanto santoSlug={saint.slug} santosData={saints} />
      </article>
    </Layout>
  )
}

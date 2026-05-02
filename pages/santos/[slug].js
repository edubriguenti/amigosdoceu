import Image from 'next/image'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import FavoritoButton from '../../components/FavoritoButton'
import RelacionamentosSanto from '../../components/RelacionamentosSanto'
import saints from '../../data/santos.json'
import { motion } from 'framer-motion'

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
  return { props: { saint } }
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

export default function SaintPage({ saint }) {
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
        image={saint.imagem || '/images/og-image.jpg'}
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
            <h1 className="text-3xl font-serif mb-4">{saint.nome}</h1>
            <div className="prose max-w-none">
              <p>{saint.descricao}</p>
              {saint.oracao && (
                <blockquote className="italic mt-4 p-4 border-l-4">{saint.oracao}</blockquote>
              )}
            </div>

            {saint.tags && (
              <div className="mt-6">
                {saint.tags.map((t) => (
                  <span key={t} className="inline-block mr-2 px-3 py-1 text-sm border rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <RelacionamentosSanto santoSlug={saint.slug} santosData={saints} />
      </article>
    </Layout>
  )
}

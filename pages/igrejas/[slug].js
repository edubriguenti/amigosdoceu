import Image from 'next/image'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import FavoritoButton from '../../components/FavoritoButton'
import churches from '../../data/igrejas.json'
import { motion } from 'framer-motion'

const SITE_URL = 'https://amigosdoceu.vercel.app'

export async function getStaticPaths() {
  return {
    paths: churches
      .filter((c) => c.slug)
      .map((c) => ({ params: { slug: c.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const church = churches.find((c) => c.slug === params.slug) || null
  if (!church) return { notFound: true }
  return { props: { church } }
}

function buildSchema(church) {
  const url = `${SITE_URL}/igrejas/${church.slug}`
  const imageUrl = church.imagem?.startsWith('http')
    ? church.imagem
    : `${SITE_URL}${church.imagem || ''}`

  const place = {
    '@context': 'https://schema.org',
    '@type': ['Place', 'ReligiousBuilding', 'LandmarksOrHistoricalBuildings'],
    name: church.nome,
    description: church.descricao,
    url,
    image: imageUrl || undefined,
    address: church.local
      ? { '@type': 'PostalAddress', addressLocality: church.cidade, addressCountry: church.pais, name: church.local }
      : undefined,
    geo:
      church.latitude && church.longitude
        ? { '@type': 'GeoCoordinates', latitude: church.latitude, longitude: church.longitude }
        : undefined,
    dateCreated: church.ano ? String(church.ano) : undefined,
    architect: church.arquiteto ? { '@type': 'Person', name: church.arquiteto } : undefined,
    additionalProperty: [
      church.estiloArquitetonico && {
        '@type': 'PropertyValue',
        name: 'Estilo Arquitetônico',
        value: church.estiloArquitetonico,
      },
      church.tipo && { '@type': 'PropertyValue', name: 'Tipo', value: church.tipo },
      church.capacidade && {
        '@type': 'PropertyValue',
        name: 'Capacidade',
        value: String(church.capacidade),
      },
    ].filter(Boolean),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Igrejas', item: `${SITE_URL}/igrejas` },
      { '@type': 'ListItem', position: 3, name: church.nome, item: url },
    ],
  }

  return [place, breadcrumb]
}

export default function ChurchPage({ church }) {
  const url = `${SITE_URL}/igrejas/${church.slug}`
  const description = (church.descricao || `Conheça ${church.nome}.`).slice(0, 160)
  const keywords = [
    church.nome,
    church.cidade,
    church.pais,
    church.estiloArquitetonico,
    church.tipo,
    'igreja católica',
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Layout>
      <SEO
        title={church.nome}
        description={description}
        url={url}
        image={church.imagem || '/images/og-image.jpg'}
        keywords={keywords}
        type="article"
        structuredData={buildSchema(church)}
      />
      <article className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative img-hero rounded-lg shadow-lg mb-6 overflow-hidden">
              {church.imagem && (
                <Image
                  src={church.imagem}
                  alt={`Fotografia de ${church.nome}${church.cidade ? ' — ' + church.cidade : ''}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute top-4 right-4 z-10">
                <FavoritoButton tipo="igrejas" item={church} variant="button" size="md" />
              </div>
            </div>
            <h1 className="text-3xl font-serif mb-2">{church.nome}</h1>
            <p className="text-lg text-gray-600 mb-6">{church.local}</p>

            <div className="prose max-w-none">
              <p className="text-lg mb-4">{church.descricao}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 bg-parchment/30 rounded-lg">
                {church.ano && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Ano de Construção</h3>
                    <p className="text-gray-900">{church.ano}</p>
                  </div>
                )}
                {church.arquiteto && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Arquiteto</h3>
                    <p className="text-gray-900">{church.arquiteto}</p>
                  </div>
                )}
              </div>

              {church.importancia && (
                <blockquote className="italic mt-4 p-4 border-l-4 border-gray-300 bg-gray-50">
                  <strong>Importância:</strong> {church.importancia}
                </blockquote>
              )}
            </div>
          </div>
        </motion.div>
      </article>
    </Layout>
  )
}

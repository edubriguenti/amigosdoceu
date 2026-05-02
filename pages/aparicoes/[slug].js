import Image from 'next/image'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import FavoritoButton from '../../components/FavoritoButton'
import aparicoes from '../../data/aparicoes.json'
import { motion } from 'framer-motion'

const SITE_URL = 'https://amigosdoceu.vercel.app'

export async function getStaticPaths() {
  return {
    paths: aparicoes
      .filter((a) => a.slug)
      .map((a) => ({ params: { slug: a.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const aparicao = aparicoes.find((a) => a.slug === params.slug) || null
  if (!aparicao) return { notFound: true }
  return { props: { aparicao } }
}

// Tenta extrair uma data ISO de strings como "1917", "13 de maio de 1917" ou "1858-02-11".
function toIsoDate(raw) {
  if (!raw) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const yearMatch = String(raw).match(/\b(1[0-9]{3}|20[0-9]{2})\b/)
  return yearMatch ? yearMatch[1] : undefined
}

function buildSchema(aparicao) {
  const url = `${SITE_URL}/aparicoes/${aparicao.slug}`
  const imageUrl = aparicao.imagem?.startsWith('http')
    ? aparicao.imagem
    : `${SITE_URL}${aparicao.imagem || ''}`
  const startDate = toIsoDate(aparicao.data)

  const event = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: aparicao.nome,
    description: aparicao.historia,
    url,
    image: imageUrl || undefined,
    startDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location:
      aparicao.latitude && aparicao.longitude
        ? {
            '@type': 'Place',
            name: aparicao.local,
            geo: {
              '@type': 'GeoCoordinates',
              latitude: aparicao.latitude,
              longitude: aparicao.longitude,
            },
          }
        : { '@type': 'Place', name: aparicao.local },
    organizer: {
      '@type': 'Organization',
      name: 'Amigos do Céu',
      url: SITE_URL,
    },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Aparições', item: `${SITE_URL}/aparicoes` },
      { '@type': 'ListItem', position: 3, name: aparicao.nome, item: url },
    ],
  }

  return [event, breadcrumb]
}

export default function AparicaoPage({ aparicao }) {
  const url = `${SITE_URL}/aparicoes/${aparicao.slug}`
  const description = (aparicao.historia || `Aparição mariana em ${aparicao.local}.`).slice(0, 160)
  const keywords = [
    aparicao.nome,
    aparicao.local,
    'aparição mariana',
    'nossa senhora',
    ...(aparicao.tags || []),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Layout>
      <SEO
        title={aparicao.nome}
        description={description}
        url={url}
        image={aparicao.imagem || '/images/og-image.jpg'}
        keywords={keywords}
        type="article"
        structuredData={buildSchema(aparicao)}
      />
      <article className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative img-hero rounded-lg shadow-lg mb-6 overflow-hidden">
              {aparicao.imagem && (
                <Image
                  src={aparicao.imagem}
                  alt={`Imagem da aparição mariana em ${aparicao.local}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute top-4 right-4 z-10">
                <FavoritoButton tipo="aparicoes" item={aparicao} variant="button" size="md" />
              </div>
            </div>

            <h1 className="text-3xl font-serif mb-4">{aparicao.nome}</h1>

            <div className="flex flex-col gap-2 mb-6 text-gray-700">
              <div className="flex items-start">
                <span className="font-semibold mr-2">Local:</span>
                <span>{aparicao.local}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-2">Data:</span>
                <span>{aparicao.data}</span>
              </div>
              {aparicao.linkGoogleMaps && (
                <div className="flex items-start">
                  <a
                    href={aparicao.linkGoogleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Ver no Google Maps
                  </a>
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-serif mb-3">História da Aparição</h2>
              <p className="text-gray-700 leading-relaxed">{aparicao.historia}</p>
            </div>

            {aparicao.tags && (
              <div className="mt-6">
                {aparicao.tags.map((t) => (
                  <span key={t} className="inline-block mr-2 px-3 py-1 text-sm border rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </article>
    </Layout>
  )
}

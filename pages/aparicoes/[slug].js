import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import aparicoes from '../../data/aparicoes.json'
import { motion } from 'framer-motion'

export default function AparicaoPage() {
  const router = useRouter()
  const { slug } = router.query

  const aparicao = aparicoes.find(a => a.slug === slug) || aparicoes[0]

  return (
    <Layout>
      <article className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-4xl mx-auto">
            <img src={aparicao.imagem} alt={aparicao.nome} className="img-hero rounded-lg shadow-lg mb-6" />

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
              <div className="flex items-start">
                <a
                  href={aparicao.linkGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Ver no Google Maps
                </a>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-serif mb-3">História da Aparição</h2>
              <p className="text-gray-700 leading-relaxed">{aparicao.historia}</p>
            </div>

            {aparicao.tags && (
              <div className="mt-6">
                {aparicao.tags.map(t => (
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

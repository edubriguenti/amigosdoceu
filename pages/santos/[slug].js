import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import FavoritoButton from '../../components/FavoritoButton'
import RelacionamentosSanto from '../../components/RelacionamentosSanto'
import YouTubePlayer from '../../components/YouTubePlayer'
import saints from '../../data/santos.json'
import { motion } from 'framer-motion'

export default function SaintPage() {
  const router = useRouter()
  const { slug } = router.query

  const saint = saints.find(s => s.slug === slug) || saints[0]

  return (
    <Layout>
      <article className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              <img src={saint.imagem} alt={saint.nome} className="img-hero rounded-lg shadow-lg mb-6" />
              <div className="absolute top-4 right-4">
                <FavoritoButton tipo="santos" item={saint} variant="button" size="md" />
              </div>
            </div>
            <h1 className="text-3xl font-serif mb-4">{saint.nome}</h1>
            <div className="prose max-w-none">
              <p>{saint.descricao}</p>
              <blockquote className="italic mt-4 p-4 border-l-4">{saint.oracao}</blockquote>
            </div>

            {/* Player de Oração em Vídeo */}
            {saint.videoOracaoId && (
              <div className="mt-6 flex justify-center">
                <YouTubePlayer
                  videoId={saint.videoOracaoId}
                  title={`Oração - ${saint.nome}`}
                  size="medium"
                />
              </div>
            )}

            {saint.tags && (
              <div className="mt-6">
                {saint.tags.map(t => (
                  <span key={t} className="inline-block mr-2 px-3 py-1 text-sm border rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Santos Relacionados */}
        {slug && (
          <RelacionamentosSanto santoSlug={slug} santosData={saints} />
        )}
      </article>
    </Layout>
  )
}

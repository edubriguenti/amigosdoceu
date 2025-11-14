import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import churches from '../../data/igrejas.json'
import { motion } from 'framer-motion'

export default function ChurchPage() {
  const router = useRouter()
  const { slug } = router.query

  const church = churches.find(c => c.slug === slug) || churches[0]

  return (
    <Layout>
      <article className="py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-4xl mx-auto">
            <img src={church.imagem} alt={church.nome} className="img-hero rounded-lg shadow-lg mb-6" />
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

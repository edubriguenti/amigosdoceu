import Layout from '../../components/Layout'
import ChurchGallery from '../../components/ChurchGallery'
import churches from '../../data/igrejas.json'
import { motion } from 'framer-motion'

export default function IgrejasPage() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-12">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-serif mb-4">Igrejas e Paróquias</h1>
            <p className="text-lg text-gray-700">
              Descubra os templos mais importantes e sagrados do cristianismo ao redor do mundo.
              Desde basílicas milenares até santuários de peregrinação, cada igreja conta uma
              história única de fé, arte e devoção que atravessou gerações.
            </p>
          </div>

          <ChurchGallery churches={churches} />
        </section>
      </motion.div>
    </Layout>
  )
}

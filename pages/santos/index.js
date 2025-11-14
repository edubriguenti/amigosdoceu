import Layout from '../../components/Layout'
import Gallery from '../../components/Gallery'
import saints from '../../data/santos.json'
import { motion } from 'framer-motion'

export default function SantosPage() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-12">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-serif mb-4">Santos</h1>
            <p className="text-lg text-gray-700">
              Conheça as vidas inspiradoras dos santos — homens e mulheres que dedicaram suas vidas a Deus
              e ao próximo. Cada história é um testemunho de fé, coragem e amor que continua a inspirar
              milhões de pessoas ao redor do mundo.
            </p>
          </div>

          <Gallery saints={saints} />
        </section>
      </motion.div>
    </Layout>
  )
}

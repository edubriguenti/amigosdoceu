import Layout from '../../components/Layout'
import AparicaoCard from '../../components/AparicaoCard'
import aparicoes from '../../data/aparicoes.json'
import { motion } from 'framer-motion'

export default function AparicoesPage() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-12">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-serif mb-4">Aparições de Nossa Senhora</h1>
            <p className="text-lg text-gray-700">
              Ao longo da história, Nossa Senhora apareceu em diversos lugares do mundo, trazendo mensagens
              de amor, paz e conversão. Conheça os principais locais de aparições marianas reconhecidas
              pela Igreja Católica, suas histórias e o impacto que causaram na vida de milhões de fiéis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {aparicoes.map(a => (
              <AparicaoCard key={a.slug} aparicao={a} />
            ))}
          </div>
        </section>
      </motion.div>
    </Layout>
  )
}

import Layout from '../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-serif mb-6">Amigos do Céu</h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Uma jornada contemplativa pela fé católica. Conheça os amigos do céu — vidas que inspiram
              fé, coragem e amor. Descubra também os templos sagrados que testemunharam séculos de
              devoção e história.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/santos" className="group">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-gray-600">Santos</h2>
                <p className="text-gray-600 mb-4">
                  Conheça as vidas inspiradoras de homens e mulheres que dedicaram suas vidas a Deus
                  e ao próximo. Histórias de fé, milagres e santidade.
                </p>
                <span className="text-sm font-semibold group-hover:underline">
                  Explorar Santos →
                </span>
              </div>
            </Link>

            <Link href="/igrejas" className="group">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-gray-600">Igrejas e Paróquias</h2>
                <p className="text-gray-600 mb-4">
                  Descubra os templos mais importantes e sagrados do cristianismo. Basílicas, catedrais
                  e santuários que são testemunhos de fé ao redor do mundo.
                </p>
                <span className="text-sm font-semibold group-hover:underline">
                  Explorar Igrejas →
                </span>
              </div>
            </Link>

            <Link href="/aparicoes" className="group">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-gray-600">Aparições de Nossa Senhora</h2>
                <p className="text-gray-600 mb-4">
                  Descubra os locais sagrados onde Nossa Senhora apareceu ao longo da história.
                  Mensagens de fé, conversão e esperança para toda a humanidade.
                </p>
                <span className="text-sm font-semibold group-hover:underline">
                  Explorar Aparições →
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 italic">
              "Temos ao nosso redor uma grande nuvem de testemunhas." - Hebreus 12:1
            </p>
          </div>
        </section>
      </motion.div>
    </Layout>
  )
}

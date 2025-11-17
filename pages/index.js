import Layout from '../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">Amigos do Céu</h1>
            <p className="text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
              Uma jornada contemplativa pela fé católica. Conheça os amigos do céu — vidas que inspiram
              fé, coragem e amor. Descubra também os templos sagrados que testemunharam séculos de
              devoção e história.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
            <Link href="/santos" className="group">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-blue-600 transition-colors">Santos</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Conheça as vidas inspiradoras de homens e mulheres que dedicaram suas vidas a Deus
                  e ao próximo. Histórias de fé, milagres e santidade.
                </p>
                <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                  Explorar Santos →
                </span>
              </div>
            </Link>

            <Link href="/igrejas" className="group">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-blue-600 transition-colors">Igrejas e Paróquias</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Descubra os templos mais importantes e sagrados do cristianismo. Basílicas, catedrais
                  e santuários que são testemunhos de fé ao redor do mundo.
                </p>
                <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                  Explorar Igrejas →
                </span>
              </div>
            </Link>

            <Link href="/aparicoes" className="group">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-blue-600 transition-colors">Aparições de Nossa Senhora</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Descubra os locais sagrados onde Nossa Senhora apareceu ao longo da história.
                  Mensagens de fé, conversão e esperança para toda a humanidade.
                </p>
                <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                  Explorar Aparições →
                </span>
              </div>
            </Link>

            <Link href="/santos-do-dia" className="group">
              <div className="border border-amber-300 bg-amber-50 rounded-lg p-8 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                <h2 className="text-2xl font-serif mb-3 group-hover:text-amber-700 transition-colors">Santos do Dia</h2>
                <p className="text-gray-800 mb-4 leading-relaxed">
                  Descubra qual santo é celebrado hoje no calendário litúrgico. Acompanhe as festas
                  e celebrações importantes da Igreja Católica.
                </p>
                <span className="text-sm font-semibold text-amber-700 group-hover:underline">
                  Ver Santos de Hoje →
                </span>
              </div>
            </Link>
          </div>

          <div className="max-w-6xl mx-auto">
            <Link href="/calendario" className="group">
              <div className="border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-8 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                <div className="flex items-start gap-4">
                  <div className="text-4xl" role="img" aria-label="Calendário">📅</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-serif mb-3 group-hover:text-amber-700 transition-colors">Calendário Litúrgico</h2>
                    <p className="text-gray-800 mb-4 leading-relaxed">
                      Explore o calendário completo com todas as celebrações, festas, solenidades e memórias
                      dos santos ao longo do ano litúrgico. Receba notificações das datas importantes.
                    </p>
                    <span className="text-sm font-semibold text-amber-700 group-hover:underline">
                      Acessar Calendário Completo →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 italic text-lg">
              "Temos ao nosso redor uma grande nuvem de testemunhas."
              <br />
              <span className="font-semibold">— Hebreus 12:1</span>
            </p>
          </div>
        </section>
      </motion.div>
    </Layout>
  )
}

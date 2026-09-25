import { motion } from 'framer-motion'
import Link from 'next/link'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import CalendarioMensal from '../components/CalendarioMensal'

export default function Calendario() {
  return (
    <Layout>
      <SEO
        title="Calendário Litúrgico"
        description="Calendário completo da Igreja Católica: festas, solenidades, memórias dos santos e tempos litúrgicos do ano."
        url="https://amigosdoceu.vercel.app/calendario"
        keywords="calendário litúrgico, ano litúrgico, festas católicas, solenidades, memórias santos, advento, quaresma"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-12"
      >
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-serif mb-4"
          >
            Calendário Litúrgico
          </motion.h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Acompanhe as festas, solenidades e memórias dos santos ao longo do ano litúrgico
          </p>
        </div>

        {/* Link para Santos do Dia */}
        <div className="text-center mb-8">
          <Link
            href="/santos-do-dia"
            className="inline-block px-6 py-3 bg-cosmic-gold text-[#1b1406] rounded-lg hover:bg-amber-300 transition font-semibold"
          >
            Ver Santos do Dia de Hoje →
          </Link>
        </div>

        {/* Calendário Mensal */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CalendarioMensal />
        </motion.div>

        {/* Informações adicionais */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-serif mb-6 text-center">Sobre o Calendário Litúrgico</h2>
          <div className="mx-auto text-lg leading-relaxed text-neutral-300">
            <p className="mb-4">
              O calendário litúrgico é o conjunto das celebrações que a Igreja Católica realiza ao longo do ano.
              Ele organiza as festas, solenidades e memórias dos santos, bem como os tempos litúrgicos que marcam
              a vida da comunidade cristã.
            </p>

            <h3 className="text-2xl font-serif mt-8 mb-4">Tipos de Celebrações</h3>
            <ul className="space-y-2">
              <li>
                <strong className="text-amber-300">Solenidade:</strong> As celebrações mais importantes do ano litúrgico,
                como o Natal, a Páscoa, e festas da Virgem Maria.
              </li>
              <li>
                <strong className="text-blue-300">Festa:</strong> Celebrações de grande importância, que honram
                mistérios da fé ou santos de especial relevância.
              </li>
              <li>
                <strong className="text-green-300">Memória:</strong> Recordação de santos ou eventos da história
                da salvação, podendo ser obrigatórias ou facultativas.
              </li>
              <li>
                <strong className="text-purple-300">Comemoração:</strong> Celebrações especiais, como a Comemoração
                de Todos os Fiéis Defuntos (Finados).
              </li>
            </ul>

            <h3 className="text-2xl font-serif mt-8 mb-4">Cores Litúrgicas</h3>
            <p className="mb-4">
              Cada celebração possui uma cor litúrgica que simboliza seu significado espiritual:
            </p>
            <ul className="space-y-2">
              <li><strong className="text-neutral-100">Branco:</strong> Alegria, pureza e glória (Natal, Páscoa, festas de santos não mártires)</li>
              <li><strong className="text-neutral-100">Vermelho:</strong> Fogo do Espírito Santo e sangue dos mártires</li>
              <li><strong className="text-neutral-100">Verde:</strong> Esperança e crescimento espiritual (Tempo Comum)</li>
              <li><strong className="text-neutral-100">Roxo:</strong> Penitência e preparação (Advento e Quaresma)</li>
              <li><strong className="text-neutral-100">Rosa:</strong> Alegria em meio à penitência (3º Domingo do Advento e 4º da Quaresma)</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}

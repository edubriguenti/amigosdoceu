import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Layout from '../components/Layout'
import SaintCard from '../components/SaintCard'
import { getCelebracaoDoDia, getSantosPorSlugs, formatarData, getProximasCelebracoes } from '../lib/calendarUtils'

export default function SantosDoDia() {
  const [dataAtual, setDataAtual] = useState(null)
  const [celebracao, setCelebracao] = useState(null)
  const [santos, setSantos] = useState([])
  const [proximasCelebracoes, setProximasCelebracoes] = useState([])

  useEffect(() => {
    const hoje = new Date()
    setDataAtual(hoje)

    const celebracaoHoje = getCelebracaoDoDia(hoje)
    setCelebracao(celebracaoHoje)

    if (celebracaoHoje && celebracaoHoje.santos) {
      const santosHoje = getSantosPorSlugs(celebracaoHoje.santos)
      setSantos(santosHoje)
    }

    const proximas = getProximasCelebracoes(10)
    setProximasCelebracoes(proximas)
  }, [])

  if (!dataAtual) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
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
            Santos do Dia
          </motion.h1>
          <p className="text-xl text-gray-600">{formatarData(dataAtual)}</p>
        </div>

        {/* Celebração do dia */}
        {celebracao ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className={`max-w-3xl mx-auto p-8 rounded-lg shadow-lg ${
              celebracao.tipo === 'Solenidade' ? 'bg-amber-50 border-2 border-amber-400' :
              celebracao.tipo === 'Festa' ? 'bg-blue-50 border-2 border-blue-400' :
              celebracao.tipo === 'Memória' ? 'bg-green-50 border-2 border-green-400' :
              'bg-purple-50 border-2 border-purple-400'
            }`}>
              <div className="text-center">
                <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${
                  celebracao.tipo === 'Solenidade' ? 'bg-amber-200 text-amber-900' :
                  celebracao.tipo === 'Festa' ? 'bg-blue-200 text-blue-900' :
                  celebracao.tipo === 'Memória' ? 'bg-green-200 text-green-900' :
                  'bg-purple-200 text-purple-900'
                }`}>
                  {celebracao.tipo}
                </div>
                <h2 className="text-3xl font-serif mb-3">{celebracao.nome}</h2>
                <p className="text-lg text-gray-700">{celebracao.descricao}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg bg-gray-50 border-2 border-gray-300">
              <div className="text-center">
                <h2 className="text-2xl font-serif mb-3">Dia Comum</h2>
                <p className="text-gray-700">
                  Hoje não há uma celebração específica no calendário litúrgico.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Santos do dia */}
        {santos.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-serif text-center mb-8">Conheça os Santos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {santos.map((santo, index) => (
                <motion.div
                  key={santo.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <SaintCard saint={santo} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Próximas celebrações */}
        {proximasCelebracoes.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-serif text-center mb-8">Próximas Celebrações Importantes</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {proximasCelebracoes.map((prox, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`p-4 rounded-lg shadow ${
                    prox.tipo === 'Solenidade' ? 'bg-amber-50 border-l-4 border-amber-400' :
                    'bg-blue-50 border-l-4 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          prox.tipo === 'Solenidade' ? 'bg-amber-200 text-amber-900' :
                          'bg-blue-200 text-blue-900'
                        }`}>
                          {prox.tipo}
                        </span>
                        <span className="font-semibold text-gray-900">{prox.nome}</span>
                      </div>
                      <p className="text-sm text-gray-600">{prox.descricao}</p>
                      {prox.santos && prox.santos.length > 0 && (
                        <Link
                          href={`/santos/${prox.santos[0]}`}
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          Ver santo →
                        </Link>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-700 whitespace-nowrap ml-4">
                      {prox.diaNumero} de {prox.mesNome}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Link para o calendário completo */}
        <div className="text-center mt-12">
          <Link
            href="/calendario"
            className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold"
          >
            Ver Calendário Litúrgico Completo →
          </Link>
        </div>
      </motion.div>
    </Layout>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getCalendarioMes, getCelebracaoDoDia, formatarData } from '../lib/calendarUtils'

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarioMensal({ mesInicial, anoInicial }) {
  const hoje = new Date()
  const [mes, setMes] = useState(mesInicial || hoje.getMonth() + 1)
  const [ano, setAno] = useState(anoInicial || hoje.getFullYear())

  const calendario = getCalendarioMes(mes, ano)

  const mesAnterior = () => {
    if (mes === 1) {
      setMes(12)
      setAno(ano - 1)
    } else {
      setMes(mes - 1)
    }
  }

  const mesSeguinte = () => {
    if (mes === 12) {
      setMes(1)
      setAno(ano + 1)
    } else {
      setMes(mes + 1)
    }
  }

  const mesAtual = () => {
    setMes(hoje.getMonth() + 1)
    setAno(hoje.getFullYear())
  }

  // Criar array de dias do calendário
  const dias = []

  // Adicionar espaços vazios antes do primeiro dia
  for (let i = 0; i < calendario.diaSemanaInicio; i++) {
    dias.push(null)
  }

  // Adicionar os dias do mês
  for (let dia = 1; dia <= calendario.diasNoMes; dia++) {
    const data = new Date(ano, mes - 1, dia)
    const celebracao = getCelebracaoDoDia(data)
    const ehHoje =
      dia === hoje.getDate() &&
      mes === hoje.getMonth() + 1 &&
      ano === hoje.getFullYear()

    dias.push({
      dia,
      data,
      celebracao,
      ehHoje
    })
  }

  // Função para determinar a cor de fundo baseada no tipo de celebração
  const getCorCelebracao = (tipo) => {
    switch (tipo) {
      case 'Solenidade':
        return 'bg-amber-100 border-amber-400'
      case 'Festa':
        return 'bg-blue-100 border-blue-400'
      case 'Memória':
        return 'bg-green-100 border-green-400'
      case 'Comemoração':
        return 'bg-purple-100 border-purple-400'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Cabeçalho de navegação */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={mesAnterior}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
        >
          ← Anterior
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-serif">{calendario.mesNome} {ano}</h2>
          <button
            onClick={mesAtual}
            className="text-sm text-gray-600 hover:text-gray-900 mt-1"
          >
            Voltar para hoje
          </button>
        </div>

        <button
          onClick={mesSeguinte}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
        >
          Próximo →
        </button>
      </div>

      {/* Grid do calendário */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 bg-gray-100 border-b">
          {diasSemana.map(dia => (
            <div
              key={dia}
              className="p-3 text-center font-semibold text-gray-700 border-r last:border-r-0"
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7">
          {dias.map((item, index) => {
            if (!item) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square border-r border-b last:border-r-0 bg-gray-50"
                />
              )
            }

            const { dia, celebracao, ehHoje } = item

            return (
              <motion.div
                key={dia}
                whileHover={{ scale: 1.02 }}
                className={`aspect-square border-r border-b last:border-r-0 p-2 relative overflow-hidden ${
                  celebracao ? getCorCelebracao(celebracao.tipo) : 'bg-white border-gray-200'
                } ${ehHoje ? 'ring-2 ring-amber-500' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-sm font-semibold mb-1 ${ehHoje ? 'text-amber-600' : 'text-gray-700'}`}>
                    {dia}
                  </div>

                  {celebracao && (
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-medium text-gray-900 leading-tight mb-1">
                        {celebracao.nome}
                      </div>
                      <div className="text-xs text-gray-600">
                        {celebracao.tipo}
                      </div>

                      {celebracao.santos && celebracao.santos.length > 0 && (
                        <Link
                          href={`/santos/${celebracao.santos[0]}`}
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Ver santo
                        </Link>
                      )}
                    </div>
                  )}

                  {ehHoje && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-100 border border-amber-400 rounded" />
          <span>Solenidade</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded" />
          <span>Festa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-400 rounded" />
          <span>Memória</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-400 rounded" />
          <span>Comemoração</span>
        </div>
      </div>

      {/* Lista de celebrações do mês */}
      {calendario.celebracoes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-serif mb-4">Celebrações de {calendario.mesNome}</h3>
          <div className="space-y-3">
            {calendario.celebracoes.map((celebracao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${getCorCelebracao(celebracao.tipo)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{celebracao.nome}</div>
                    <div className="text-sm text-gray-600 mt-1">{celebracao.descricao}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 whitespace-nowrap ml-4">
                    {celebracao.dia} de {celebracao.mesNome}
                  </div>
                </div>
                {celebracao.santos && celebracao.santos.length > 0 && (
                  <div className="mt-2">
                    <Link
                      href={`/santos/${celebracao.santos[0]}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver biografia do santo →
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getCalendarioMes, getCelebracaoDoDia, getSantosPorSlugs } from '../lib/calendarUtils'

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarioMensal({ mesInicial, anoInicial }) {
  const hoje = new Date()
  const [mes, setMes] = useState(mesInicial || hoje.getMonth() + 1)
  const [ano, setAno] = useState(anoInicial || hoje.getFullYear())

  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const painelRef = useRef(null)

  // No celular o detalhe fica abaixo da grade, fora da tela: traz para a vista ao selecionar.
  useEffect(() => {
    if (diaSelecionado) painelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [diaSelecionado])

  const calendario = getCalendarioMes(mes, ano)

  const mesAnterior = () => {
    setDiaSelecionado(null)
    if (mes === 1) {
      setMes(12)
      setAno(ano - 1)
    } else {
      setMes(mes - 1)
    }
  }

  const mesSeguinte = () => {
    setDiaSelecionado(null)
    if (mes === 12) {
      setMes(1)
      setAno(ano + 1)
    } else {
      setMes(mes + 1)
    }
  }

  const mesAtual = () => {
    setDiaSelecionado(null)
    setMes(hoje.getMonth() + 1)
    setAno(hoje.getFullYear())
  }

  const celebracaoSelecionada = diaSelecionado
    ? getCelebracaoDoDia(new Date(ano, mes - 1, diaSelecionado))
    : null
  const santosSelecionados = getSantosPorSlugs(celebracaoSelecionada?.santos)

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
          className="px-4 py-2 bg-cosmic-surface-2 border border-cosmic-border text-neutral-100 hover:border-cosmic-gold/60 rounded transition"
        >
          ← Anterior
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-serif">{calendario.mesNome} {ano}</h2>
          <button
            onClick={mesAtual}
            className="text-sm text-neutral-300 hover:text-white mt-1"
          >
            Voltar para hoje
          </button>
        </div>

        <button
          onClick={mesSeguinte}
          className="px-4 py-2 bg-cosmic-surface-2 border border-cosmic-border text-neutral-100 hover:border-cosmic-gold/60 rounded transition"
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

            const selecionado = diaSelecionado === dia
            const classes = `aspect-square border-r border-b last:border-r-0 p-1 sm:p-2 relative overflow-hidden text-left ${
              celebracao ? getCorCelebracao(celebracao.tipo) : 'bg-white border-gray-200'
            } ${ehHoje ? 'ring-2 ring-amber-500' : ''} ${selecionado ? 'ring-2 ring-inset ring-blue-700' : ''}`
            const conteudo = (
              <div className="flex flex-col h-full">
                <div className={`text-sm font-semibold sm:mb-1 ${ehHoje ? 'text-amber-700' : 'text-gray-700'}`}>
                  {dia}
                </div>

                {celebracao && (
                  <div className="hidden sm:block flex-1 overflow-hidden">
                    <div className="text-xs font-medium text-gray-900 leading-tight mb-1">
                      {celebracao.nome}
                    </div>
                    <div className="text-xs text-gray-600">{celebracao.tipo}</div>
                  </div>
                )}

                {ehHoje && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </div>
            )

            if (!celebracao) {
              return (
                <div key={dia} className={classes}>
                  {conteudo}
                </div>
              )
            }

            return (
              <button
                key={dia}
                type="button"
                onClick={() => setDiaSelecionado(selecionado ? null : dia)}
                aria-pressed={selecionado}
                aria-label={`${dia} de ${calendario.mesNome}: ${celebracao.nome}, ${celebracao.tipo}`}
                className={`${classes} hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700`}
              >
                {conteudo}
              </button>
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


      {/* Detalhe do dia selecionado */}
      <div ref={painelRef} aria-live="polite" className="mt-4 scroll-mb-24">
        {celebracaoSelecionada ? (
          <div className={`p-4 rounded-lg border ${getCorCelebracao(celebracaoSelecionada.tipo)}`}>
            <div className="text-sm font-medium text-gray-700">
              {diaSelecionado} de {calendario.mesNome} · {celebracaoSelecionada.tipo}
            </div>
            <div className="text-lg font-semibold text-gray-900 mt-1">{celebracaoSelecionada.nome}</div>
            <p className="text-sm text-gray-700 mt-1">{celebracaoSelecionada.descricao}</p>
            {santosSelecionados.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {santosSelecionados.map(santo => (
                  <Link
                    key={santo.slug}
                    href={`/santos/${santo.slug}`}
                    className="text-sm text-blue-800 font-medium hover:underline"
                  >
                    {santo.nome} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-300">
            Toque em um dia colorido para ver a celebração e o santo do dia.
          </p>
        )}
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
                      className="text-sm text-blue-800 hover:underline"
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

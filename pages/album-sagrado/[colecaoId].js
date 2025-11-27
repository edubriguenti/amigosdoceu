import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../../components/Layout'
import AlbumPage from '../../components/AlbumPage'
import FigurinhaModal from '../../components/FigurinhaModal'
import CompletionOverlay from '../../components/CompletionOverlay'
import OracaoDesbloqueio from '../../components/OracaoDesbloqueio'
import { useOracaoDesbloqueio } from '../../hooks/useOracaoDesbloqueio'
import colecoes from '../../data/album-colecoes.json'
import figurinhas from '../../data/album-sagrado.json'

export default function ColecaoPage() {
  const router = useRouter()
  const { colecaoId } = router.query

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [figurinhaSelecionada, setFigurinhaSelecionada] = useState(null)
  const [mostrarOverlay, setMostrarOverlay] = useState(false)
  const [jaVisualizou, setJaVisualizou] = useState(false)
  const [mostrarOracao, setMostrarOracao] = useState(false)
  const [figurinhaParaOracao, setFigurinhaParaOracao] = useState(null)

  const { isDesbloqueada } = useOracaoDesbloqueio()

  const colecao = colecoes.find((c) => c.slug === colecaoId)
  const figurinhasColecao = figurinhas
    .filter((f) => f.colecaoId === colecao?.id)
    .sort((a, b) => a.posicao - b.posicao)
    .map((f) => ({
      ...f,
      bloqueada: f.bloqueada && !isDesbloqueada(f.id) // Desbloqueada se já foi desbloqueada via oração
    }))

  const figurinhasPorPagina = 6
  const totalPaginas = Math.ceil(figurinhasColecao.length / figurinhasPorPagina)

  const desbloqueadas = figurinhasColecao.filter((f) => !f.bloqueada).length
  const porcentagem = Math.round((desbloqueadas / figurinhasColecao.length) * 100)
  const completo = desbloqueadas === figurinhasColecao.length

  useEffect(() => {
    if (completo && !jaVisualizou) {
      const timer = setTimeout(() => {
        setMostrarOverlay(true)
        setJaVisualizou(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [completo, jaVisualizou])

  if (!colecao) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <p className="text-gray-600">Coleção não encontrada.</p>
        </div>
      </Layout>
    )
  }

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1)
    }
  }

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1)
    }
  }

  const handleFigurinhaClick = (figurinha) => {
    if (!figurinha || !figurinha.id) {
      return // Ignorar slots vazios
    }
    
    if (figurinha.bloqueada) {
      // Se está bloqueada, mostrar modal de oração
      setFigurinhaParaOracao(figurinha)
      setMostrarOracao(true)
    } else {
      // Se está desbloqueada, mostrar modal normal
      setFigurinhaSelecionada(figurinha)
    }
  }

  const handleDesbloqueio = (figurinha) => {
    setMostrarOracao(false)
    setFigurinhaParaOracao(null)
    // Forçar atualização do componente
    router.replace(router.asPath)
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6 md:py-12 px-4"
      >
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.push('/album-sagrado')}
            className="text-accent-600 hover:text-accent-700 flex items-center gap-2 mb-4"
          >
            ← Voltar às Coleções
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 md:gap-4 mb-3">
                <span className="text-3xl md:text-5xl flex-shrink-0">{colecao.icone}</span>
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif break-words">{colecao.nome}</h1>
                  <p className="text-sm md:text-base text-gray-600 break-words">{colecao.descricao}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-secondary-300 rounded-lg p-4 w-full md:min-w-[200px] md:max-w-[240px]">
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">
                  {completo ? '🏆' : '📊'}
                </div>
                <p className="text-sm text-gray-600">Progresso</p>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{desbloqueadas} / {figurinhasColecao.length}</span>
                  <span className="font-semibold">{porcentagem}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentagem}%` }}
                    className="bg-gradient-to-r from-accent-500 to-secondary-500 h-3 rounded-full transition-all"
                  />
                </div>
              </div>
              {completo && (
                <div className="text-center text-sm text-secondary-700 font-semibold">
                  ✨ Completo! ✨
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-6 md:mb-8 relative">
          <AlbumPage
            figurinhas={figurinhasColecao}
            onFigurinhaClick={handleFigurinhaClick}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
          />

          <div className="flex justify-center gap-3 md:gap-4 mt-8 md:mt-12">
            <button
              onClick={paginaAnterior}
              disabled={paginaAtual === 1}
              className="px-4 md:px-6 py-2 md:py-3 bg-accent-500 text-white rounded-lg text-sm md:text-base font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-accent-600 transition-colors shadow-md"
            >
              ← Anterior
            </button>
            <button
              onClick={proximaPagina}
              disabled={paginaAtual === totalPaginas}
              className="px-4 md:px-6 py-2 md:py-3 bg-accent-500 text-white rounded-lg text-sm md:text-base font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-accent-600 transition-colors shadow-md"
            >
              Próxima →
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl mb-1 md:mb-2">🔓</div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Desbloqueadas</p>
            <p className="text-lg md:text-xl font-bold text-secondary-700">{desbloqueadas}</p>
          </div>
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl mb-1 md:mb-2">🔒</div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Bloqueadas</p>
            <p className="text-lg md:text-xl font-bold text-gray-700">{figurinhasColecao.length - desbloqueadas}</p>
          </div>
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl mb-1 md:mb-2">⭐</div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Raras</p>
            <p className="text-lg md:text-xl font-bold text-accent-700">
              {figurinhasColecao.filter((f) => f.raridade === 'rara' && !f.bloqueada).length}
            </p>
          </div>
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl mb-1 md:mb-2">💎</div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Épicas</p>
            <p className="text-lg md:text-xl font-bold text-secondary-700">
              {figurinhasColecao.filter((f) => f.raridade === 'epica' && !f.bloqueada).length}
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {figurinhaSelecionada && (
          <FigurinhaModal
            figurinha={figurinhaSelecionada}
            onClose={() => setFigurinhaSelecionada(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mostrarOverlay && (
          <CompletionOverlay
            colecao={colecao}
            onClose={() => setMostrarOverlay(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mostrarOracao && figurinhaParaOracao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setMostrarOracao(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif text-secondary-800">
                    Desbloquear {figurinhaParaOracao.nome}
                  </h2>
                  <button
                    onClick={() => setMostrarOracao(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <OracaoDesbloqueio
                  figurinha={figurinhaParaOracao}
                  onDesbloqueio={handleDesbloqueio}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

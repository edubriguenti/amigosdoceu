import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../../components/Layout'
import AlbumPage from '../../components/AlbumPage'
import FigurinhaModal from '../../components/FigurinhaModal'
import CompletionOverlay from '../../components/CompletionOverlay'
import colecoes from '../../data/album-colecoes.json'
import figurinhas from '../../data/album-sagrado.json'

export default function ColecaoPage() {
  const router = useRouter()
  const { colecaoId } = router.query

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [figurinhaSelecionada, setFigurinhaSelecionada] = useState(null)
  const [mostrarOverlay, setMostrarOverlay] = useState(false)
  const [jaVisualizou, setJaVisualizou] = useState(false)

  const colecao = colecoes.find((c) => c.slug === colecaoId)
  const figurinhasColecao = figurinhas.filter((f) => f.colecaoId === colecao?.id)

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

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12"
      >
        <div className="mb-8">
          <button
            onClick={() => router.push('/album-sagrado')}
            className="text-accent-600 hover:text-accent-700 flex items-center gap-2 mb-4"
          >
            ← Voltar às Coleções
          </button>

          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{colecao.icone}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif">{colecao.nome}</h1>
                  <p className="text-gray-600">{colecao.descricao}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-secondary-300 rounded-lg p-4 min-w-[200px]">
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

        <div className="max-w-5xl mx-auto mb-8 relative">
          <AlbumPage
            figurinhas={figurinhasColecao}
            onFigurinhaClick={setFigurinhaSelecionada}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
          />

          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={paginaAnterior}
              disabled={paginaAtual === 1}
              className="px-6 py-3 bg-accent-500 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-accent-600 transition-colors shadow-md"
            >
              ← Anterior
            </button>
            <button
              onClick={proximaPagina}
              disabled={paginaAtual === totalPaginas}
              className="px-6 py-3 bg-accent-500 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-accent-600 transition-colors shadow-md"
            >
              Próxima →
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔓</div>
            <p className="text-sm text-gray-600 mb-1">Desbloqueadas</p>
            <p className="text-xl font-bold text-secondary-700">{desbloqueadas}</p>
          </div>
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm text-gray-600 mb-1">Bloqueadas</p>
            <p className="text-xl font-bold text-gray-700">{figurinhasColecao.length - desbloqueadas}</p>
          </div>
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-sm text-gray-600 mb-1">Raras</p>
            <p className="text-xl font-bold text-accent-700">
              {figurinhasColecao.filter((f) => f.raridade === 'rara' && !f.bloqueada).length}
            </p>
          </div>
          <div className="bg-primary-100 border border-secondary-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💎</div>
            <p className="text-sm text-gray-600 mb-1">Épicas</p>
            <p className="text-xl font-bold text-secondary-700">
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
    </Layout>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import AlbumCard from '../../components/AlbumCard'
import colecoes from '../../data/album-colecoes.json'
import figurinhas from '../../data/album-sagrado.json'

export default function AlbumSagradoIndex() {
  const [progressos, setProgressos] = useState({})

  useEffect(() => {
    const savedProgress = localStorage.getItem('album-sagrado-progress')
    if (savedProgress) {
      setProgressos(JSON.parse(savedProgress))
    } else {
      const initialProgress = {}
      colecoes.forEach((colecao) => {
        const figurinhasColecao = figurinhas.filter((f) => f.colecaoId === colecao.id)
        const desbloqueadas = figurinhasColecao.filter((f) => !f.bloqueada).length
        initialProgress[colecao.id] = {
          desbloqueadas,
          total: colecao.totalFigurinhas,
        }
      })
      setProgressos(initialProgress)
    }
  }, [])

  return (
    <Layout>
      <SEO
        title="Álbum Sagrado"
        description="Coleção interativa de figurinhas dos santos. Descubra, colecione e mergulhe nas histórias que iluminam a fé católica."
        url="https://amigosdoceu.vercel.app/album-sagrado"
        keywords="álbum sagrado, figurinhas santos, coleção interativa, gamificação fé, devoção"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <section className="py-6 md:py-12 px-4">
          <div className="relative mb-8 md:mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-secondary-500 opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

            <div className="relative px-4 md:px-8 py-8 md:py-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-5xl md:text-7xl mb-3 md:mb-4"
              >
                📖
              </motion.div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-3 md:mb-4 text-white">
                Álbum Sagrado Interativo
              </h1>
              <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto mb-4 md:mb-8">
                Colecionе, descubra e mergulhe nas histórias dos santos que iluminam nossa fé.
                Uma jornada visual e espiritual através das vidas sagradas.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl mb-2">✨</div>
                <h3 className="font-serif text-base md:text-lg mb-2">Descubra</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Explore diferentes coleções temáticas de santos
                </p>
              </div>
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl mb-2">🎯</div>
                <h3 className="font-serif text-base md:text-lg mb-2">Colecione</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Complete suas coleções e desbloqueie conquistas
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl mb-2">📚</div>
                <h3 className="font-serif text-base md:text-lg mb-2">Aprenda</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Mergulhe nas histórias, orações e curiosidades
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6">Suas Coleções</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colecoes.map((colecao, idx) => (
                <motion.div
                  key={colecao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <AlbumCard
                    colecao={colecao}
                    progresso={progressos[colecao.id] || { desbloqueadas: 0, total: colecao.totalFigurinhas }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-100 to-amber-50 rounded-lg p-6 md:p-8 text-center border border-secondary-200">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🌟</div>
            <h3 className="text-xl md:text-2xl font-serif mb-2 md:mb-3">
              Comece Sua Jornada
            </h3>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 max-w-2xl mx-auto">
              Escolha uma coleção acima e inicie sua jornada de descoberta pela vida dos santos.
              Cada figurinha revela histórias inspiradoras de fé, coragem e amor.
            </p>
          </div>
        </section>
      </motion.div>
    </Layout>
  )
}

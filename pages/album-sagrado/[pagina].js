import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import PaginaAlbum from '../../components/album/PaginaAlbum'
import FigurinhaModal from '../../components/album/FigurinhaModal'
import FigurinhaMisteriosaModal from '../../components/album/FigurinhaMisteriosaModal'
import RevelacaoNovas from '../../components/album/RevelacaoNovas'
import CompletionOverlay from '../../components/album/CompletionOverlay'
import { useAlbum } from '../../hooks/useAlbum'
import { getFigurinhasDaPagina, getPaginaBySlug, getPaginas } from '../../lib/albumData'

export async function getStaticPaths() {
  return {
    paths: getPaginas().map((p) => ({ params: { pagina: p.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  return { props: { slug: params.pagina } }
}

function Chevron({ direcao }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={direcao === 'esq' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PaginaDoAlbum({ slug }) {
  const router = useRouter()
  const { loaded, isColetada, isNova, coletar, marcarVista } = useAlbum()

  const paginas = getPaginas()
  const indice = paginas.findIndex((p) => p.slug === slug)
  const pagina = getPaginaBySlug(slug)
  const figurinhas = getFigurinhasDaPagina(slug)
  const anterior = paginas[indice - 1] || null
  const proxima = paginas[indice + 1] || null

  const [aberta, setAberta] = useState(null)
  const [misteriosa, setMisteriosa] = useState(null)
  const [revelando, setRevelando] = useState(null)
  const [celebrar, setCelebrar] = useState(false)

  const coladas = loaded ? figurinhas.filter((f) => isColetada(f.id)).length : 0
  const completa = loaded && coladas === figurinhas.length

  // Ao trocar de página, zera os estados locais (declarado primeiro: roda antes dos demais efeitos).
  const completaAntes = useRef(null)
  useEffect(() => {
    completaAntes.current = null
    setAberta(null)
    setMisteriosa(null)
    setRevelando(null)
    setCelebrar(false)
  }, [slug])

  const abrir = (f) => {
    setAberta(f)
    marcarVista(f.id)
  }

  // Deep-link: ?figurinha=<id> abre a figurinha (ou o mistério, se ainda não foi colada).
  useEffect(() => {
    if (!loaded || !router.isReady) return
    const id = router.query.figurinha
    if (!id) return
    const f = figurinhas.find((x) => x.id === id)
    if (f) {
      if (isColetada(f.id)) abrir(f)
      else setMisteriosa(f)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, router.isReady, router.query.figurinha, slug])

  // Celebração: quando a página fica completa diante do usuário, ou quando ele
  // chega a uma página completa que recebeu figurinhas novas desde a última visita.
  useEffect(() => {
    if (!loaded) return
    const tinhaNovas = figurinhas.some((f) => isNova(f.id))
    if (completa && (completaAntes.current === false || (completaAntes.current === null && tinhaNovas))) {
      setCelebrar(true)
    }
    completaAntes.current = completa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, completa, slug])

  const rezou = (f) => {
    coletar(f.id, 'oracao')
    setMisteriosa(null)
    setRevelando([f])
  }

  const fecharModal = () => {
    setAberta(null)
    if (router.query.figurinha) {
      router.replace({ pathname: router.pathname, query: { pagina: slug } }, undefined, { shallow: true, scroll: false })
    }
  }

  if (!pagina) return null

  const url = `https://amigosdoceu.vercel.app/album-sagrado/${pagina.slug}`

  return (
    <Layout>
      <SEO
        title={`${pagina.titulo} | Álbum Sagrado`}
        description={`${pagina.descricao} Página ${indice + 1} do Álbum Sagrado, com ${figurinhas.length} figurinhas para colecionar.`}
        url={url}
        keywords={`álbum sagrado, figurinhas, ${pagina.titulo.toLowerCase()}`}
      />

      <div className="py-8 md:py-12 max-w-5xl mx-auto">
        <nav aria-label="Navegação do álbum" className="mb-5 flex items-center justify-between text-sm">
          <Link
            href="/album-sagrado"
            className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-[#e3c565] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] rounded px-1 -ml-1"
          >
            <Chevron direcao="esq" />
            Sumário
          </Link>
          <span className="text-neutral-400 tabular-nums">
            Página {indice + 1} de {paginas.length}
          </span>
        </nav>

        <PaginaAlbum
          pagina={pagina}
          numeroPagina={indice + 1}
          figurinhas={figurinhas}
          isColetada={isColetada}
          isNova={isNova}
          loaded={loaded}
          onAbrir={abrir}
          onMisteriosa={setMisteriosa}
        />

        <nav aria-label="Páginas vizinhas" className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {anterior ? (
            <Link
              href={`/album-sagrado/${anterior.slug}`}
              className="flex items-center gap-2 rounded-[6px] border border-white/10 px-4 py-3 text-neutral-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
            >
              <Chevron direcao="esq" />
              <span className="min-w-0">
                <span className="block text-xs text-neutral-400">Página anterior</span>
                <span className="block font-serif truncate">{anterior.titulo}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {proxima && (
            <Link
              href={`/album-sagrado/${proxima.slug}`}
              className="flex items-center justify-end gap-2 rounded-[6px] border border-white/10 px-4 py-3 text-right text-neutral-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
            >
              <span className="min-w-0">
                <span className="block text-xs text-neutral-400">Próxima página</span>
                <span className="block font-serif truncate">{proxima.titulo}</span>
              </span>
              <Chevron direcao="dir" />
            </Link>
          )}
        </nav>
      </div>

      <AnimatePresence>
        {aberta && <FigurinhaModal key={aberta.id} figurinha={aberta} onClose={fecharModal} />}
      </AnimatePresence>
      <AnimatePresence>
        {misteriosa && (
          <FigurinhaMisteriosaModal
            key={misteriosa.id}
            figurinha={misteriosa}
            pagina={pagina}
            onClose={() => setMisteriosa(null)}
            onRezou={rezou}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {revelando && (
          <RevelacaoNovas key="revelacao" figurinhas={revelando} onColar={marcarVista} onClose={() => setRevelando(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {celebrar && !revelando && !aberta && !misteriosa && (
          <CompletionOverlay
            key="completa"
            pagina={pagina}
            proxima={proxima}
            onClose={() => setCelebrar(false)}
            onProxima={() => {
              setCelebrar(false)
              router.push(`/album-sagrado/${proxima.slug}`)
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import CapaAlbum from '../../components/album/CapaAlbum'
import SumarioPaginas from '../../components/album/SumarioPaginas'
import FigurinhaDoDia from '../../components/album/FigurinhaDoDia'
import FigurinhaModal from '../../components/album/FigurinhaModal'
import RevelacaoNovas from '../../components/album/RevelacaoNovas'
import OracaoDoDiaModal from '../../components/OracaoDoDiaModal'
import { useAlbum } from '../../hooks/useAlbum'
import useDiaAtual from '../../hooks/useDiaAtual'
import { calcularStats, getFigurinhaById, getPaginaBySlug, getPaginas, getVolume } from '../../lib/albumData'
import { janelaDeDias, REVALIDATE_HOJE } from '../../lib/hoje'

// A figurinha e a oração do dia vêm prontas do servidor (ISR), como na home.
export async function getStaticProps() {
  return { props: janelaDeDias(), revalidate: REVALIDATE_HOJE }
}

const comPagina = (f) => ({ ...f, paginaTitulo: getPaginaBySlug(f.paginaSlug)?.titulo })

export default function AlbumSagradoIndex({ dias, hojeServidor }) {
  const { loaded, estado, marcarVista, figurinhaDoDiaJaResgatada } = useAlbum()
  const dia = useDiaAtual(dias, hojeServidor)
  const figurinhaDoDia = dia?.figurinha ? getFigurinhaById(dia.figurinha.id) : null
  const volume = getVolume()
  const paginas = getPaginas()
  const stats = useMemo(() => calcularStats(estado.coletadas), [estado.coletadas])
  const novas = useMemo(() => estado.novas.map(getFigurinhaById).filter(Boolean), [estado.novas])

  const [revelando, setRevelando] = useState(null) // cópia fixa da lista ao abrir
  const [aberta, setAberta] = useState(null)
  const [rezando, setRezando] = useState(false)

  const url = 'https://amigosdoceu.vercel.app/album-sagrado'

  return (
    <Layout>
      <SEO
        title="Álbum Sagrado"
        description="Um álbum de figurinhas de Cristo, Nossa Senhora, dos santos e dos lugares sagrados. Descubra figurinhas navegando pelo site, rezando e voltando a cada dia."
        url={url}
        keywords="álbum sagrado, figurinhas católicas, santinhos, santos, vida de cristo, nossa senhora, igrejas"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Álbum Sagrado',
          url,
          numberOfItems: stats.total,
        }}
      />

      <div className="py-10 md:py-14 max-w-3xl mx-auto space-y-8 md:space-y-10">
        <CapaAlbum volume={volume} coletadas={stats.coletadas} total={stats.total} loaded={loaded} />

        {loaded && novas.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-[8px] border border-[#c9a227]/40 bg-[#c9a227]/10 px-5 py-4">
            <p className="flex-1 text-neutral-100">
              {novas.length === 1 ? 'Você tem 1 figurinha nova para colar.' : `Você tem ${novas.length} figurinhas novas para colar.`}
            </p>
            <button
              type="button"
              onClick={() => setRevelando(novas.map(comPagina))}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#c9a227] text-[#1b1406] font-medium hover:bg-[#dcb53a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Colar no álbum
            </button>
          </div>
        )}

        {figurinhaDoDia && (
          <FigurinhaDoDia
            figurinha={figurinhaDoDia}
            santoDoDia={dia.figurinhaEhSantoDoDia}
            jaResgatada={loaded && figurinhaDoDiaJaResgatada}
            jaTinha={estado.coletadas[figurinhaDoDia.id]?.origem !== 'dia'}
            onRezar={() => setRezando(true)}
            onAbrir={() => setAberta(figurinhaDoDia)}
          />
        )}

        <SumarioPaginas paginas={paginas} stats={stats} loaded={loaded} />
      </div>

      <AnimatePresence>
        {revelando && (
          <RevelacaoNovas key="revelacao" figurinhas={revelando} onColar={marcarVista} onClose={() => setRevelando(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {rezando && <OracaoDoDiaModal key="oracao-do-dia" dia={dia} onClose={() => setRezando(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {aberta && <FigurinhaModal key={aberta.id} figurinha={aberta} onClose={() => setAberta(null)} />}
      </AnimatePresence>
    </Layout>
  )
}

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import RotaCard from '../../components/peregrinacoes/RotaCard'
import { usePeregrinacoes } from '../../hooks/usePeregrinacoes'
import { getRotas } from '../../lib/peregrinacoesData'
import { esbocoDaRota } from '../../lib/peregrinacoesEsboco'
import igrejasData from '../../data/igrejas.json'
import aparicoesData from '../../data/aparicoes.json'

const MapaInterativo = dynamic(() => import('../../components/MapaInterativo'), {
  ssr: false,
  loading: () => (
    <div className="mapa-moldura h-[62vh] min-h-[380px] md:h-[640px]">
      <div className="mapa-antigo flex items-center justify-center text-sm text-[#5c4b36]">Abrindo o mapa…</div>
    </div>
  ),
})

// Só o que o mapa usa vai para a página (os JSONs completos ficam no servidor).
export async function getStaticProps() {
  const comCoordenada = (x) => Number.isFinite(x.latitude) && Number.isFinite(x.longitude)
  const rotas = getRotas()
  return {
    props: {
      locais: [
        ...igrejasData.filter(comCoordenada).map((i) => ({
          tipo: 'igreja',
          slug: i.slug,
          nome: i.nome,
          local: i.local || null,
          quando: i.ano ? `Construção: ${i.ano}` : null,
          latitude: i.latitude,
          longitude: i.longitude,
        })),
        ...aparicoesData.filter(comCoordenada).map((a) => ({
          tipo: 'aparicao',
          slug: a.slug,
          nome: a.nome,
          local: a.local || null,
          quando: a.data || null,
          latitude: a.latitude,
          longitude: a.longitude,
        })),
      ],
      rotas,
      esbocos: Object.fromEntries(rotas.map((r) => [r.slug, esbocoDaRota(r.slug)])),
      totais: { igrejas: igrejasData.length, aparicoes: aparicoesData.length },
    },
  }
}

export default function MapaPage({ locais, rotas, esbocos, totais }) {
  const { loaded, feitasDe } = usePeregrinacoes()
  // Referência estável: o mapa busca os traçados quando esta lista muda.
  const rotasDoMapa = useMemo(
    () => rotas.map(({ slug, nome, distanciaKm, totalEtapas, inicio, destino }) => ({ slug, nome, distanciaKm, totalEtapas, inicio, destino })),
    [rotas]
  )

  return (
    <Layout>
      <SEO
        title="Mapa dos Lugares Sagrados"
        description="Mapa das igrejas, basílicas, santuários, aparições marianas e rotas de peregrinação do portal: Caminho da Fé e Caminho Francês de Santiago com o traçado real."
        url="https://amigosdoceu.vercel.app/mapa"
        keywords="mapa católico, peregrinação, lugares sagrados, igrejas mundo, santuários mapa, aparições marianas, Caminho da Fé, Caminho de Santiago"
      />
      <div className="py-10">
        <header className="max-w-3xl mb-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Mapa dos Lugares Sagrados</h1>
          <p className="text-lg text-neutral-300 leading-relaxed">
            {totais.igrejas} igrejas, {totais.aparicoes} aparições marianas e {rotas.length} rotas de peregrinação. Toque num selo para conhecer o lugar, ou numa
            rota para abrir o roteiro.
          </p>
        </header>

        <MapaInterativo locais={locais} rotas={rotasDoMapa} />

        <section aria-labelledby="rotas-titulo" className="mt-12">
          <h2 id="rotas-titulo" className="font-serif text-3xl text-neutral-50 mb-2">
            Rotas de peregrinação
          </h2>
          <p className="text-neutral-300 mb-6 max-w-3xl">Roteiros etapa por etapa para quem vai caminhar de verdade.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rotas.map((r) => (
              <RotaCard key={r.slug} rota={r} esboco={esbocos[r.slug]} carregado={loaded} feitas={r.etapas.filter((e) => feitasDe(r.slug)[e.numero]).length} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

import Link from 'next/link'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import RotaCard from '../../components/peregrinacoes/RotaCard'
import { usePeregrinacoes } from '../../hooks/usePeregrinacoes'
import { getRotas } from '../../lib/peregrinacoesData'
import { esbocoDaRota } from '../../lib/peregrinacoesEsboco'

export async function getStaticProps() {
  const rotas = getRotas()
  return { props: { rotas, esbocos: Object.fromEntries(rotas.map((r) => [r.slug, esbocoDaRota(r.slug)])) } }
}

export default function Peregrinacoes({ rotas, esbocos }) {
  const { loaded, feitasDe } = usePeregrinacoes()
  const url = 'https://amigosdoceu.vercel.app/peregrinacoes'

  return (
    <Layout>
      <SEO
        title="Peregrinações: roteiros etapa por etapa"
        description="Roteiros de peregrinação a pé, etapa por etapa: Caminho da Fé até Aparecida e Caminho Francês de Santiago de Compostela, com mapa, distâncias, relevo, paradas sagradas e orações."
        url={url}
        keywords="peregrinação, Caminho da Fé, Caminho de Santiago, roteiro de peregrinação, Aparecida a pé, Santiago de Compostela, etapas"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Rotas de peregrinação',
          url,
          itemListElement: rotas.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.nome, url: `${url}/${r.slug}` })),
        }}
      />
      <section className="py-12">
        <header className="max-w-3xl mb-10">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Peregrinações</h1>
          <p className="text-lg text-neutral-300 leading-relaxed">
            Roteiros para quem vai caminhar de verdade. Cada rota é dividida em etapas, com o trajeto no mapa, a distância e o relevo do dia, as paradas sagradas
            do caminho e uma oração para o trecho. Marque as etapas que fizer e acompanhe o seu progresso.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rotas.map((r) => (
            <RotaCard key={r.slug} rota={r} esboco={esbocos[r.slug]} carregado={loaded} feitas={r.etapas.filter((e) => feitasDe(r.slug)[e.numero]).length} />
          ))}
        </div>

        <p className="mt-10 text-neutral-400">
          Quer ver todos os lugares sagrados do portal?{' '}
          <Link href="/mapa" className="inline-flex min-h-[44px] items-center text-cosmic-gold underline underline-offset-4 hover:text-amber-300">
            Abrir o mapa
          </Link>
          .
        </p>
      </section>
    </Layout>
  )
}

import { useRef } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { ConexoesProvider } from '../contexts/ConexoesContext'
import HeroConexoes from '../components/conexoes/HeroConexoes'
import TimelineInterativa from '../components/conexoes/TimelineInterativa'
import ConexaoEmDestaque from '../components/conexoes/ConexaoEmDestaque'
import ExplicacaoConexao from '../components/conexoes/ExplicacaoConexao'
import DesafioDoDia from '../components/conexoes/DesafioDoDia'
import ProgressoUsuario from '../components/conexoes/ProgressoUsuario'
import TrilhasGrid from '../components/conexoes/TrilhasGrid'
import BeneficiosFooter from '../components/conexoes/BeneficiosFooter'
import DescobertaToast from '../components/conexoes/DescobertaToast'

export default function ConexoesPage() {
  const conteudoRef = useRef(null)

  function explorar() {
    conteudoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Conexões da Bíblia',
    description:
      'Experiência interativa que mostra como o Antigo Testamento se conecta ao Novo Testamento — profecias, símbolos, paralelos e cumprimento em Cristo.',
    url: 'https://amigosdoceu.vercel.app/conexoes',
    inLanguage: 'pt-BR',
    educationalLevel: 'beginner',
    learningResourceType: ['InteractiveResource', 'Quiz'],
    teaches: [
      'Profecias messiânicas',
      'Tipologia bíblica',
      'Cumprimento das promessas em Cristo',
      'Conexões entre Antigo e Novo Testamento',
    ],
    provider: {
      '@type': 'Organization',
      name: 'Amigos do Céu',
      url: 'https://amigosdoceu.vercel.app',
    },
  }

  return (
    <>
      <SEO
        title="Conexões da Bíblia"
        description="Descubra como cada promessa do Antigo Testamento se conecta ao seu cumprimento no Novo Testamento. Linha do tempo interativa, conexões em destaque, desafios diários e progresso gamificado."
        url="https://amigosdoceu.vercel.app/conexoes"
        keywords="conexões bíblicas, antigo testamento, novo testamento, profecias messiânicas, tipologia bíblica, estudo bíblico interativo, cumprimento em Cristo"
        structuredData={structuredData}
      />
      <Layout fullBleed>
        <ConexoesProvider>
          <div className="bg-cosmic-bg text-neutral-100 min-h-screen relative overflow-x-hidden">
            <HeroConexoes onExplorar={explorar} />

            <div ref={conteudoRef}>
              <TimelineInterativa />
            </div>

            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 grid lg:grid-cols-3 gap-5 lg:gap-6">
              <div className="lg:col-span-2 space-y-5 lg:space-y-6">
                <ConexaoEmDestaque />
                <ExplicacaoConexao />
              </div>
              <aside className="space-y-5 lg:space-y-6">
                <DesafioDoDia />
                <ProgressoUsuario />
              </aside>
            </section>

            <TrilhasGrid />
            <BeneficiosFooter />
            <DescobertaToast />
          </div>
        </ConexoesProvider>
      </Layout>
    </>
  )
}

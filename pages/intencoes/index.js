import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import IntencoesOracao from '../../components/IntencoesOracao';
import Link from 'next/link';

export default function IntencoesPage() {
  return (
    <Layout>
      <SEO
        title="Intenções de Oração"
        description="Compartilhe suas intenções e una-se em oração pelos pedidos da comunidade. Espaço de comunhão espiritual."
        url="https://amigosdoceu.vercel.app/intencoes"
        keywords="intenções de oração, pedidos de oração, comunidade católica, intercessão"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-surface via-cosmic-bg to-cosmic-bg" />
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(59,130,246,0.4), transparent 60%), radial-gradient(ellipse at 30% 60%, rgba(251,191,36,0.2), transparent 50%)' }} />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmic-surface-2 border border-cosmic-border mb-6">
              <span className="text-3xl">🙏</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-100 mb-4">
              Intenções de Oração
            </h1>
            <p className="text-xl text-neutral-300 mb-2">
              Compartilhe suas necessidades e una-se em oração pelos outros
            </p>
          </div>
        </div>
      </section>

      {/* Informação sobre a página */}
      <section className="bg-cosmic-surface/40 border-y border-cosmic-border py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-cosmic-surface-2 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-cosmic-border">
                  <svg className="w-8 h-8 text-cosmic-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-100 mb-2">Compartilhe</h3>
                <p className="text-sm text-neutral-400">
                  Publique suas intenções de oração de forma anônima ou com seu nome
                </p>
              </div>
              <div className="text-center">
                <div className="bg-cosmic-surface-2 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-cosmic-border">
                  <svg className="w-8 h-8 text-cosmic-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-100 mb-2">Una-se</h3>
                <p className="text-sm text-neutral-400">
                  Veja as intenções compartilhadas por outros e ore por elas
                </p>
              </div>
              <div className="text-center">
                <div className="bg-cosmic-surface-2 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-cosmic-border">
                  <svg className="w-8 h-8 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-100 mb-2">Fortaleça</h3>
                <p className="text-sm text-neutral-400">
                  Construa uma comunidade de fé e intercessão
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente de Intenções */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <IntencoesOracao />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-cosmic-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-cosmic-surface/60 border border-cosmic-border rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold text-neutral-100 mb-4 text-center">
                📿 Fortaleça sua vida de oração
              </h2>
              <p className="text-neutral-400 mb-6 text-center">
                Explore nossa coleção de orações e novenas para enriquecer sua devoção
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/oracoes"
                  className="bg-cosmic-blue text-white px-8 py-3 rounded-lg hover:bg-cosmic-blue/80 transition-colors font-medium"
                >
                  Ver Orações
                </Link>
                <Link
                  href="/novenas"
                  className="bg-transparent text-cosmic-blue-light border-2 border-cosmic-blue px-8 py-3 rounded-lg hover:bg-cosmic-blue/10 transition-colors font-medium"
                >
                  Ver Novenas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nota sobre privacidade */}
      <section className="bg-cosmic-surface/30 border-t border-cosmic-border py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-neutral-500">
              <strong className="text-neutral-400">Nota:</strong> As intenções de oração são armazenadas localmente em seu navegador.
              Para compartilhar publicamente, seria necessário implementar um backend com moderação.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

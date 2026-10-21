import Link from 'next/link'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

const DESTINOS = [
  { href: '/santos', icone: '✨', rotulo: 'Santos', texto: 'Vidas que inspiram' },
  { href: '/oracoes', icone: '🙏', rotulo: 'Orações', texto: 'Rezar agora' },
  { href: '/album-sagrado', icone: '📖', rotulo: 'Álbum Sagrado', texto: 'Suas figurinhas' },
  { href: '/conexoes', icone: '✝️', rotulo: 'Conexões da Bíblia', texto: 'Antigo e Novo Testamento' },
  { href: '/calendario', icone: '🗓️', rotulo: 'Calendário', texto: 'Festas e memórias' },
  { href: '/mapa', icone: '🗺️', rotulo: 'Lugares', texto: 'Igrejas e aparições' },
]

export default function NaoEncontrada() {
  return (
    <Layout>
      <SEO
        title="Página não encontrada"
        description="A página que você procura não existe ou mudou de endereço."
        noindex={true}
      />
      <div className="max-w-3xl mx-auto py-12 md:py-20 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">🕊️</p>
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-3">Página não encontrada</h1>
        <p className="text-gray-300 mb-8">
          Este endereço não existe ou mudou de lugar. Que tal seguir por um destes caminhos?
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-cosmic-gold text-cosmic-bg font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Voltar ao início
        </Link>
        <p className="mt-6 text-neutral-300">
          Procurando algo específico?{' '}
          <Link href="/busca" className="text-cosmic-gold underline">Use a busca</Link>.
        </p>
        <ul className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
          {DESTINOS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="block h-full p-4 rounded-xl border border-cosmic-border bg-cosmic-surface hover:border-cosmic-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
              >
                <span className="text-2xl" aria-hidden="true">{d.icone}</span>
                <span className="block mt-2 font-medium text-white">{d.rotulo}</span>
                <span className="block text-sm text-gray-400">{d.texto}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

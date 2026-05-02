import Layout from '../components/Layout'
import SEO from '../components/SEO'
import HomeHeroButton from '../components/HomeHeroButton'
import HomeSecondaryCard from '../components/HomeSecondaryCard'
import { motion } from 'framer-motion'

const HERO_SECTIONS = [
  {
    href: '/vida-de-cristo',
    title: 'Vida de Cristo',
    imageSrc: '/images/home/vida-cristo.jpg',
    imageAlt: 'Ícone do Cristo Pantocrator do Mosteiro de Santa Catarina no Sinai',
  },
  {
    href: '/santos',
    title: 'Santos',
    imageSrc: '/images/home/santos.jpg',
    imageAlt: 'Os Precursores de Cristo com Santos e Mártires, de Fra Angelico',
  },
  {
    href: '/igrejas',
    title: 'Igrejas',
    imageSrc: '/images/home/igrejas.jpg',
    imageAlt: 'Fachada da Basílica de São Pedro no Vaticano',
  },
  {
    href: '/oracoes',
    title: 'Orações',
    imageSrc: '/images/home/oracoes.jpg',
    imageAlt: 'Mãos em oração, estudo de Albrecht Dürer',
  },
]

const SECONDARY_SECTIONS = [
  { href: '/conexoes', icon: '🔗', title: 'Conexões', description: 'AT ↔ NT interativo' },
  { href: '/aparicoes', icon: '🌹', title: 'Aparições', description: 'Locais e mensagens marianas' },
  { href: '/calendario', icon: '📅', title: 'Calendário', description: 'Ano litúrgico completo' },
  { href: '/santos-do-dia', icon: '✨', title: 'Santos do Dia', description: 'Celebrados hoje' },
  { href: '/album-sagrado', icon: '📖', title: 'Álbum Sagrado', description: 'Coleção interativa' },
  { href: '/rosario', icon: '📿', title: 'Rosário', description: 'Mistérios e meditações' },
  { href: '/novenas', icon: '🕯️', title: 'Novenas', description: 'Nove dias de oração' },
  { href: '/mapa', icon: '🗺️', title: 'Mapa', description: 'Lugares sagrados' },
  { href: '/intencoes', icon: '🙏', title: 'Intenções', description: 'Peça orações' },
  { href: '/favoritos', icon: '⭐', title: 'Favoritos', description: 'Seu caminho devocional' },
]

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Amigos do Céu',
    url: 'https://amigosdoceu.vercel.app',
    description:
      'Portal contemplativo da fé católica: santos, igrejas, aparições marianas, calendário litúrgico, orações, vida de Cristo e conexões bíblicas interativas.',
    inLanguage: 'pt-BR',
    publisher: {
      '@type': 'Organization',
      name: 'Amigos do Céu',
      url: 'https://amigosdoceu.vercel.app',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://amigosdoceu.vercel.app/santos?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Layout hideHeader fullBleed>
      <SEO
        title="Amigos do Céu"
        description="Uma jornada contemplativa pela fé católica. Vida de Cristo, santos, igrejas, orações, aparições marianas e conexões bíblicas — tudo em um só lugar."
        url="https://amigosdoceu.vercel.app"
        keywords="vida de cristo, santos católicos, igrejas históricas, orações católicas, aparições marianas, calendário litúrgico, conexões bíblicas"
        structuredData={structuredData}
      />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-10 pb-6 md:pt-14 md:pb-8 text-center max-w-3xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-3">Amigos do Céu</h1>
        <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
          Uma jornada contemplativa pela fé católica. Escolha por onde começar.
        </p>
      </motion.section>

      <section className="px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-6xl mx-auto">
          {HERO_SECTIONS.map((section, i) => (
            <HomeHeroButton key={section.href} index={i} {...section} />
          ))}
        </div>
      </section>

      <section className="px-4 py-10 bg-amber-50/40 border-y border-amber-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-800 mb-5 text-center">
            Explore também
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {SECONDARY_SECTIONS.map((s) => (
              <HomeSecondaryCard key={s.href} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-neutral-700 italic text-lg font-serif">
            "Temos ao nosso redor uma grande nuvem de testemunhas."
            <br />
            <span className="font-semibold not-italic text-sm tracking-wider text-amber-800">— HEBREUS 12:1</span>
          </p>
        </div>
      </section>
    </Layout>
  )
}

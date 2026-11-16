/**
 * Metadados de SEO das páginas de oração (`/oracoes/[slug]`), novena (`/novenas/[slug]`)
 * e do Rosário: props prontas para `<SEO>`.
 *
 * Lógica pura, sem JSON nem React; testada em `tests/seoOracoes.test.mjs`.
 */

export const SITE_URL = 'https://amigosdoceu.vercel.app'

const LIMITE_DESCRICAO = 160

/** Uma linha só, cortada em palavra inteira com reticências quando passa do limite. */
export function resumir(texto, limite = LIMITE_DESCRICAO) {
  const t = String(texto || '').replace(/\s+/g, ' ').trim()
  if (t.length <= limite) return t
  const corte = t.slice(0, limite - 1)
  const ultimoEspaco = corte.lastIndexOf(' ')
  return `${(ultimoEspaco > limite / 2 ? corte.slice(0, ultimoEspaco) : corte).replace(/[\s,;:.]+$/, '')}…`
}

const juntar = (lista) => [...new Set(lista.filter(Boolean))].join(', ')

function trilha(secao, caminhoSecao, nome, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: secao, item: `${SITE_URL}${caminhoSecao}` },
      { '@type': 'ListItem', position: 3, name: nome, item: url },
    ],
  }
}

/** "Pai Nosso" → "Pai Nosso: oração completa"; nomes que já dizem "Oração" ficam como estão. */
function tituloDaOracao(nome) {
  return /ora[cç][aã]o/i.test(nome) ? nome : `${nome}: oração completa`
}

export function seoOracao(oracao) {
  const url = `${SITE_URL}/oracoes/${oracao.slug}`
  const description = resumir(oracao.descricao || `${oracao.nome}: oração católica tradicional, com o texto completo para rezar.`)
  return {
    title: tituloDaOracao(oracao.nome),
    description,
    url,
    type: 'article',
    ...(oracao.imagem ? { image: oracao.imagem } : {}),
    keywords: juntar([oracao.nome, 'oração católica', oracao.categoria, ...(oracao.tags || [])]),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: oracao.nome,
        description,
        url,
        inLanguage: 'pt-BR',
        articleSection: oracao.categoria || 'Orações',
        ...(oracao.texto ? { articleBody: oracao.texto } : {}),
        isAccessibleForFree: true,
        publisher: { '@type': 'Organization', name: 'Amigos do Céu', url: SITE_URL },
      },
      trilha('Orações', '/oracoes', oracao.nome, url),
    ],
  }
}

export function seoNovena(novena) {
  const url = `${SITE_URL}/novenas/${novena.slug}`
  const dias = novena.duracao || (novena.dias || []).length || 9
  const description = resumir(
    `${novena.descricao || `${novena.nome}, novena católica.`} ${dias} dias com leitura, meditação e oração.`,
  )
  return {
    title: `${novena.nome}: ${dias} dias de oração`,
    description,
    url,
    type: 'article',
    ...(novena.imagem ? { image: novena.imagem } : {}),
    keywords: juntar([novena.nome, 'novena católica', novena.categoria, novena.dataFesta, ...(novena.tags || [])]),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: novena.nome,
        description,
        url,
        inLanguage: 'pt-BR',
        articleSection: 'Novenas',
        isAccessibleForFree: true,
        publisher: { '@type': 'Organization', name: 'Amigos do Céu', url: SITE_URL },
      },
      trilha('Novenas', '/novenas', novena.nome, url),
    ],
  }
}

export const SEO_ROSARIO = {
  title: 'Rosário Virtual: reze o terço online',
  description: 'Reze o Santo Rosário online, conta por conta: mistérios gozosos, luminosos, dolorosos e gloriosos, com as meditações e o seu progresso guardado.',
  url: `${SITE_URL}/rosario`,
  keywords: 'rosário virtual, terço online, mistérios do rosário, Ave Maria, Pai Nosso',
}

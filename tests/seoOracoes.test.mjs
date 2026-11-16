import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { resumir, seoOracao, seoNovena, SEO_ROSARIO, SITE_URL } from '../lib/seoOracoes.js'

const raiz = new URL('..', import.meta.url).pathname
const json = (caminho) => JSON.parse(readFileSync(join(raiz, caminho), 'utf8'))
const oracoes = json('data/oracoes.json')
const novenas = json('data/novenas.json')

test('resumir mantém textos curtos e corta os longos em palavra inteira', () => {
  assert.equal(resumir('  Oração  do\nSenhor. '), 'Oração do Senhor.')
  const longo = 'palavra '.repeat(60)
  const curto = resumir(longo)
  assert.ok(curto.length <= 160)
  assert.ok(curto.endsWith('palavra…'))
  assert.equal(resumir(''), '')
  assert.equal(resumir(null), '')
})

test('seoOracao: título, descrição, canônica e dados estruturados', () => {
  const seo = seoOracao({
    nome: 'Pai Nosso', slug: 'pai-nosso', categoria: 'Orações Essenciais', tags: ['jesus'],
    descricao: 'A oração ensinada por Jesus.', texto: 'Pai nosso que estais nos céus…', imagem: null,
  })
  assert.equal(seo.title, 'Pai Nosso: oração completa')
  assert.equal(seo.description, 'A oração ensinada por Jesus.')
  assert.equal(seo.url, `${SITE_URL}/oracoes/pai-nosso`)
  assert.equal(seo.type, 'article')
  assert.ok(!('image' in seo), 'sem imagem própria, o <SEO> usa a imagem padrão')
  assert.equal(seo.keywords, 'Pai Nosso, oração católica, Orações Essenciais, jesus')
  const [artigo, trilha] = seo.structuredData
  assert.equal(artigo['@type'], 'Article')
  assert.equal(artigo.articleBody, 'Pai nosso que estais nos céus…')
  assert.deepEqual(trilha.itemListElement.map((i) => i.name), ['Início', 'Orações', 'Pai Nosso'])
  assert.equal(trilha.itemListElement[2].item, seo.url)
})

test('seoOracao: não repete "oração" no título e tolera campos ausentes', () => {
  assert.equal(seoOracao({ nome: 'Oração de São Bento', slug: 'oracao-sao-bento' }).title, 'Oração de São Bento')
  const seo = seoOracao({ nome: 'Magnificat', slug: 'magnificat' })
  assert.ok(seo.description.startsWith('Magnificat: oração católica'))
  assert.ok(!('articleBody' in seo.structuredData[0]))
  assert.equal(seoOracao({ nome: 'X', slug: 'x', imagem: '/images/x.jpg' }).image, '/images/x.jpg')
})

test('seoNovena: título com a duração e descrição com o que a página oferece', () => {
  const seo = seoNovena({
    nome: 'Novena a São José', slug: 'novena-sao-jose', duracao: 9, categoria: 'Santos',
    dataFesta: '19 de março', tags: ['família'], descricao: 'Novena ao pai adotivo de Jesus.',
  })
  assert.equal(seo.title, 'Novena a São José: 9 dias de oração')
  assert.equal(seo.description, 'Novena ao pai adotivo de Jesus. 9 dias com leitura, meditação e oração.')
  assert.equal(seo.url, `${SITE_URL}/novenas/novena-sao-jose`)
  assert.deepEqual(seo.structuredData[1].itemListElement.map((i) => i.name), ['Início', 'Novenas', 'Novena a São José'])
  assert.equal(seoNovena({ nome: 'N', slug: 'n', dias: [1, 2, 3] }).title, 'N: 3 dias de oração')
})

test('todas as orações e novenas cadastradas geram metadados válidos e únicos', () => {
  const todos = [...oracoes.map(seoOracao), ...novenas.map(seoNovena), SEO_ROSARIO]
  for (const seo of todos) {
    assert.ok(seo.title && seo.title.length <= 60, `título longo ou vazio: ${seo.title}`)
    assert.ok(seo.description.length >= 50 && seo.description.length <= 160, `descrição fora de 50–160: ${seo.url}`)
    assert.ok(seo.url.startsWith(`${SITE_URL}/`))
  }
  assert.equal(new Set(todos.map((s) => s.title)).size, todos.length, 'títulos repetidos')
  assert.equal(new Set(todos.map((s) => s.url)).size, todos.length, 'URLs repetidas')
})

// Rede de segurança: páginas de oração e novena ficaram sem <title> porque passavam
// `title` ao Layout, que ignora a prop. Toda página precisa do componente <SEO>.
test('toda página em pages/ usa o componente <SEO>', () => {
  const semSeo = ['_app.js', '_document.js', 'sitemap.xml.js']
  const listar = (dir) => readdirSync(join(raiz, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listar(join(dir, e.name)) : e.name.endsWith('.js') ? [join(dir, e.name)] : [])
  const faltando = listar('pages')
    .filter((arq) => !semSeo.some((n) => arq.endsWith(n)))
    .filter((arq) => !/<SEO[\s/>]/.test(readFileSync(join(raiz, arq), 'utf8')))
  assert.deepEqual(faltando, [])
})

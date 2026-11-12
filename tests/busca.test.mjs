import test from 'node:test'
import assert from 'node:assert/strict'
import { buscar, montarIndice, normalizar, TIPOS_BUSCA } from '../lib/busca.js'

const base = { santos: [], oracoes: [], novenas: [], aparicoes: [], igrejas: [], vidaCristo: [], conexoes: [] }

const rota = {
  slug: 'caminho-teste',
  nome: 'Caminho de Teste',
  subtitulo: 'Ramal único',
  resumo: 'Uma rota de exemplo.',
  inicio: 'Vila Alfa',
  destino: 'Santuário Ômega',
  paises: ['Brasil'],
  etapas: [
    {
      numero: 1,
      origem: 'Vila Alfa',
      destino: 'Águas Claras',
      distanciaKm: 21.14,
      paradas: [
        { tipo: 'local', nome: 'Capela de São Roque', href: null },
        { tipo: 'igreja', nome: 'Basílica com Página', href: '/igrejas/basilica-com-pagina' },
      ],
    },
    { numero: 2, origem: 'Águas Claras', destino: 'Santuário Ômega', distanciaKm: null, paradas: [] },
  ],
}

test('normalizar tira acentos, caixa e espaços das pontas', () => {
  assert.equal(normalizar('  São JOSÉ  '), 'sao jose')
  assert.equal(normalizar(null), '')
})

test('busca ignora acentos e exige todos os termos', () => {
  const indice = montarIndice({
    ...base,
    santos: [
      { slug: 'sao-jose', nome: 'São José', descricao: 'Esposo de Maria', tags: ['carpinteiro'] },
      { slug: 'santa-rita', nome: 'Santa Rita', descricao: 'Advogada das causas impossíveis' },
    ],
  })
  assert.deepEqual(buscar(indice, 'jose').map((r) => r.id), ['santo:sao-jose'])
  assert.deepEqual(buscar(indice, 'sao carpinteiro').map((r) => r.id), ['santo:sao-jose'])
  assert.deepEqual(buscar(indice, 'jose rita'), [])
  assert.deepEqual(buscar(indice, '   '), [])
})

test('índice sem peregrinações continua funcionando (parâmetro opcional)', () => {
  assert.deepEqual(montarIndice(base), [])
})

test('rota, etapas e paradas sem página entram no índice', () => {
  const indice = montarIndice({ ...base, peregrinacoes: [rota] })
  assert.deepEqual(
    indice.map((i) => i.id),
    ['peregrinacao:caminho-teste', 'peregrinacao:caminho-teste#1', 'peregrinacao:caminho-teste#1:0', 'peregrinacao:caminho-teste#2']
  )
  assert.ok(indice.every((i) => TIPOS_BUSCA[i.tipo]), 'todo item tem tipo conhecido')
  assert.equal(new Set(indice.map((i) => i.id)).size, indice.length, 'ids únicos')
})

test('nome da rota encontra a rota, não as etapas', () => {
  const indice = montarIndice({ ...base, peregrinacoes: [rota] })
  const r = buscar(indice, 'caminho de teste')
  assert.deepEqual(r.map((i) => i.href), ['/peregrinacoes/caminho-teste'])
})

test('cidade encontra as etapas, com link direto e resumo', () => {
  const indice = montarIndice({ ...base, peregrinacoes: [rota] })
  const r = buscar(indice, 'aguas claras')
  // A etapa que parte da cidade (título começa com ela) vem antes da que chega nela.
  assert.deepEqual(r.map((i) => i.href), ['/peregrinacoes/caminho-teste?etapa=2', '/peregrinacoes/caminho-teste?etapa=1'])
  assert.equal(r[1].titulo, 'Vila Alfa → Águas Claras')
  assert.equal(r[1].resumo, 'Caminho de Teste · Etapa 1 · 21,1 km')
  assert.equal(r[0].resumo, 'Caminho de Teste · Etapa 2')
})

test('parada sem página leva à etapa; parada com página não é duplicada', () => {
  const indice = montarIndice({ ...base, peregrinacoes: [rota] })
  const [parada] = buscar(indice, 'sao roque')
  assert.equal(parada.href, '/peregrinacoes/caminho-teste?etapa=1')
  assert.match(parada.resumo, /Parada da etapa 1 do Caminho de Teste/)
  assert.deepEqual(buscar(indice, 'basilica com pagina'), [])
})

test('em empate, a rota vem antes das suas etapas', () => {
  // "Ômega" aparece no meio do título da rota e da etapa 2 (mesma pontuação);
  // pela ordem alfabética a etapa ("Águas Claras → …") viria primeiro.
  const indice = montarIndice({ ...base, peregrinacoes: [{ ...rota, nome: 'Caminho do Ômega' }] })
  const r = buscar(indice, 'omega')
  assert.deepEqual(r.map((i) => i.id), ['peregrinacao:caminho-teste', 'peregrinacao:caminho-teste#2'])
})

test('"peregrinação" lista as rotas', () => {
  const indice = montarIndice({ ...base, peregrinacoes: [rota] })
  assert.deepEqual(buscar(indice, 'peregrinação').map((i) => i.id), ['peregrinacao:caminho-teste'])
})

test('parada de rota vem depois das entidades com página, mesmo as que casam só por tag', () => {
  const indice = montarIndice({
    ...base,
    igrejas: [
      { slug: 'matriz-sao-roque', nome: 'Matriz de São Roque', local: 'Vila Alfa' },
      { slug: 'santuario-da-serra', nome: 'Santuário da Serra', local: 'Vila Alfa', tags: ['São Roque'] },
    ],
    peregrinacoes: [rota],
  })
  assert.deepEqual(
    buscar(indice, 'roque').map((i) => i.id),
    ['igreja:matriz-sao-roque', 'igreja:santuario-da-serra', 'peregrinacao:caminho-teste#1:0']
  )
})

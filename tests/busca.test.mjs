import test from 'node:test'
import assert from 'node:assert/strict'
import { buscar, buscarAproximado, distanciaEdicao, toleranciaDe, montarIndice, normalizar, TIPOS_BUSCA } from '../lib/busca.js'

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

// ── Seções do site e celebrações do calendário ─────────────────────────────

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { celebracoesDoCalendario, hrefResultado, SECOES_BUSCA, SUGESTOES_BUSCA } from '../lib/busca.js'
import { proximaOcorrencia } from '../lib/calendarioLink.js'

const raiz = new URL('..', import.meta.url).pathname
const json = (caminho) => JSON.parse(readFileSync(join(raiz, caminho), 'utf8'))

test('proximaOcorrencia: hoje, ainda este ano, já passou e 29 de fevereiro', () => {
  assert.equal(proximaOcorrencia(11, 22, '2026-11-17'), '2026-11-22')
  assert.equal(proximaOcorrencia(11, 17, '2026-11-17'), '2026-11-17')
  assert.equal(proximaOcorrencia(1, 1, '2026-11-17'), '2027-01-01')
  assert.equal(proximaOcorrencia(2, 29, '2026-11-17'), '2028-02-29')
  assert.equal(proximaOcorrencia(2, 30, '2026-11-17'), null)
  assert.equal(proximaOcorrencia(1, 1, 'ontem'), null)
})

test('celebrações viram itens com data no resumo e link para a próxima ocorrência no calendário', () => {
  const celebracoes = celebracoesDoCalendario({
    janeiro: { 1: { nome: 'Santa Maria, Mãe de Deus', tipo: 'Solenidade', descricao: 'Oitava do Natal' } },
    novembro: { 22: { nome: 'Santa Cecília', tipo: 'Memória', descricao: 'Padroeira dos músicos' }, 2: { nome: 'Finados', tipo: 'Comemoração' } },
  })
  assert.deepEqual(celebracoes.map((c) => `${c.mes}/${c.dia}`), ['1/1', '11/2', '11/22'], 'ordem do ano')
  const indice = montarIndice({ ...base, celebracoes })
  const [cecilia] = buscar(indice, 'cecilia')
  assert.equal(cecilia.id, 'celebracao:11-22')
  assert.equal(cecilia.resumo, '22 de novembro · Memória · Padroeira dos músicos')
  assert.equal(hrefResultado(cecilia, '2026-11-17'), '/calendario?dia=2026-11-22')
  assert.equal(hrefResultado(cecilia, '2026-12-01'), '/calendario?dia=2027-11-22')
  assert.deepEqual(buscar(indice, 'musicos').map((r) => r.id), ['celebracao:11-22'], 'descrição entra na busca')
  assert.deepEqual(buscar(indice, '22 de novembro').map((r) => r.id), ['celebracao:11-22'], 'data por extenso entra na busca')
  assert.equal(hrefResultado({ href: '/santos/x' }, '2026-11-17'), '/santos/x', 'itens sem data não mudam')
})

test('seção do site vem antes de uma página com a mesma pontuação', () => {
  const indice = montarIndice({
    ...base,
    oracoes: [{ slug: 'salve-rainha', nome: 'Rosário de Salve Rainha', descricao: '' }],
    secoes: SECOES_BUSCA,
  })
  assert.deepEqual(buscar(indice, 'rosario').map((r) => r.href).slice(0, 2), ['/rosario', '/oracoes/salve-rainha'])
  assert.equal(buscar(indice, 'terço')[0].href, '/rosario', 'sinônimo leva à seção')
  assert.equal(buscar(indice, 'figurinhas')[0].href, '/album-sagrado')
})

test('dados reais: celebrações, seções e todas as sugestões da busca vazia trazem resultado', () => {
  const calendario = json('data/calendario-liturgico.json')
  const celebracoes = celebracoesDoCalendario(calendario)
  const total = Object.values(calendario).reduce((n, mes) => n + Object.keys(mes).length, 0)
  assert.equal(celebracoes.length, total, 'nenhuma celebração perdida (inclusive março, chave "marco")')
  const indice = montarIndice({
    santos: json('data/santos.json'), oracoes: json('data/oracoes.json'), novenas: json('data/novenas.json'),
    aparicoes: json('data/aparicoes.json'), igrejas: json('data/igrejas.json'), vidaCristo: json('data/vida-cristo.json'),
    conexoes: [], celebracoes, secoes: SECOES_BUSCA,
  })
  assert.equal(new Set(indice.map((i) => i.id)).size, indice.length, 'ids únicos')
  assert.ok(indice.every((i) => TIPOS_BUSCA[i.tipo]), 'todo item tem tipo conhecido')
  for (const s of SUGESTOES_BUSCA) assert.ok(buscar(indice, s).length > 0, `sugestão "${s}" sem resultado`)
  for (const q of ['natal', 'todos os santos', 'cecília', 'finados']) {
    assert.ok(buscar(indice, q).some((r) => r.tipo === 'celebracao'), `"${q}" deveria achar a celebração`)
  }
  assert.equal(buscar(indice, 'páscoa')[0].href, '/vida-de-cristo?evento=ressurreicao')
  for (const [q, href] of [['rosário', '/rosario'], ['calendário', '/calendario'], ['álbum', '/album-sagrado'], ['mapa', '/mapa']]) {
    assert.equal(buscar(indice, q)[0].href, href, `"${q}" deveria abrir ${href}`)
  }
  // Toda seção aponta para uma página que existe.
  for (const s of SECOES_BUSCA) {
    const arquivo = s.href.slice(1)
    const existe = [`pages/${arquivo}.js`, `pages/${arquivo}/index.js`].some((f) => { try { readFileSync(join(raiz, f)); return true } catch { return false } })
    assert.ok(existe, `seção ${s.href} sem página em pages/`)
  }
})

test('distanciaEdicao e toleranciaDe', () => {
  assert.equal(distanciaEdicao('francisco', 'francisco'), 0)
  assert.equal(distanciaEdicao('fransisco', 'francisco'), 1)
  assert.equal(distanciaEdicao('abc', 'wxyz', 2) > 2, true)
  assert.deepEqual(['pai', 'ave', 'maria', 'ressurreicao'].map(toleranciaDe), [0, 0, 1, 2])
})

test('buscarAproximado tolera erro de digitação, mas não palavras curtas nem lixo', () => {
  const indice = montarIndice({
    ...base,
    santos: [{ slug: 'sao-francisco-de-assis', nome: 'São Francisco de Assis', descricao: 'Fundador dos franciscanos.', tags: [] }],
    oracoes: [{ slug: 'pai-nosso', nome: 'Pai Nosso', descricao: 'Oração de Jesus.', tags: [] }, { slug: 'paz', nome: 'Oração da Paz', descricao: 'Paz.', tags: [] }],
  })
  assert.equal(buscar(indice, 'sao fransisco').length, 0, 'a busca exata continua exata')
  assert.equal(buscarAproximado(indice, 'sao fransisco')[0].href, '/santos/sao-francisco-de-assis')
  assert.equal(buscarAproximado(indice, 'franciso')[0].href, '/santos/sao-francisco-de-assis')
  assert.equal(buscarAproximado(indice, 'fransis')[0].href, '/santos/sao-francisco-de-assis', 'palavra ainda por escrever')
  assert.equal(buscarAproximado(indice, 'pai')[0], undefined, '3 letras: só exato')
  assert.deepEqual(buscarAproximado(indice, 'xqzwvk'), [])
  assert.deepEqual(buscarAproximado(indice, '   '), [])
})

test('dados reais: grafias erradas comuns acham o item certo; lixo continua sem resultado', () => {
  const indice = montarIndice({
    santos: json('data/santos.json'), oracoes: json('data/oracoes.json'), novenas: json('data/novenas.json'),
    aparicoes: json('data/aparicoes.json'), igrejas: json('data/igrejas.json'), vidaCristo: json('data/vida-cristo.json'),
    conexoes: [], celebracoes: celebracoesDoCalendario(json('data/calendario-liturgico.json')), secoes: SECOES_BUSCA,
  })
  const titulos = (q) => buscarAproximado(indice, q).map((r) => r.titulo)
  assert.ok(titulos('sao fransisco').includes('São Francisco de Assis'))
  assert.ok(titulos('ressureição').includes('Ressurreição'))
  assert.ok(titulos('fatma').includes('Nossa Senhora de Fátima'))
  assert.ok(titulos('rozario').includes('Rosário'))
  assert.deepEqual(titulos('xyzabc'), [])
})

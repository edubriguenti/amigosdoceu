/** Busca global: lógica pura (sem React nem JSON), usada por pages/busca.js e testável em Node. */

import { hrefDiaCalendario, proximaOcorrencia } from './calendarioLink.js'

export function normalizar(texto) {
  if (!texto) return ''
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export const TIPOS_BUSCA = {
  secao: { rotulo: 'Seções do site', icone: '🧭' },
  santo: { rotulo: 'Santos', icone: '✨' },
  oracao: { rotulo: 'Orações', icone: '🙏' },
  novena: { rotulo: 'Novenas', icone: '🕯️' },
  aparicao: { rotulo: 'Aparições', icone: '🌹' },
  igreja: { rotulo: 'Igrejas', icone: '⛪' },
  cristo: { rotulo: 'Vida de Cristo', icone: '✝️' },
  conexao: { rotulo: 'Conexões da Bíblia', icone: '📜' },
  peregrinacao: { rotulo: 'Peregrinações', icone: '🥾' },
  celebracao: { rotulo: 'Calendário', icone: '📅' },
}

/** Sugestões da busca vazia. `tests/busca.test.mjs` garante que todas trazem resultado. */
export const SUGESTOES_BUSCA = ['Maria', 'Rosário', 'Natal', 'Fátima', 'Roma', 'Páscoa', 'Padroeiro', 'Peregrinação']

/**
 * Seções do site (páginas de entrada) que a busca deve encontrar pelo nome ou por palavras
 * que o usuário usaria para chegar nelas ("terço" → Rosário, "figurinhas" → Álbum).
 */
export const SECOES_BUSCA = [
  { href: '/rosario', titulo: 'Rosário', resumo: 'Reze o terço conta por conta, com os mistérios do dia.', palavras: ['terço', 'mistérios gozosos luminosos dolorosos gloriosos', 'ave-maria'] },
  { href: '/calendario', titulo: 'Calendário Litúrgico', resumo: 'Solenidades, festas e memórias de cada dia do ano.', palavras: ['liturgia', 'festas', 'solenidades', 'memórias', 'cores litúrgicas'] },
  { href: '/santos-do-dia', titulo: 'Santos do Dia', resumo: 'Quem a Igreja celebra hoje e as próximas celebrações.', palavras: ['hoje', 'santo de hoje', 'festa de hoje'] },
  { href: '/album-sagrado', titulo: 'Álbum Sagrado', resumo: 'Figurinhas de santos, aparições, igrejas e da vida de Cristo para colecionar.', palavras: ['figurinhas', 'coleção', 'colecionar'] },
  { href: '/mapa', titulo: 'Mapa dos lugares sagrados', resumo: 'Igrejas, aparições e rotas de peregrinação no mapa.', palavras: ['lugares', 'santuários', 'onde fica'] },
  { href: '/vida-de-cristo', titulo: 'Vida de Cristo', resumo: 'A vida de Jesus em imagens, do Nascimento à Ascensão.', palavras: ['jesus', 'evangelho', 'linha do tempo'] },
  { href: '/conexoes', titulo: 'Conexões da Bíblia', resumo: 'Como as promessas do Antigo Testamento se cumprem no Novo.', palavras: ['bíblia', 'antigo testamento', 'novo testamento', 'desafio do dia', 'quiz'] },
  { href: '/peregrinacoes', titulo: 'Peregrinações', resumo: 'Roteiros etapa por etapa para quem vai caminhar.', palavras: ['peregrinação', 'caminhos', 'romaria', 'rotas'] },
  { href: '/oracoes', titulo: 'Orações', resumo: 'Orações católicas completas para rezar.', palavras: ['rezar', 'preces', 'oração'] },
  { href: '/novenas', titulo: 'Novenas', resumo: 'Nove dias de oração, acompanhados dia a dia.', palavras: ['novena', 'nove dias'] },
  { href: '/santos', titulo: 'Santos', resumo: 'Todos os santos do site, com filtros.', palavras: ['santo', 'santa', 'biografias'] },
  { href: '/igrejas', titulo: 'Igrejas e basílicas', resumo: 'Igrejas, basílicas e catedrais do mundo.', palavras: ['igreja', 'basílica', 'catedral', 'santuário'] },
  { href: '/aparicoes', titulo: 'Aparições marianas', resumo: 'Onde e como Nossa Senhora apareceu.', palavras: ['aparição', 'nossa senhora'] },
  { href: '/minha-jornada', titulo: 'Minha Jornada', resumo: 'Seu progresso: álbum, orações, novenas, conexões e peregrinações.', palavras: ['progresso', 'sequência', 'meu progresso'] },
  { href: '/favoritos', titulo: 'Favoritos', resumo: 'Santos, igrejas e aparições que você guardou.', palavras: ['salvos', 'listas'] },
  { href: '/intencoes', titulo: 'Minhas Intenções', resumo: 'Seus pedidos de oração, guardados só neste aparelho.', palavras: ['pedidos', 'intenção'] },
]

const MESES = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const NOMES_MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

/** `data/calendario-liturgico.json` (meses → dias) → lista plana `{ mes, dia, nome, tipo, descricao }`, em ordem. */
export function celebracoesDoCalendario(calendario) {
  return MESES.flatMap((chave, i) =>
    Object.entries(calendario?.[chave] || {})
      .map(([dia, c]) => ({ mes: i + 1, dia: Number(dia), nome: c.nome, tipo: c.tipo || null, descricao: c.descricao || '' }))
      .sort((a, b) => a.dia - b.dia)
  )
}

/**
 * Endereço de um resultado. Celebrações têm data fixa mas não ano: o link aponta para a
 * próxima ocorrência a partir de `hojeIso` (o índice é estático, então o ano é resolvido aqui).
 */
export function hrefResultado(item, hojeIso) {
  if (!item.diaMes) return item.href
  const [mes, dia] = item.diaMes.split('-').map(Number)
  const iso = proximaOcorrencia(mes, dia, hojeIso)
  return iso ? hrefDiaCalendario(iso) : item.href
}

/**
 * Monta o índice a partir dos JSONs. `texto` guarda só campos curtos (sem o texto integral das
 * orações) para o índice enviado ao navegador continuar pequeno.
 */
export function montarIndice({ santos, oracoes, novenas, aparicoes, igrejas, vidaCristo, conexoes, peregrinacoes = [], celebracoes = [], secoes = [] }) {
  const corta = (s, n = 140) => {
    const t = String(s || '').replace(/\s+/g, ' ').trim()
    return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t
  }
  const item = (tipo, slug, href, titulo, resumo, extras = []) => ({
    id: `${tipo}:${slug}`,
    tipo,
    href,
    titulo,
    resumo: corta(resumo),
    texto: normalizar([titulo, ...extras].filter(Boolean).join(' ')),
  })
  const km = (v) => (v != null ? ` · ${v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km` : '')
  // Cada rota entra três vezes: a rota (em destaque), suas etapas (pelas cidades de saída e
  // chegada) e as paradas sem página própria. Paradas com página já estão no índice como entidade.
  const itensDaRota = (r) => {
    const hrefEtapa = (e) => `/peregrinacoes/${r.slug}?etapa=${e.numero}`
    return [
      { ...item('peregrinacao', r.slug, `/peregrinacoes/${r.slug}`, r.nome, r.resumo, [r.subtitulo, r.inicio, r.destino, ...(r.paises || []), 'peregrinação romaria roteiro']), destaque: 1 },
      ...r.etapas.flatMap((e) => [
        item('peregrinacao', `${r.slug}#${e.numero}`, hrefEtapa(e), `${e.origem} → ${e.destino}`, `${r.nome} · Etapa ${e.numero}${km(e.distanciaKm)}`),
        ...e.paradas
          .filter((p) => !p.href)
          .map((p, i) => ({
            ...item('peregrinacao', `${r.slug}#${e.numero}:${i}`, hrefEtapa(e), p.nome, `Parada da etapa ${e.numero} do ${r.nome} (${e.origem} → ${e.destino})`),
            // Destaque negativo também tira o bônus de título: a parada fica sempre depois das páginas.
            destaque: -1,
          })),
      ]),
    ]
  }
  const pad = (n) => String(n).padStart(2, '0')
  const itemCelebracao = (c) => {
    const data = `${c.dia} de ${NOMES_MESES[c.mes - 1]}`
    const { texto, ...resto } = item('celebracao', `${pad(c.mes)}-${pad(c.dia)}`, '/calendario', c.nome,
      [data, c.tipo, c.descricao].filter(Boolean).join(' · '))
    // Sem `texto`: a busca usa título + resumo, que já trazem data, tipo e descrição (índice menor).
    return { ...resto, diaMes: `${pad(c.mes)}-${pad(c.dia)}` }
  }
  return [
    // Seções vêm em destaque: em "rosário" a página do Rosário vem antes da Salve Rainha.
    ...secoes.map((s) => ({ ...item('secao', s.href, s.href, s.titulo, s.resumo, s.palavras), destaque: 2 })),
    ...santos.map((s) => item('santo', s.slug, `/santos/${s.slug}`, s.nome, s.descricao,
      [...(s.tags || []), ...(s.padroeiro || []), s.pais, s.ordemReligiosa, s.periodo])),
    ...oracoes.map((o) => item('oracao', o.slug, `/oracoes/${o.slug}`, o.nome, o.descricao,
      [...(o.tags || []), o.categoria, o.descricao])),
    ...novenas.map((n) => item('novena', n.slug, `/novenas/${n.slug}`, n.nome, n.descricao,
      [...(n.tags || []), n.categoria, n.descricao])),
    ...aparicoes.map((a) => item('aparicao', a.slug, `/aparicoes/${a.slug}`, a.nome, a.local,
      [...(a.tags || []), a.local, a.data])),
    ...igrejas.map((i) => item('igreja', i.slug, `/igrejas/${i.slug}`, i.nome, i.local,
      [...(i.tags || []), i.local, i.cidade, i.pais, i.estiloArquitetonico, i.arquiteto])),
    ...vidaCristo.map((v) => item('cristo', v.slug, `/vida-de-cristo?evento=${v.slug}`, v.title, v.description,
      [v.scripture, v.obra, v.artist, v.description])),
    ...conexoes.map((c) => item('conexao', c.slug, `/conexoes?ref=${c.slug}`, c.tema,
      `${c.antigoTestamento?.referencia} ↔ ${c.novoTestamento?.referencia}`,
      [c.antigoTestamento?.referencia, c.novoTestamento?.referencia])),
    ...peregrinacoes.flatMap(itensDaRota),
    ...celebracoes.map(itemCelebracao),
  ]
}

/**
 * Todos os termos precisam aparecer. Título pesa mais; começo do título mais ainda.
 * `destaque` desempata: seções do site (2) primeiro; a rota (1) vem antes das etapas, e as paradas de rota (-1) vêm por
 * último — são muitas e não devem afogar santos, orações e igrejas.
 */
// Formas normalizadas calculadas no navegador (uma vez por item), para não pesarem no índice enviado.
const normalizados = new WeakMap()
function formas(it) {
  let f = normalizados.get(it)
  if (!f) {
    f = {
      texto: it.texto ?? normalizar(`${it.titulo} ${it.resumo}`),
      titulo: (it.destaque || 0) < 0 ? '' : normalizar(it.titulo),
    }
    normalizados.set(it, f)
  }
  return f
}

export function buscar(indice, consulta, tipo = null) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (!termos.length) return []
  const pontuados = []
  for (const it of indice) {
    if (tipo && it.tipo !== tipo) continue
    const f = formas(it)
    if (!termos.every((t) => f.texto.includes(t))) continue
    let pontos = 0
    for (const t of termos) {
      if (f.titulo.startsWith(t)) pontos += 3
      else if (f.titulo.includes(t)) pontos += 2
      else pontos += 1
    }
    pontuados.push({ it, pontos })
  }
  return pontuados
    .sort((a, b) => b.pontos - a.pontos || (b.it.destaque || 0) - (a.it.destaque || 0) || a.it.titulo.localeCompare(b.it.titulo, 'pt-BR'))
    .map((p) => p.it)
}

// --- Busca aproximada (erros de digitação) ---------------------------------------------------------------------------

/** Distância de edição (inserção, remoção, troca) entre duas palavras já normalizadas. Para quando passa de `max`. */
export function distanciaEdicao(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let anterior = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const atual = [i]
    let menor = i
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1
      atual[j] = Math.min(anterior[j] + 1, atual[j - 1] + 1, anterior[j - 1] + custo)
      if (atual[j] < menor) menor = atual[j]
    }
    if (menor > max) return max + 1
    anterior = atual
  }
  return anterior[b.length]
}

/** Erros tolerados por tamanho da palavra: curtas só exatas ("pai" ≠ "paz"), médias 1, longas 2. */
export function toleranciaDe(termo) {
  if (termo.length < 4) return 0
  return termo.length < 8 ? 1 : 2
}

/** Um termo "casa" com uma palavra do texto se for parecido com ela inteira ou com o começo dela (palavra por escrever). */
function termoCasa(termo, palavras) {
  const max = toleranciaDe(termo)
  if (!max) return false
  return palavras.some((p) =>
    p.length >= 3 && (distanciaEdicao(termo, p, max) <= max || (p.length > termo.length && distanciaEdicao(termo, p.slice(0, termo.length), max) <= max)))
}

/**
 * Só para quando `buscar` não achou nada: aceita erros de digitação ("fransisco" → "Francisco", "ressureição").
 * Cada termo precisa ser exato (substring) ou parecido com alguma palavra do item; o título ainda pesa mais.
 */
export function buscarAproximado(indice, consulta, tipo = null) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (!termos.length || !termos.some((t) => toleranciaDe(t) > 0)) return []
  const pontuados = []
  for (const it of indice) {
    if (tipo && it.tipo !== tipo) continue
    const f = formas(it)
    if (!f.palavras) f.palavras = [...new Set(f.texto.split(/[^a-z0-9]+/).filter((p) => p.length >= 3))]
    const palavrasTitulo = f.titulo ? f.titulo.split(/[^a-z0-9]+/) : []
    let pontos = 0
    let ok = true
    for (const t of termos) {
      if (f.texto.includes(t)) pontos += f.titulo.includes(t) ? 2 : 1
      else if (termoCasa(t, palavrasTitulo)) pontos += 2
      else if (termoCasa(t, f.palavras)) pontos += 1
      else { ok = false; break }
    }
    if (ok) pontuados.push({ it, pontos })
  }
  return pontuados
    .sort((a, b) => b.pontos - a.pontos || (b.it.destaque || 0) - (a.it.destaque || 0) || a.it.titulo.localeCompare(b.it.titulo, 'pt-BR'))
    .map((p) => p.it)
}

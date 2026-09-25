/**
 * Grafo de relações entre entidades — lógica pura (sem imports de JSON).
 *
 * Usado pela aplicação (lib/relacoes.js) e pelo validador (scripts/validate-relacoes.mjs).
 *
 * Fontes (cada relação é cadastrada em UM lugar só):
 * - data/relacoes.json  → relações editoriais (curadas), arestas não direcionadas.
 * - santoRelacionado    → oração/novena ↔ santo, derivadas automaticamente.
 * - santos.relacionamentos (legado) → santo↔santo, exibidas por RelacionamentosSanto;
 *   não entram aqui, mas o validador impede duplicá-las em relacoes.json.
 *
 * Refs usam o mesmo formato de id do Álbum Sagrado: "tipo:slug".
 */
import { TIPOS_RELACIONAMENTO } from './relacionamentosUtils.js'

export const TIPOS_REF = ['santo', 'aparicao', 'igreja', 'cristo', 'oracao', 'novena']

// Ordem dos grupos na seção "Conexões".
export const GRUPOS = [
  { tipo: 'santo', titulo: 'Santos' },
  { tipo: 'aparicao', titulo: 'Aparições' },
  { tipo: 'igreja', titulo: 'Igrejas' },
  { tipo: 'cristo', titulo: 'Vida de Cristo' },
  { tipo: 'oracao', titulo: 'Orações' },
  { tipo: 'novena', titulo: 'Novenas' },
]

export function parseRef(ref) {
  const i = typeof ref === 'string' ? ref.indexOf(':') : -1
  if (i < 1) return null
  return { tipo: ref.slice(0, i), slug: ref.slice(i + 1) }
}

const chaveAresta = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`)

/** Ano de uma data livre de santos.json ("1515", "~288", "~1 a.C."); null se não houver. */
function ano(texto) {
  const m = String(texto || '').match(/\d+/)
  if (!m) return null
  return /a\.\s?C/i.test(texto) ? -Number(m[0]) : Number(m[0])
}

/** Vidas se sobrepõem? Sem as quatro datas, não dá para afirmar o contrário (true). */
function viveramJuntos(s1, s2) {
  const [n1, f1, n2, f2] = [s1.dataNascimento, s1.dataFalecimento, s2.dataNascimento, s2.dataFalecimento].map(ano)
  if ([n1, f1, n2, f2].some((x) => x === null)) return true
  return n1 <= f2 && n2 <= f1
}

/** Resumo exibível de cada entidade, indexado por ref. */
export function indexarEntidades({ santos, aparicoes, igrejas, vidaCristo, oracoes, novenas }) {
  const idx = new Map()
  const add = (tipo, slug, nome, imagem, href) => idx.set(`${tipo}:${slug}`, { tipo, slug, nome, imagem: imagem || null, href })
  santos.forEach((s) => add('santo', s.slug, s.nome, s.imagem, `/santos/${s.slug}`))
  aparicoes.forEach((a) => add('aparicao', a.slug, a.nome, a.imagem, `/aparicoes/${a.slug}`))
  igrejas.forEach((g) => add('igreja', g.slug, g.nome, g.imagem, `/igrejas/${g.slug}`))
  vidaCristo.forEach((e) => add('cristo', e.slug, e.title, e.imageUrl, `/vida-de-cristo?evento=${encodeURIComponent(e.slug)}`))
  oracoes.forEach((o) => add('oracao', o.slug, o.nome, o.imagem, `/oracoes/${o.slug}`))
  novenas.forEach((n) => add('novena', n.slug, n.nome, n.imagem, `/novenas/${n.slug}`))
  return idx
}

/** Arestas derivadas de santoRelacionado (só quando o santo existe). */
export function arestasDerivadas({ santos, oracoes, novenas }) {
  const slugs = new Set(santos.map((s) => s.slug))
  const arestas = []
  oracoes.forEach((o) => {
    if (o.santoRelacionado && slugs.has(o.santoRelacionado)) {
      arestas.push({ a: `santo:${o.santoRelacionado}`, b: `oracao:${o.slug}`, rotulo: 'Oração', origem: 'derivada' })
    }
  })
  novenas.forEach((n) => {
    if (n.santoRelacionado && slugs.has(n.santoRelacionado)) {
      arestas.push({ a: `santo:${n.santoRelacionado}`, b: `novena:${n.slug}`, rotulo: 'Novena', origem: 'derivada' })
    }
  })
  return arestas
}

/**
 * Monta o grafo: Map ref → [{ ref, rotulo, origem }] (curadas antes das derivadas,
 * cada uma na ordem do JSON). Também devolve erros/avisos de validação.
 */
export function construirGrafo(dados) {
  const entidades = indexarEntidades(dados)
  const erros = []
  const avisos = []
  const vistas = new Map() // chave da aresta → descrição de onde apareceu
  const adj = new Map()

  const ligar = (de, para, rotulo, origem) => {
    if (!adj.has(de)) adj.set(de, [])
    adj.get(de).push({ ref: para, rotulo: rotulo || '', origem })
  }

  const curadas = (dados.relacoes?.relacoes || []).map((r, i) => ({ ...r, origem: 'curada', pos: `relacoes[${i}]` }))
  const derivadas = arestasDerivadas(dados).map((r) => ({ ...r, pos: `santoRelacionado de ${r.b}` }))

  // santo↔santo já cadastrado em santos.json (legado). Cada par fica em UM santo só:
  // RelacionamentosSanto mostra a relação inversa na página do outro automaticamente.
  const santoSanto = new Map() // chave do par → onde foi cadastrado
  const santoPorSlug = new Map(dados.santos.map((s) => [s.slug, s]))
  dados.santos.forEach((s) =>
    (s.relacionamentos || []).forEach((r) => {
      const pos = `santos.json: ${s.slug} → ${r.santoSlug}`
      const alvo = `santo:${r.santoSlug}`
      if (!entidades.has(alvo)) erros.push(`${pos}: santo inexistente "${r.santoSlug}"`)
      if (r.santoSlug === s.slug) erros.push(`${pos}: relação do santo com ele mesmo`)
      if (!TIPOS_RELACIONAMENTO[r.tipo]) {
        erros.push(`${pos}: tipo "${r.tipo}" desconhecido (use ${Object.keys(TIPOS_RELACIONAMENTO).join(', ')})`)
      }
      if (r.tipo === 'contemporaneo' && santoPorSlug.has(r.santoSlug) && !viveramJuntos(s, santoPorSlug.get(r.santoSlug))) {
        erros.push(`${pos}: marcados como contemporâneos, mas as datas de vida não se sobrepõem`)
      }
      const k = chaveAresta(`santo:${s.slug}`, alvo)
      if (santoSanto.has(k)) {
        erros.push(`${pos}: par já cadastrado em ${santoSanto.get(k)} — mantenha em um santo só (a página do outro mostra a relação inversa)`)
      } else {
        santoSanto.set(k, pos)
      }
    })
  )

  // santoRelacionado que não aponta para um santo cadastrado: aviso (pode ser santo futuro).
  const slugsSantos = new Set(dados.santos.map((s) => s.slug))
  ;[...dados.oracoes.map((o) => ['oracao', o]), ...dados.novenas.map((n) => ['novena', n])].forEach(([tipo, x]) => {
    if (x.santoRelacionado && !slugsSantos.has(x.santoRelacionado)) {
      avisos.push(`${tipo}:${x.slug}: santoRelacionado "${x.santoRelacionado}" não está em santos.json (sem conexão até o santo ser cadastrado)`)
    }
  })

  ;[...curadas, ...derivadas].forEach((r) => {
    const pa = parseRef(r.a)
    const pb = parseRef(r.b)
    for (const [ref, p] of [[r.a, pa], [r.b, pb]]) {
      if (!p || !TIPOS_REF.includes(p.tipo)) erros.push(`${r.pos}: ref inválida "${ref}" (use tipo:slug com tipo em ${TIPOS_REF.join(', ')})`)
      else if (!entidades.has(ref)) erros.push(`${r.pos}: "${ref}" não existe`)
    }
    if (r.a === r.b) erros.push(`${r.pos}: relação de "${r.a}" com ela mesma`)
    if (r.origem === 'curada' && !r.rotulo) avisos.push(`${r.pos}: sem rótulo`)

    const k = chaveAresta(r.a, r.b)
    if (vistas.has(k)) {
      erros.push(
        r.origem === 'derivada'
          ? `${vistas.get(k)}: "${r.a}" ↔ "${r.b}" já vem de santoRelacionado (${r.b}) — remova de relacoes.json`
          : `${r.pos}: "${r.a}" ↔ "${r.b}" duplicada (já em ${vistas.get(k)})`
      )
      return
    }
    if (r.origem === 'curada' && santoSanto.has(k)) {
      erros.push(`${r.pos}: "${r.a}" ↔ "${r.b}" já existe em santos.json (relacionamentos) — cadastre santo↔santo só lá`)
      return
    }
    vistas.set(k, r.pos)
    if (entidades.has(r.a) && entidades.has(r.b) && r.a !== r.b) {
      ligar(r.a, r.b, r.rotulo, r.origem)
      ligar(r.b, r.a, r.rotulo, r.origem)
    }
  })

  return { entidades, adj, erros, avisos, totalArestas: vistas.size }
}

/** Conexões de uma entidade, agrupadas por tipo (ordem de GRUPOS), prontas para getStaticProps. */
export function relacionadasDe(grafo, ref, { excluirTipos = [] } = {}) {
  const vizinhos = grafo.adj.get(ref) || []
  return GRUPOS.filter((g) => !excluirTipos.includes(g.tipo))
    .map((g) => ({
      tipo: g.tipo,
      titulo: g.titulo,
      itens: vizinhos
        .filter((v) => parseRef(v.ref).tipo === g.tipo)
        .map((v) => ({ ...grafo.entidades.get(v.ref), rotulo: v.rotulo })),
    }))
    .filter((g) => g.itens.length > 0)
}

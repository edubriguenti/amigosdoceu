/**
 * Catálogo do Álbum Sagrado — lógica pura (sem imports de JSON).
 *
 * Usado tanto pela aplicação (via lib/albumData.js) quanto pelo validador
 * (scripts/validate-album.mjs), para que ambos sigam exatamente as mesmas regras.
 *
 * Decisões do modelo (Volume I):
 * - Entidade ≠ figurinha. Cada entidade (santo, aparição, igreja, evento de Cristo)
 *   gera exatamente UMA figurinha, cujo id é "tipo:slug".
 * - O id é a única chave de persistência. O `numero` é apenas apresentação e pode mudar.
 * - A ordem do array `paginas` em data/album/album.json é a ordem do álbum.
 */

export const TIPOS = ['santo', 'aparicao', 'igreja', 'cristo']

export const RARIDADES = ['comum', 'incomum', 'rara', 'muito-rara', 'especial', 'lendaria']

export const RARIDADE_PADRAO = {
  santo: 'comum',
  aparicao: 'rara',
  igreja: 'comum',
  cristo: 'comum',
}

export const TIPO_LABEL = {
  santo: 'Santo',
  aparicao: 'Aparição',
  igreja: 'Lugar sagrado',
  cristo: 'Vida de Cristo',
}

/**
 * IDs do álbum antigo (data/album-sagrado.json, removido) → id novo.
 * Alguns santos ainda não existem em santos.json; o progresso fica guardado
 * até que sejam adicionados com exatamente este slug.
 */
export const LEGACY_MAP = {
  1: 'santo:sao-francisco-de-assis',
  2: 'santo:santa-teresinha-do-menino-jesus',
  3: 'santo:sao-padre-pio',
  4: 'santo:santa-faustina-kowalska',
  5: 'santo:sao-joao-paulo-ii',
  6: 'santo:santa-rita-de-cassia',
  7: 'santo:santo-antonio-de-padua',
  8: 'santo:sao-bento-de-nursia',
  9: 'santo:santa-clara-de-assis',
  10: 'santo:sao-tomas-de-aquino',
  11: 'santo:santa-teresa-de-avila',
  12: 'santo:sao-maximiliano-kolbe',
}

const MESES = [
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

/** FNV-1a 32 bits — hash estável e barato para escolhas determinísticas. */
export function hash32(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b]
  return a
}

export function formatarNumero(numero) {
  return `#${String(numero).padStart(3, '0')}`
}

/** Rotação leve (±1.5°) e estável por id, para a figurinha parecer "colada à mão". */
export function rotacaoPorId(id) {
  return ((hash32(id) % 31) - 15) / 10
}

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj)
    Object.values(obj).forEach(deepFreeze)
  }
  return obj
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function festasPorSanto(calendario) {
  const festas = {}
  MESES.forEach((mes, idx) => {
    const dias = calendario?.[mes] || {}
    Object.keys(dias)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((dia) => {
        ;(dias[dia].santos || []).forEach((slug) => {
          ;(festas[slug] = festas[slug] || []).push(`${pad2(dia)}/${pad2(idx + 1)}`)
        })
      })
  })
  return festas
}

function extrairAno(texto) {
  const m = String(texto || '').match(/\d{3,4}/)
  return m ? m[0] : null
}

function intervalo(nasc, falec) {
  if (nasc && falec) return `${nasc}–${falec}`
  if (falec) return `† ${falec}`
  if (nasc) return `n. ${nasc}`
  return null
}

function juntar(...partes) {
  const validas = partes.filter(Boolean)
  return validas.length ? validas.join(', ') : null
}

/* ---------- Normalizadores por tipo: entidade → dados da figurinha ---------- */

function normalizarSanto(s, { festas }) {
  const datas = intervalo(s.dataNascimento, s.dataFalecimento)
  const festa = festas[s.slug]
  let destaque = null
  if (festa && festa.length) {
    destaque = { icone: '✨', rotulo: 'Festa', texto: festa.slice(0, 2).join(' e ') }
  } else if (s.padroeiro && s.padroeiro.length) {
    destaque = { icone: '🙏', rotulo: 'Padroeiro de', texto: s.padroeiro.slice(0, 3).join(', ') }
  }
  return {
    nome: s.nome,
    imagem: s.imagem || null,
    subtitulo: juntar(s.pais, datas),
    link: `/santos/${s.slug}`,
    verso: {
      datas,
      local: s.pais || null,
      destaque,
      resumo: s.descricao || null,
      oracao: s.oracao || null,
      escritura: null,
    },
  }
}

function normalizarAparicao(a) {
  const tags = a.tags || []
  const pais = tags[0] || String(a.local || '').split(',').pop().trim() || null
  const marca = tags.length > 2 ? tags[tags.length - 1] : null
  return {
    nome: a.nome,
    imagem: a.imagem || null,
    subtitulo: juntar(pais, extrairAno(a.data)),
    link: `/aparicoes/${a.slug}`,
    verso: {
      datas: a.data || null,
      local: a.local || null,
      destaque: marca ? { icone: '🌹', rotulo: 'Sinal', texto: marca } : null,
      resumo: a.historia || null,
      oracao: a.oracao || null,
      escritura: null,
    },
  }
}

function normalizarIgreja(i) {
  const local = i.cidade && i.pais && i.cidade !== i.pais ? `${i.cidade}, ${i.pais}` : i.cidade || i.pais || i.local || null
  return {
    nome: i.nome,
    imagem: i.imagem || null,
    subtitulo: juntar(i.cidade || i.pais, extrairAno(i.ano)),
    link: `/igrejas/${i.slug}`,
    verso: {
      datas: i.ano || null,
      local,
      destaque: i.estiloArquitetonico ? { icone: '🏛️', rotulo: 'Estilo', texto: i.estiloArquitetonico } : null,
      resumo: i.descricao || null,
      oracao: null,
      escritura: null,
    },
  }
}

function normalizarCristo(e) {
  const obra = e.obra ? (e.artist ? `${e.obra} — ${e.artist}` : e.obra) : null
  return {
    nome: e.title,
    imagem: e.imageUrl || null,
    subtitulo: e.scripture || null,
    link: `/vida-de-cristo?${new URLSearchParams({ evento: e.slug })}`,
    verso: {
      datas: null,
      local: null,
      destaque: obra ? { icone: '🎨', rotulo: 'Obra', texto: obra } : null,
      resumo: e.description || null,
      oracao: null,
      escritura: e.scripture || null,
    },
  }
}

const NORMALIZADORES = {
  santo: normalizarSanto,
  aparicao: normalizarAparicao,
  igreja: normalizarIgreja,
  cristo: normalizarCristo,
}

/* ---------- Construção do catálogo ---------- */

/**
 * @param {object} fontes - { album, santos, aparicoes, igrejas, vidaCristo, calendario }
 * @returns {{ volume, paginas, figurinhas, byId: Map, paginasBySlug: Map, erros: string[], avisos: string[], festas }}
 */
export function construirCatalogo({ album, santos, aparicoes, igrejas, vidaCristo, calendario }) {
  const erros = []
  const avisos = []
  const festas = festasPorSanto(calendario)

  // 1. Índice de entidades por id "tipo:slug", na ordem dos JSONs de origem.
  const fontesPorTipo = { santo: santos, aparicao: aparicoes, igreja: igrejas, cristo: vidaCristo }
  const entidades = new Map()
  TIPOS.forEach((tipo) => {
    ;(fontesPorTipo[tipo] || []).forEach((ent) => {
      if (!ent || !ent.slug) {
        erros.push(`❌ entidade sem slug em ${tipo}: ${ent?.nome || ent?.title || '(sem nome)'}`)
        return
      }
      const id = `${tipo}:${ent.slug}`
      if (entidades.has(id)) {
        erros.push(`❌ id duplicado: ${id}`)
        return
      }
      entidades.set(id, { tipo, ent })
    })
  })

  const paginasFonte = album?.paginas || []

  // Slugs de página únicos
  const slugsPagina = new Set()
  paginasFonte.forEach((p) => {
    if (slugsPagina.has(p.slug)) erros.push(`❌ slug de página duplicado: ${p.slug}`)
    slugsPagina.add(p.slug)
    if (p.auto && !TIPOS.includes(p.auto.tipo)) {
      erros.push(`❌ página ${p.slug}: auto.tipo inválido "${p.auto.tipo}"`)
    }
  })

  // 2. Passada 1 — refs explícitos ficam reservados para a sua página.
  const paginaDe = new Map() // id → slug da página
  const idsPorPagina = new Map(paginasFonte.map((p) => [p.slug, []]))
  paginasFonte.forEach((p) => {
    ;(p.figurinhas || []).forEach((ref) => {
      if (!entidades.has(ref)) {
        erros.push(`❌ ref inexistente: ${ref} (página ${p.slug})`)
        return
      }
      if (paginaDe.has(ref)) {
        erros.push(`❌ ${ref} declarada em duas páginas: ${paginaDe.get(ref)} e ${p.slug}`)
        return
      }
      paginaDe.set(ref, p.slug)
      idsPorPagina.get(p.slug).push(ref)
    })
  })

  // 3. Passada 2 — o restante vai para a primeira página com `auto` compatível.
  entidades.forEach(({ tipo }, id) => {
    if (paginaDe.has(id)) return
    const destino = paginasFonte.find((p) => p.auto && p.auto.tipo === tipo)
    if (destino) {
      paginaDe.set(id, destino.slug)
      idsPorPagina.get(destino.slug).push(id)
    }
  })

  // 4. Passada 3 — entidades sem página.
  entidades.forEach((_, id) => {
    if (!paginaDe.has(id)) erros.push(`❌ ${id} não pertence a nenhuma página`)
  })

  // Raridades
  const overrides = album?.raridades || {}
  Object.entries(overrides).forEach(([ref, rar]) => {
    if (!entidades.has(ref)) erros.push(`❌ raridade definida para ref inexistente: ${ref}`)
    if (!RARIDADES.includes(rar)) erros.push(`❌ ${ref}: raridade inválida "${rar}"`)
  })

  // 5. Catálogo final: numeração sequencial pela ordem das páginas.
  const figurinhas = []
  const byId = new Map()
  const paginas = []
  let numero = 0

  paginasFonte.forEach((p) => {
    const ids = idsPorPagina.get(p.slug) || []
    if (!ids.length) avisos.push(`⚠ página ${p.slug} está vazia`)
    paginas.push({
      slug: p.slug,
      titulo: p.titulo,
      icone: p.icone,
      descricao: p.descricao,
      figurinhaIds: ids,
    })
    ids.forEach((id) => {
      const { tipo, ent } = entidades.get(id)
      numero += 1
      const dados = NORMALIZADORES[tipo](ent, { festas })
      const raridadeOverride = overrides[id]
      const fig = {
        id,
        tipo,
        slug: ent.slug,
        numero,
        raridade: RARIDADES.includes(raridadeOverride) ? raridadeOverride : RARIDADE_PADRAO[tipo],
        paginaSlug: p.slug,
        ...dados,
      }
      figurinhas.push(fig)
      byId.set(id, fig)
    })
  })

  // Avisos de conteúdo
  figurinhas.forEach((f) => {
    if (!f.imagem) avisos.push(`⚠ ${f.id} sem imagem`)
    if (f.tipo === 'santo') {
      if (!f.verso.oracao) avisos.push(`⚠ ${f.id} sem oração`)
      const fs = festas[f.slug]
      if (!fs) avisos.push(`⚠ ${f.id}: festa não encontrada no calendário`)
      else if (fs.length > 1) avisos.push(`⚠ ${f.id}: ${fs.length} festas no calendário (${fs.join(', ')})`)
      if (!f.verso.destaque) avisos.push(`⚠ ${f.id}: verso sem destaque (sem festa e sem padroeiros)`)
    }
  })

  const paginasBySlug = new Map(paginas.map((p) => [p.slug, p]))

  return {
    volume: deepFreeze({ ...(album?.volume || {}) }),
    paginas: deepFreeze(paginas),
    figurinhas: deepFreeze(figurinhas),
    byId,
    paginasBySlug,
    erros,
    avisos,
    festas,
  }
}

/** Inteiro estável que representa a data LOCAL (não muda com o fuso ao longo do dia). */
export function numeroDoDia(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
}

/**
 * Figurinha do dia.
 * 1. Se algum santo do dia (slugs do calendário) tiver figurinha, usa o primeiro.
 * 2. Senão, sequência aritmética modular com passo coprimo com N:
 *    percorre todas as N figurinhas antes de repetir. Colisão com o passo 1 é aceita.
 *    Se N mudar (conteúdo novo), a sequência é recalculada — aceitável.
 */
export function escolherFigurinhaDoDia(catalogo, date, slugsSantosDoDia = []) {
  for (const slug of slugsSantosDoDia) {
    const fig = catalogo.byId.get(`santo:${slug}`)
    if (fig) return fig
  }
  const lista = catalogo.figurinhas
  const N = lista.length
  if (!N) return null
  const offset = hash32('album-v1-offset') % N
  let passo = hash32('album-v1-passo') % N || 1
  while (gcd(passo, N) !== 1) passo = (passo % N) + 1
  const indice = (offset + numeroDoDia(date) * passo) % N
  return lista[indice]
}

/** Busca global: lógica pura (sem React nem JSON), usada por pages/busca.js e testável em Node. */

export function normalizar(texto) {
  if (!texto) return ''
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export const TIPOS_BUSCA = {
  santo: { rotulo: 'Santos', icone: '✨' },
  oracao: { rotulo: 'Orações', icone: '🙏' },
  novena: { rotulo: 'Novenas', icone: '🕯️' },
  aparicao: { rotulo: 'Aparições', icone: '🌹' },
  igreja: { rotulo: 'Igrejas', icone: '⛪' },
  cristo: { rotulo: 'Vida de Cristo', icone: '✝️' },
  conexao: { rotulo: 'Conexões da Bíblia', icone: '📜' },
}

/**
 * Monta o índice a partir dos JSONs. `texto` guarda só campos curtos (sem o texto integral das
 * orações) para o índice enviado ao navegador continuar pequeno.
 */
export function montarIndice({ santos, oracoes, novenas, aparicoes, igrejas, vidaCristo, conexoes }) {
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
    tituloN: normalizar(titulo),
  })
  return [
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
      [v.scripture, v.obra, v.artist])),
    ...conexoes.map((c) => item('conexao', c.slug, `/conexoes?ref=${c.slug}`, c.tema,
      `${c.antigoTestamento?.referencia} ↔ ${c.novoTestamento?.referencia}`,
      [c.antigoTestamento?.referencia, c.novoTestamento?.referencia])),
  ]
}

/** Todos os termos precisam aparecer. Título pesa mais; começo do título mais ainda. */
export function buscar(indice, consulta, tipo = null) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (!termos.length) return []
  const pontuados = []
  for (const it of indice) {
    if (tipo && it.tipo !== tipo) continue
    if (!termos.every((t) => it.texto.includes(t))) continue
    let pontos = 0
    for (const t of termos) {
      if (it.tituloN.startsWith(t)) pontos += 3
      else if (it.tituloN.includes(t)) pontos += 2
      else pontos += 1
    }
    pontuados.push({ it, pontos })
  }
  return pontuados
    .sort((a, b) => b.pontos - a.pontos || a.it.titulo.localeCompare(b.it.titulo, 'pt-BR'))
    .map((p) => p.it)
}

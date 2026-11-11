/**
 * Peregrinações — lógica pura (sem imports de JSON, sem React).
 *
 * Usada pela aplicação (lib/peregrinacoesData.js), pelo validador
 * (scripts/validate-peregrinacoes.mjs) e pelo grafo de relações.
 *
 * Fontes de cada rota:
 * - data/peregrinacoes/rotas.json            → ficha da rota (editorial)
 * - data/peregrinacoes/<slug>.json           → etapas em ordem (editorial)
 * - data/peregrinacoes/<slug>.medidas.json   → km, relevo e pontas, GERADO por scripts/build-rota.mjs
 * - public/rotas/<slug>/                     → traçado para o mapa e GPX, GERADOS pelo mesmo script
 */

export const DIFICULDADES = {
  facil: 'Fácil',
  moderada: 'Moderada',
  dificil: 'Difícil',
}

/** Tipos de entidade que uma parada pode referenciar (têm página e, quando houver, coordenada). */
export const TIPOS_PARADA = ['igreja', 'aparicao', 'santo']

/**
 * Dificuldade pelo esforço do dia: cada 100 m de subida pesam como 1 km a mais.
 * A etapa pode sobrescrever com o campo `dificuldade`.
 */
export function dificuldadeDe(distanciaKm, subidaM = 0) {
  const esforco = distanciaKm + subidaM / 100
  if (esforco < 22) return 'facil'
  if (esforco < 32) return 'moderada'
  return 'dificil'
}

/** Tempo estimado a pé, em horas (4,5 km/h + 1 h a cada 600 m de subida), arredondado para meia hora. */
export function tempoAPeH(distanciaKm, subidaM = 0) {
  return Math.max(0.5, Math.round((distanciaKm / 4.5 + subidaM / 600) * 2) / 2)
}

/** "5h30" / "6h" */
export function formatarTempo(horas) {
  const h = Math.floor(horas)
  return horas - h >= 0.5 ? `${h}h30` : `${h}h`
}

export const arquivoGpxEtapa = (slug, numero) => `/rotas/${slug}/etapa-${String(numero).padStart(2, '0')}.gpx`
export const arquivoGpxRota = (slug) => `/rotas/${slug}/${slug}.gpx`
export const arquivoTrajeto = (slug) => `/rotas/${slug}/trajeto.json`

/** Link do Google Maps com o percurso a pé entre as pontas da etapa. */
export function hrefGoogleMaps(inicio, fim) {
  return `https://www.google.com/maps/dir/?api=1&origin=${inicio[0]},${inicio[1]}&destination=${fim[0]},${fim[1]}&travelmode=walking`
}

export function parseRef(ref) {
  const i = typeof ref === 'string' ? ref.indexOf(':') : -1
  if (i < 1) return null
  return { tipo: ref.slice(0, i), slug: ref.slice(i + 1) }
}

const ehCoord = (c) => Array.isArray(c) && c.length === 2 && c.every((v) => Number.isFinite(v)) && Math.abs(c[0]) <= 90 && Math.abs(c[1]) <= 180

/**
 * Índice das entidades que as etapas podem citar.
 * Devolve Map ref → { tipo, slug, nome, href, imagem, coord|null }.
 */
export function indexarCitaveis({ santos = [], igrejas = [], aparicoes = [], oracoes = [] }) {
  const idx = new Map()
  const coord = (x) => (Number.isFinite(x.latitude) && Number.isFinite(x.longitude) ? [x.latitude, x.longitude] : null)
  igrejas.forEach((g) => idx.set(`igreja:${g.slug}`, { tipo: 'igreja', slug: g.slug, nome: g.nome, href: `/igrejas/${g.slug}`, imagem: g.imagem || null, coord: coord(g) }))
  aparicoes.forEach((a) => idx.set(`aparicao:${a.slug}`, { tipo: 'aparicao', slug: a.slug, nome: a.nome, href: `/aparicoes/${a.slug}`, imagem: a.imagem || null, coord: coord(a) }))
  santos.forEach((s) => idx.set(`santo:${s.slug}`, { tipo: 'santo', slug: s.slug, nome: s.nome, href: `/santos/${s.slug}`, imagem: s.imagem || null, coord: null }))
  oracoes.forEach((o) => idx.set(`oracao:${o.slug}`, { tipo: 'oracao', slug: o.slug, nome: o.nome, href: `/oracoes/${o.slug}`, imagem: null, coord: null }))
  return idx
}

/**
 * Junta ficha + etapas + medidas numa rota pronta para a página.
 * Paradas com `ref` viram { tipo, slug, nome, href, coord }; as demais ficam { nome, coord, nota }.
 */
export function montarRota(rota, etapas, medidas, citaveis) {
  const medidaPorNumero = new Map((medidas?.etapas || []).map((m) => [m.numero, m]))
  const etapasProntas = etapas.map((e) => {
    const m = medidaPorNumero.get(e.numero) || {}
    const subidaM = m.subidaM ?? null
    const oracao = e.oracaoRef ? citaveis.get(e.oracaoRef) : null
    return {
      numero: e.numero,
      origem: e.origem,
      destino: e.destino,
      descricao: e.descricao || '',
      meditacao: e.meditacao || null,
      oracao: oracao ? { nome: oracao.nome, href: oracao.href } : null,
      distanciaKm: m.distanciaKm ?? null,
      subidaM,
      descidaM: m.descidaM ?? null,
      altMinM: m.altMinM ?? null,
      altMaxM: m.altMaxM ?? null,
      perfil: m.perfil || [],
      inicio: m.inicio || null,
      fim: m.fim || null,
      dificuldade: e.dificuldade || (m.distanciaKm != null ? dificuldadeDe(m.distanciaKm, subidaM || 0) : null),
      tempoH: m.distanciaKm != null ? tempoAPeH(m.distanciaKm, subidaM || 0) : null,
      paradas: (e.paradas || [])
        .map((p) => {
          if (p.ref) {
            const ent = citaveis.get(p.ref)
            return ent ? { tipo: ent.tipo, slug: ent.slug, nome: ent.nome, href: ent.href, coord: ent.coord, nota: p.nota || null } : null
          }
          return { tipo: 'local', nome: p.nome, href: null, coord: p.coord, nota: p.nota || null }
        })
        .filter(Boolean),
    }
  })
  return {
    slug: rota.slug,
    nome: rota.nome,
    subtitulo: rota.subtitulo || '',
    resumo: rota.resumo || '',
    historia: rota.historia || '',
    paises: rota.paises || [],
    inicio: rota.inicio.nome,
    destino: rota.destino,
    fonteOficial: rota.fonteOficial || null,
    distanciaOficial: rota.distanciaOficial || null,
    notaTracado: rota.notaTracado || '',
    notaEtapas: rota.notaEtapas || '',
    imagem: rota.imagem || null,
    distanciaKm: medidas?.distanciaKm ?? null,
    subidaM: medidas?.subidaM ?? null,
    totalEtapas: etapasProntas.length,
    etapas: etapasProntas,
  }
}

/** Ficha curta para listas, mapa geral e Minha Jornada (sem as etapas). */
export function resumirRota(rotaPronta) {
  const { etapas, historia, notaTracado, notaEtapas, ...resumo } = rotaPronta
  return { ...resumo, etapas: etapas.map((e) => ({ numero: e.numero, origem: e.origem, destino: e.destino, distanciaKm: e.distanciaKm })) }
}

/**
 * Arestas derivadas para o grafo de relações: cada entidade citada como parada liga-se à rota.
 * A parada da última etapa recebe o rótulo de destino.
 */
export function arestasDasRotas(rotas) {
  const arestas = []
  rotas.forEach(({ slug, etapas }) => {
    const vistas = new Set()
    etapas.forEach((e, i) => {
      ;(e.paradas || []).forEach((p) => {
        const ref = p.ref
        if (!ref || vistas.has(ref) || !TIPOS_PARADA.includes(parseRef(ref)?.tipo)) return
        vistas.add(ref)
        arestas.push({
          a: ref,
          b: `peregrinacao:${slug}`,
          rotulo: i === etapas.length - 1 ? 'Destino da peregrinação' : `No caminho · etapa ${e.numero}`,
          origem: 'derivada',
        })
      })
    })
  })
  return arestas
}

/**
 * Valida uma rota. `arquivos` = { existe(caminhoRelativoAPublic) → boolean, trajeto: objeto|null }.
 * Devolve { erros, avisos }.
 */
export function validarRota(rota, etapas, medidas, citaveis, arquivos) {
  const erros = []
  const avisos = []
  const p = `${rota.slug}`

  for (const campo of ['slug', 'nome', 'resumo', 'historia', 'destino', 'osmRelacao']) {
    if (!rota[campo]) erros.push(`${p}: campo "${campo}" vazio em rotas.json`)
  }
  if (!rota.inicio?.nome || !ehCoord(rota.inicio?.coord)) erros.push(`${p}: "inicio" precisa de nome e coord [lat, lng]`)
  if (!rota.fonteOficial?.url) avisos.push(`${p}: sem fonte oficial`)
  if (!Array.isArray(etapas) || etapas.length === 0) {
    erros.push(`${p}: nenhuma etapa`)
    return { erros, avisos }
  }

  etapas.forEach((e, i) => {
    const pe = `${p} etapa ${e.numero ?? `#${i + 1}`}`
    if (e.numero !== i + 1) erros.push(`${pe}: numeração fora de ordem (esperado ${i + 1})`)
    if (!e.origem || !e.destino) erros.push(`${pe}: origem/destino vazios`)
    if (!ehCoord(e.fim)) erros.push(`${pe}: "fim" precisa ser [lat, lng]`)
    const anterior = i === 0 ? rota.inicio?.nome : etapas[i - 1].destino
    if (e.origem !== anterior) erros.push(`${pe}: origem "${e.origem}" não continua a etapa anterior ("${anterior}")`)
    if (!e.descricao) erros.push(`${pe}: sem descrição`)
    if (!e.meditacao && !e.oracaoRef) erros.push(`${pe}: precisa de "meditacao" ou "oracaoRef"`)
    if (e.oracaoRef) {
      const r = parseRef(e.oracaoRef)
      if (r?.tipo !== 'oracao' || !citaveis.has(e.oracaoRef)) erros.push(`${pe}: oracaoRef "${e.oracaoRef}" não existe em oracoes.json`)
    }
    if (e.dificuldade && !DIFICULDADES[e.dificuldade]) erros.push(`${pe}: dificuldade "${e.dificuldade}" desconhecida`)
    ;(e.paradas || []).forEach((parada, j) => {
      const pp = `${pe} parada ${j + 1}`
      if (parada.ref) {
        const r = parseRef(parada.ref)
        if (!r || !TIPOS_PARADA.includes(r.tipo)) erros.push(`${pp}: ref "${parada.ref}" inválida (use ${TIPOS_PARADA.join(', ')})`)
        else if (!citaveis.has(parada.ref)) erros.push(`${pp}: "${parada.ref}" não existe`)
      } else {
        if (!parada.nome) erros.push(`${pp}: sem nome`)
        if (!ehCoord(parada.coord)) erros.push(`${pp}: "coord" precisa ser [lat, lng]`)
      }
    })
    if (i === etapas.length - 1 && e.destino !== rota.destino) erros.push(`${pe}: a última etapa deve terminar em "${rota.destino}"`)
  })

  // Arquivos gerados
  if (!medidas) {
    erros.push(`${p}: falta data/peregrinacoes/${rota.slug}.medidas.json — rode "npm run build:rota -- ${rota.slug}"`)
  } else {
    if (medidas.osmRelacao !== rota.osmRelacao) erros.push(`${p}: medidas geradas para outra relação do OSM — rode o build de novo`)
    if ((medidas.etapas || []).length !== etapas.length) {
      erros.push(`${p}: medidas têm ${medidas.etapas?.length} etapas e o roteiro tem ${etapas.length} — rode o build de novo`)
    } else {
      const soma = medidas.etapas.reduce((s, m) => s + m.distanciaKm, 0)
      if (Math.abs(soma - medidas.distanciaKm) > 0.2) erros.push(`${p}: soma das etapas (${soma.toFixed(1)} km) difere do total (${medidas.distanciaKm} km)`)
      medidas.etapas.forEach((m, i) => {
        if (!(m.distanciaKm > 0)) erros.push(`${p} etapa ${m.numero}: distância inválida`)
        if (m.distanciaKm > 45) avisos.push(`${p} etapa ${m.numero}: ${m.distanciaKm} km — longa demais para um dia?`)
        if (m.subidaM == null) avisos.push(`${p} etapa ${m.numero}: sem dados de elevação`)
        if (i > 0 && (m.inicio[0] !== medidas.etapas[i - 1].fim[0] || m.inicio[1] !== medidas.etapas[i - 1].fim[1])) {
          erros.push(`${p} etapa ${m.numero}: não começa onde a anterior termina`)
        }
      })
    }
  }
  if (!arquivos.trajeto) {
    erros.push(`${p}: falta public${arquivoTrajeto(rota.slug)}`)
  } else if ((arquivos.trajeto.etapas || []).length !== etapas.length || arquivos.trajeto.etapas.some((l) => !Array.isArray(l) || l.length < 2)) {
    erros.push(`${p}: public${arquivoTrajeto(rota.slug)} não corresponde às etapas — rode o build de novo`)
  }
  if (!arquivos.existe(arquivoGpxRota(rota.slug))) erros.push(`${p}: falta public${arquivoGpxRota(rota.slug)}`)
  etapas.forEach((e) => {
    if (!arquivos.existe(arquivoGpxEtapa(rota.slug, e.numero))) erros.push(`${p} etapa ${e.numero}: falta public${arquivoGpxEtapa(rota.slug, e.numero)}`)
  })

  return { erros, avisos }
}

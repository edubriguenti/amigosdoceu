#!/usr/bin/env node
/**
 * Gera o traçado de uma rota de peregrinação a partir do OpenStreetMap.
 *
 * Lê   data/peregrinacoes/rotas.json (inicio, osmRelacao) e data/peregrinacoes/<slug>.json
 *      (etapas em ordem, cada uma com `fim: [lat, lng]`).
 * Grava public/rotas/<slug>/trajeto.json      traçado simplificado por etapa (para o mapa)
 *       public/rotas/<slug>/<slug>.gpx        rota inteira (download)
 *       public/rotas/<slug>/etapa-NN.gpx      uma por etapa (download)
 *       data/peregrinacoes/<slug>.medidas.json  km, subida, descida, altitude e perfil por etapa
 *
 * As distâncias são MEDIDAS no traçado — nunca digitadas. A elevação vem do modelo
 * digital de terreno aberto servido pela Open-Meteo (Copernicus DEM, ~90 m).
 *
 * Uso: npm run build:rota -- <slug> [--sem-elevacao] [--osm caminho/para/arquivo.json]
 * Downloads ficam em .cache/rotas/ (fora do git); apague o arquivo para baixar de novo.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { amostrar, comprimentoKm, distanciaKm, simplificar } from '../lib/geo.js'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const slug = args.find((a) => !a.startsWith('--'))
const semElevacao = args.includes('--sem-elevacao')
const osmArg = args.includes('--osm') ? args[args.indexOf('--osm') + 1] : null

const TOLERANCIA_MAPA_M = 15
const TOLERANCIA_GPX_M = 6
const PASSO_ELEVACAO_KM = 0.15
const HISTERESE_SUBIDA_M = 5
const PONTE_MAX_KM = 0.25
const DESVIO_MAX_KM = 0.8
const PERFIL_MAX_PONTOS = 60
const AGENTE = 'build-rota-script/1.0'

const lerJson = (rel) => JSON.parse(fs.readFileSync(path.resolve(raiz, rel), 'utf8'))
const gravar = (rel, conteudo) => {
  const destino = path.resolve(raiz, rel)
  fs.mkdirSync(path.dirname(destino), { recursive: true })
  fs.writeFileSync(destino, conteudo)
}
const falhar = (msg) => {
  console.error(`\n✗ ${msg}\n`)
  process.exit(1)
}
const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

if (!slug) falhar('Informe o slug da rota: npm run build:rota -- <slug>')
const rota = lerJson('data/peregrinacoes/rotas.json').find((r) => r.slug === slug)
if (!rota) falhar(`Rota "${slug}" não está em data/peregrinacoes/rotas.json`)
const etapas = lerJson(`data/peregrinacoes/${slug}.json`)

/* ---------- 1. Geometria bruta do OSM ---------- */

async function baixarOsm() {
  const cache = osmArg ? path.resolve(osmArg) : path.resolve(raiz, `.cache/rotas/${slug}.osm.json`)
  if (fs.existsSync(cache)) return JSON.parse(fs.readFileSync(cache, 'utf8'))
  if (osmArg) falhar(`Arquivo não encontrado: ${cache}`)
  // Desce até dois níveis de sub-relações (super-rotas divididas em trechos).
  const consulta = `[out:json][timeout:250];rel(${rota.osmRelacao})->.a;(.a;rel(r.a);)->.b;(.b;rel(r.b);)->.c;way(r.c);out geom;`
  for (let tentativa = 1; tentativa <= 6; tentativa++) {
    console.log(`  baixando relação ${rota.osmRelacao} do OpenStreetMap (tentativa ${tentativa})…`)
    const resp = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'User-Agent': AGENTE, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(consulta)}`,
    })
    if (resp.ok) {
      const json = await resp.json()
      fs.mkdirSync(path.dirname(cache), { recursive: true })
      fs.writeFileSync(cache, JSON.stringify(json))
      return json
    }
    await pausa(20000 * tentativa)
  }
  return falhar('O servidor do OpenStreetMap (Overpass) não respondeu. Tente de novo mais tarde.')
}

/** Aceita tanto `way … out geom` quanto `relation … out geom` (ways como membros). */
function extrairWays(osm) {
  const ways = []
  for (const e of osm.elements || []) {
    if (e.type === 'way' && e.geometry) ways.push(e.geometry)
    if (e.type === 'relation') {
      for (const m of e.members || []) if (m.type === 'way' && m.geometry) ways.push(m.geometry)
    }
  }
  return ways.map((g) => g.map((p) => [p.lat, p.lon]))
}

/* ---------- 2. Grafo e caminho mínimo ---------- */

function montarGrafo(ways) {
  const indice = new Map()
  const coord = []
  const adj = []
  const wayDoNo = []
  const no = (p, w) => {
    const k = `${p[0].toFixed(6)},${p[1].toFixed(6)}`
    let i = indice.get(k)
    if (i === undefined) {
      i = coord.length
      indice.set(k, i)
      coord.push(p)
      adj.push([])
      wayDoNo.push(w)
    }
    return i
  }
  const ligar = (a, b, d, ponte = false) => {
    if (a === b) return
    adj[a].push({ para: b, d, ponte })
    adj[b].push({ para: a, d, ponte })
  }
  ways.forEach((g, w) => {
    for (let i = 1; i < g.length; i++) {
      const a = no(g[i - 1], w)
      const b = no(g[i], w)
      ligar(a, b, distanciaKm(g[i - 1][0], g[i - 1][1], g[i][0], g[i][1]))
    }
  })

  // Pontes: pontas soltas a menos de PONTE_MAX_KM de outro trecho (ways que não
  // compartilham nó no OSM). Custam 1,5× para o caminho preferir trechos reais.
  const CELULA = 0.003
  const grade = new Map()
  const chave = (lat, lng) => `${Math.floor(lat / CELULA)}:${Math.floor(lng / CELULA)}`
  coord.forEach((p, i) => {
    const k = chave(p[0], p[1])
    if (!grade.has(k)) grade.set(k, [])
    grade.get(k).push(i)
  })
  let pontes = 0
  coord.forEach((p, i) => {
    if (adj[i].length !== 1) return
    let melhor = -1
    let menor = PONTE_MAX_KM
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const candidatos = grade.get(`${Math.floor(p[0] / CELULA) + dy}:${Math.floor(p[1] / CELULA) + dx}`) || []
        for (const j of candidatos) {
          if (j === i || wayDoNo[j] === wayDoNo[i]) continue
          const d = distanciaKm(p[0], p[1], coord[j][0], coord[j][1])
          if (d < menor) {
            menor = d
            melhor = j
          }
        }
      }
    }
    if (melhor !== -1) {
      ligar(i, melhor, menor * 1.5, true)
      pontes++
    }
  })
  return { coord, adj, pontes }
}

function noMaisProximo(grafo, ponto) {
  let melhor = -1
  let menor = Infinity
  grafo.coord.forEach((p, i) => {
    const d = distanciaKm(ponto[0], ponto[1], p[0], p[1])
    if (d < menor) {
      menor = d
      melhor = i
    }
  })
  return { no: melhor, km: menor }
}

/** Dijkstra com heap binário. Devolve os índices dos nós de `origem` a `destino` (ou null). */
function caminho(grafo, origem, destino) {
  const n = grafo.coord.length
  const dist = new Float64Array(n).fill(Infinity)
  const anterior = new Int32Array(n).fill(-1)
  const heap = [[0, origem]]
  dist[origem] = 0
  const sobe = (i) => {
    while (i > 0) {
      const pai = (i - 1) >> 1
      if (heap[pai][0] <= heap[i][0]) break
      ;[heap[pai], heap[i]] = [heap[i], heap[pai]]
      i = pai
    }
  }
  const desce = (i) => {
    for (;;) {
      const e = 2 * i + 1
      const d = e + 1
      let m = i
      if (e < heap.length && heap[e][0] < heap[m][0]) m = e
      if (d < heap.length && heap[d][0] < heap[m][0]) m = d
      if (m === i) break
      ;[heap[m], heap[i]] = [heap[i], heap[m]]
      i = m
    }
  }
  while (heap.length) {
    const [d, u] = heap[0]
    const ultimo = heap.pop()
    if (heap.length) {
      heap[0] = ultimo
      desce(0)
    }
    if (d > dist[u]) continue
    if (u === destino) break
    for (const { para, d: w } of grafo.adj[u]) {
      const nd = d + w
      if (nd < dist[para]) {
        dist[para] = nd
        anterior[para] = u
        heap.push([nd, para])
        sobe(heap.length - 1)
      }
    }
  }
  if (dist[destino] === Infinity) return null
  const nos = []
  for (let u = destino; u !== -1; u = anterior[u]) nos.push(u)
  return nos.reverse()
}

/* ---------- 3. Elevação ---------- */

async function elevacoes(pontos) {
  const arquivo = path.resolve(raiz, `.cache/rotas/${slug}.ele.json`)
  const cache = fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, 'utf8')) : {}
  const chave = (p) => `${p[0].toFixed(5)},${p[1].toFixed(5)}`
  const faltam = [...new Set(pontos.map(chave))].filter((k) => cache[k] === undefined)
  for (let i = 0; i < faltam.length; i += 100) {
    const lote = faltam.slice(i, i + 100)
    const lats = lote.map((k) => k.split(',')[0]).join(',')
    const lngs = lote.map((k) => k.split(',')[1]).join(',')
    let ok = false
    for (let tentativa = 1; tentativa <= 5 && !ok; tentativa++) {
      const resp = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`, {
        headers: { 'User-Agent': AGENTE },
      })
      if (resp.ok) {
        const { elevation } = await resp.json()
        lote.forEach((k, j) => (cache[k] = elevation[j]))
        ok = true
      } else {
        await pausa(4000 * tentativa)
      }
    }
    if (!ok) falhar('O serviço de elevação não respondeu. Rode de novo (o que já baixou fica em cache) ou use --sem-elevacao.')
    fs.mkdirSync(path.dirname(arquivo), { recursive: true })
    fs.writeFileSync(arquivo, JSON.stringify(cache))
    process.stdout.write(`\r  elevação: ${Math.min(i + 100, faltam.length)}/${faltam.length} pontos`)
    await pausa(350)
  }
  if (faltam.length) process.stdout.write('\n')
  return pontos.map((p) => cache[chave(p)])
}

/** Subida/descida acumuladas com suavização (média móvel de 3) e histerese contra ruído do terreno. */
function relevo(alturas) {
  const suave = alturas.map((_, i) => {
    const janela = alturas.slice(Math.max(0, i - 1), i + 2)
    return janela.reduce((s, v) => s + v, 0) / janela.length
  })
  let subida = 0
  let descida = 0
  let ref = suave[0]
  for (const h of suave) {
    if (h - ref >= HISTERESE_SUBIDA_M) {
      subida += h - ref
      ref = h
    } else if (ref - h >= HISTERESE_SUBIDA_M) {
      descida += ref - h
      ref = h
    }
  }
  const passo = Math.max(1, Math.ceil(suave.length / PERFIL_MAX_PONTOS))
  const perfil = suave.filter((_, i) => i % passo === 0 || i === suave.length - 1).map((v) => Math.round(v))
  return {
    subidaM: Math.round(subida),
    descidaM: Math.round(descida),
    altMinM: Math.round(Math.min(...suave)),
    altMaxM: Math.round(Math.max(...suave)),
    perfil,
  }
}

/* ---------- 4. GPX ---------- */

const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function gpx(nome, trechos) {
  const segs = trechos
    .map(
      (t) =>
        `    <trkseg>\n${t.map(([lat, lng]) => `      <trkpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}"/>`).join('\n')}\n    </trkseg>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Amigos do Céu" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapar(nome)}</name>
    <copyright author="OpenStreetMap contributors"><license>https://opendatacommons.org/licenses/odbl/</license></copyright>
    <link href="https://amigosdoceu.vercel.app/peregrinacoes/${slug}"><text>Amigos do Céu</text></link>
  </metadata>
  <trk>
    <name>${escapar(nome)}</name>
${segs}
  </trk>
</gpx>
`
}

/* ---------- Execução ---------- */

console.log(`\nRota: ${rota.nome}`)
const ways = extrairWays(await baixarOsm())
if (!ways.length) falhar('O arquivo do OpenStreetMap não trouxe nenhum trecho com geometria.')
const grafo = montarGrafo(ways)
console.log(`  ${ways.length} trechos, ${grafo.coord.length} pontos, ${grafo.pontes} pontes entre trechos soltos`)

const paradas = [{ nome: rota.inicio.nome, coord: rota.inicio.coord }, ...etapas.map((e) => ({ nome: e.destino, coord: e.fim }))]
const avisos = []
const nos = paradas.map((p) => {
  if (!Array.isArray(p.coord) || p.coord.length !== 2) falhar(`"${p.nome}" está sem coordenada [lat, lng].`)
  const { no, km } = noMaisProximo(grafo, p.coord)
  if (km > DESVIO_MAX_KM) avisos.push(`"${p.nome}" fica a ${km.toFixed(2)} km do traçado — confira a coordenada.`)
  return no
})

const linhas = []
etapas.forEach((e, i) => {
  const trilha = caminho(grafo, nos[i], nos[i + 1])
  if (!trilha) falhar(`Etapa ${e.numero} (${e.origem} → ${e.destino}): não há ligação no traçado do OpenStreetMap.`)
  linhas.push(trilha.map((n) => grafo.coord[n]))
})

const medidas = []
for (let i = 0; i < etapas.length; i++) {
  const linha = linhas[i]
  const km = comprimentoKm(linha)
  const m = {
    numero: etapas[i].numero,
    distanciaKm: Math.round(km * 10) / 10,
    inicio: linha[0].map((v) => +v.toFixed(5)),
    fim: linha[linha.length - 1].map((v) => +v.toFixed(5)),
  }
  if (!semElevacao) Object.assign(m, relevo(await elevacoes(amostrar(linha, PASSO_ELEVACAO_KM))))
  medidas.push(m)
}

const totalKm = Math.round(medidas.reduce((s, m) => s + m.distanciaKm, 0) * 10) / 10
const arredondar = (linha) => linha.map(([lat, lng]) => [+lat.toFixed(5), +lng.toFixed(5)])
const paraMapa = linhas.map((l) => arredondar(simplificar(l, TOLERANCIA_MAPA_M)))
const paraGpx = linhas.map((l) => simplificar(l, TOLERANCIA_GPX_M))

gravar(`public/rotas/${slug}/trajeto.json`, JSON.stringify({ etapas: paraMapa }))
gravar(`public/rotas/${slug}/${slug}.gpx`, gpx(rota.nome, paraGpx))
etapas.forEach((e, i) => {
  const nn = String(e.numero).padStart(2, '0')
  gravar(`public/rotas/${slug}/etapa-${nn}.gpx`, gpx(`${rota.nome} — Etapa ${e.numero}: ${e.origem} → ${e.destino}`, [paraGpx[i]]))
})
gravar(
  `data/peregrinacoes/${slug}.medidas.json`,
  `${JSON.stringify(
    {
      aviso: 'Arquivo gerado por scripts/build-rota.mjs — não edite à mão.',
      osmRelacao: rota.osmRelacao,
      distanciaKm: totalKm,
      subidaM: semElevacao ? null : medidas.reduce((s, m) => s + m.subidaM, 0),
      descidaM: semElevacao ? null : medidas.reduce((s, m) => s + m.descidaM, 0),
      etapas: medidas,
    },
    (chave, valor) => (chave === 'perfil' || chave === 'inicio' || chave === 'fim' ? JSON.stringify(valor) : valor),
    2
  ).replace(/"(\[[^"]*\])"/g, '$1')}\n`
)

console.log('\n  nº  km     subida  etapa')
medidas.forEach((m, i) =>
  console.log(
    `  ${String(m.numero).padStart(2)}  ${m.distanciaKm.toFixed(1).padStart(5)}  ${String(m.subidaM ?? '—').padStart(5)} m  ${etapas[i].origem} → ${etapas[i].destino}`
  )
)
console.log(`\n  Total: ${totalKm} km em ${etapas.length} etapas`)
console.log(`  Pontos no mapa: ${paraMapa.reduce((s, l) => s + l.length, 0)}`)
if (avisos.length) {
  console.log(`\nAvisos (${avisos.length})`)
  avisos.forEach((a) => console.log(`  ⚠ ${a}`))
}
console.log('\n✓ Traçado gerado.\n')

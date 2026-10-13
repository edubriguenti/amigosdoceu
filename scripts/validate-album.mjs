#!/usr/bin/env node
/**
 * Valida o catálogo do Álbum Sagrado usando exatamente a mesma lógica da aplicação
 * (lib/albumCatalogo.js). Sai com código 1 se houver erros.
 *
 * Uso: npm run validate:album
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { construirCatalogo, LEGACY_MAP, TIPOS, formatarNumero } from '../lib/albumCatalogo.js'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const lerTexto = (rel) => fs.readFileSync(path.join(raiz, rel), 'utf8')
const lerJson = (rel) => JSON.parse(lerTexto(rel))

const fontes = {
  album: lerJson('data/album/album.json'),
  santos: lerJson('data/santos.json'),
  aparicoes: lerJson('data/aparicoes.json'),
  igrejas: lerJson('data/igrejas.json'),
  vidaCristo: lerJson('data/vida-cristo.json'),
  calendario: lerJson('data/calendario-liturgico.json'),
}

const catalogo = construirCatalogo(fontes)
const erros = [...catalogo.erros]
const avisos = [...catalogo.avisos]

// Imagens locais precisam existir em public/
catalogo.figurinhas.forEach((f) => {
  if (f.imagem && f.imagem.startsWith('/') && !fs.existsSync(path.join(raiz, 'public', f.imagem))) {
    avisos.push(`⚠ ${f.id}: imagem local ausente em public${f.imagem}`)
  }
})

// Slugs futuros esperados pela migração do álbum antigo
Object.entries(LEGACY_MAP).forEach(([legado, id]) => {
  if (!catalogo.byId.has(id)) {
    avisos.push(`⚠ ${id}: esperado pela migração (id antigo ${legado}) — ao adicionar este santo, use exatamente este slug`)
  }
})

// Cobertura por tipo: cada entidade em exatamente uma página
const origem = {
  santo: fontes.santos,
  aparicao: fontes.aparicoes,
  igreja: fontes.igrejas,
  cristo: fontes.vidaCristo,
}

console.log('\n📖 Álbum Sagrado — validação\n')
console.log('Cobertura')
TIPOS.forEach((tipo) => {
  const naFonte = origem[tipo].length
  const noAlbum = catalogo.figurinhas.filter((f) => f.tipo === tipo).length
  const ok = naFonte === noAlbum
  console.log(`  ${ok ? '✓' : '✗'} ${tipo.padEnd(9)} ${noAlbum}/${naFonte}`)
})
console.log(`  = ${catalogo.figurinhas.length} figurinhas\n`)

console.log('Páginas')
catalogo.paginas.forEach((p) => {
  const figs = p.figurinhaIds.map((id) => catalogo.byId.get(id))
  const faixa = figs.length ? `${formatarNumero(figs[0].numero)}–${formatarNumero(figs[figs.length - 1].numero)}` : '—'
  console.log(`  ${p.icone} ${p.titulo.padEnd(28)} ${String(figs.length).padStart(3)}  ${faixa}`)
})

const porRaridade = {}
catalogo.figurinhas.forEach((f) => (porRaridade[f.raridade] = (porRaridade[f.raridade] || 0) + 1))
console.log('\nRaridades')
Object.entries(porRaridade).forEach(([r, n]) => console.log(`  ${r.padEnd(11)} ${n}`))

// Cobertura do fluxo diário completo: dias do ano com celebração ligada a um santo
// cadastrado (é o que dá santo do dia e figurinha de santo no painel "Hoje").
const slugsSantos = new Set(fontes.santos.map((s) => s.slug))
let diasCobertos = 0
Object.values(fontes.calendario).forEach((dias) =>
  Object.values(dias).forEach((cel) => {
    if ((cel.santos || []).some((slug) => slugsSantos.has(slug))) diasCobertos++
  })
)
// JSON.parse descarta em silêncio chaves repetidas num mês; detecta olhando o texto bruto.
const brutoCalendario = lerTexto('data/calendario-liturgico.json')
for (const [, mes, corpo] of brutoCalendario.matchAll(/"([a-zç]+)": \{([\s\S]*?)\n  \}/g)) {
  const vistos = new Set()
  for (const [, dia] of corpo.matchAll(/\n    "(\d+)": \{/g)) {
    if (vistos.has(dia)) erros.push(`calendário ${dia}/${mes}: dia repetido (a celebração anterior é descartada)`)
    vistos.add(dia)
  }
}

// Integridade do calendário: toda celebração deve citar santos que existem, e todo santo
// cadastrado deve ter ao menos uma festa (senão nunca aparece como santo do dia).
const slugsNoCalendario = new Set()
Object.entries(fontes.calendario).forEach(([mes, dias]) =>
  Object.entries(dias).forEach(([dia, cel]) =>
    (cel.santos || []).forEach((slug) => {
      slugsNoCalendario.add(slug)
      if (!slugsSantos.has(slug)) erros.push(`calendário ${dia}/${mes}: santo inexistente "${slug}"`)
    })
  )
)
fontes.santos
  .filter((s) => !slugsNoCalendario.has(s.slug))
  .forEach((s) => avisos.push(`santo sem festa no calendário: ${s.slug}`))

console.log(`\nCobertura do fluxo diário: ${diasCobertos}/365 dias com santo do dia cadastrado (${Math.round((diasCobertos / 365) * 100)}%)`)

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length})`)
  avisos.forEach((a) => console.log(`  ${a}`))
}

if (erros.length) {
  console.log(`\nErros (${erros.length})`)
  erros.forEach((e) => console.log(`  ${e}`))
  console.log('')
  process.exit(1)
}

console.log('\n✓ Nenhum erro.\n')

#!/usr/bin/env node
/**
 * Valida as rotas de peregrinação (data/peregrinacoes/ + public/rotas/) com a mesma
 * lógica da aplicação (lib/peregrinacoesRegras.js). Sai com código 1 se houver erros.
 *
 * Uso: npm run validate:peregrinacoes
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { indexarCitaveis, validarRota } from '../lib/peregrinacoesRegras.js'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const caminho = (rel) => path.resolve(raiz, rel)
const lerJson = (rel) => JSON.parse(fs.readFileSync(caminho(rel), 'utf8'))
const lerJsonSeExistir = (rel) => (fs.existsSync(caminho(rel)) ? lerJson(rel) : null)

const rotas = lerJson('data/peregrinacoes/rotas.json')
const citaveis = indexarCitaveis({
  santos: lerJson('data/santos.json'),
  igrejas: lerJson('data/igrejas.json'),
  aparicoes: lerJson('data/aparicoes.json'),
  oracoes: lerJson('data/oracoes.json'),
})

const erros = []
const avisos = []
const slugs = new Set()

console.log('\nPeregrinações')
rotas.forEach((rota) => {
  if (slugs.has(rota.slug)) erros.push(`${rota.slug}: slug duplicado em rotas.json`)
  slugs.add(rota.slug)

  const etapas = lerJsonSeExistir(`data/peregrinacoes/${rota.slug}.json`)
  if (!etapas) {
    erros.push(`${rota.slug}: falta data/peregrinacoes/${rota.slug}.json`)
    return
  }
  const medidas = lerJsonSeExistir(`data/peregrinacoes/${rota.slug}.medidas.json`)
  const r = validarRota(rota, etapas, medidas, citaveis, {
    existe: (rel) => fs.existsSync(caminho(`public${rel}`)),
    trajeto: lerJsonSeExistir(`public/rotas/${rota.slug}/trajeto.json`),
  })
  erros.push(...r.erros)
  avisos.push(...r.avisos)

  const paradas = etapas.reduce((s, e) => s + (e.paradas || []).length, 0)
  console.log(`  ${rota.nome.padEnd(30)} ${String(etapas.length).padStart(2)} etapas  ${String(medidas?.distanciaKm ?? '—').padStart(6)} km  ${paradas} paradas`)
})

// Toda rota precisa estar importada em lib/peregrinacoesData.js (imports estáticos).
const dataJs = fs.readFileSync(caminho('lib/peregrinacoesData.js'), 'utf8')
rotas.forEach((r) => {
  if (!dataJs.includes(`'${r.slug}':`)) erros.push(`${r.slug}: não está em FONTES de lib/peregrinacoesData.js`)
})

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length})`)
  avisos.forEach((a) => console.log(`  ⚠ ${a}`))
}
if (erros.length) {
  console.log(`\nErros (${erros.length})`)
  erros.forEach((e) => console.log(`  ✗ ${e}`))
  console.log('')
  process.exit(1)
}
console.log('\n✓ Nenhum erro.\n')

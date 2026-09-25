#!/usr/bin/env node
/**
 * Valida o grafo de relações (data/relacoes.json + santoRelacionado + santos.relacionamentos)
 * usando a mesma lógica da aplicação (lib/relacoesGrafo.js). Sai com código 1 se houver erros.
 *
 * Uso: npm run validate:relacoes
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { construirGrafo, GRUPOS, parseRef } from '../lib/relacoesGrafo.js'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const lerJson = (rel) => JSON.parse(fs.readFileSync(path.resolve(raiz, rel), 'utf8'))

const grafo = construirGrafo({
  relacoes: lerJson(process.env.RELACOES_JSON || 'data/relacoes.json'),
  santos: lerJson('data/santos.json'),
  aparicoes: lerJson('data/aparicoes.json'),
  igrejas: lerJson('data/igrejas.json'),
  vidaCristo: lerJson('data/vida-cristo.json'),
  oracoes: lerJson('data/oracoes.json'),
  novenas: lerJson('data/novenas.json'),
})

console.log('\nRelações')
console.log(`  ${grafo.totalArestas} arestas (curadas + derivadas de santoRelacionado)`)

const porTipo = {}
grafo.adj.forEach((_, ref) => {
  const t = parseRef(ref).tipo
  porTipo[t] = (porTipo[t] || 0) + 1
})
console.log('\nEntidades com conexões')
GRUPOS.forEach((g) => console.log(`  ${g.titulo.padEnd(15)} ${porTipo[g.tipo] || 0}`))

if (grafo.avisos.length) {
  console.log(`\nAvisos (${grafo.avisos.length})`)
  grafo.avisos.forEach((a) => console.log(`  ⚠ ${a}`))
}

if (grafo.erros.length) {
  console.log(`\nErros (${grafo.erros.length})`)
  grafo.erros.forEach((e) => console.log(`  ✗ ${e}`))
  console.log('')
  process.exit(1)
}

console.log('\n✓ Nenhum erro.\n')

#!/usr/bin/env node
/**
 * Toda imagem local ("/images/...") citada nos JSONs de data/ precisa existir em public/.
 * Imagem ausente deve ser `null` no JSON — a interface mostra um placeholder temático.
 * Sai com código 1 se houver erros.
 *
 * Uso: npm run validate:imagens
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const erros = []
let verificadas = 0

// Percorre qualquer JSON e checa strings que parecem caminhos locais de imagem.
function visitar(valor, onde) {
  if (typeof valor === 'string') {
    if (/^\/images\/.+\.(jpe?g|png|webp|gif|svg|avif)$/i.test(valor)) {
      verificadas++
      if (!fs.existsSync(path.join(raiz, 'public', valor))) erros.push(`${onde}: ${valor} não existe em public/`)
    }
  } else if (Array.isArray(valor)) {
    valor.forEach((v, i) => visitar(v, `${onde}[${i}]`))
  } else if (valor && typeof valor === 'object') {
    const rotulo = valor.slug ? `${onde}(${valor.slug})` : onde
    Object.entries(valor).forEach(([k, v]) => visitar(v, `${rotulo}.${k}`))
  }
}

function arquivosJson(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return arquivosJson(p)
    return e.name.endsWith('.json') ? [p] : []
  })
}

arquivosJson(path.join(raiz, 'data')).forEach((arquivo) => {
  const rel = path.relative(raiz, arquivo)
  visitar(JSON.parse(fs.readFileSync(arquivo, 'utf8')), rel)
})

console.log(`\nImagens locais verificadas: ${verificadas}`)
if (erros.length) {
  console.log(`\nErros (${erros.length})`)
  erros.forEach((e) => console.log(`  ✗ ${e}`))
  console.log('\nUse "imagem": null quando não houver imagem — a interface mostra um placeholder.\n')
  process.exit(1)
}
console.log('✓ Nenhuma imagem ausente.\n')

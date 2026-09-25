/**
 * Grafo de relações montado uma única vez a partir dos JSONs (server-only: use em
 * getStaticProps). Lógica em lib/relacoesGrafo.js, compartilhada com o validador.
 */
import relacoes from '../data/relacoes.json'
import santos from '../data/santos.json'
import aparicoes from '../data/aparicoes.json'
import igrejas from '../data/igrejas.json'
import vidaCristo from '../data/vida-cristo.json'
import oracoes from '../data/oracoes.json'
import novenas from '../data/novenas.json'
import calendario from '../data/calendario-liturgico.json'
import { construirGrafo, relacionadasDe } from './relacoesGrafo'
import { mesesNomes, mesesPt } from './calendarUtils'

const grafo = construirGrafo({ relacoes, santos, aparicoes, igrejas, vidaCristo, oracoes, novenas })

if (grafo.erros.length && process.env.NODE_ENV !== 'production') {
  grafo.erros.forEach((e) => console.warn(`Relações: ${e}`))
}

/**
 * Conexões de uma entidade, agrupadas por tipo. `excluirTipos` evita repetir o que a
 * página já mostra (ex.: santo↔santo, exibido por RelacionamentosSanto).
 */
export function getRelacionadas(tipo, slug, opcoes) {
  return relacionadasDe(grafo, `${tipo}:${slug}`, opcoes)
}

/** Data da festa do santo no calendário litúrgico, ex.: { data: "29 de junho", nome, tipo } (ou null). */
export function getFestaDoSanto(slug) {
  for (let m = 1; m <= 12; m++) {
    const dias = calendario[mesesPt[m]] || {}
    for (const [dia, cel] of Object.entries(dias)) {
      if (cel.santos?.includes(slug)) {
        return { data: `${dia} de ${mesesNomes[m - 1].toLowerCase()}`, nome: cel.nome, tipo: cel.tipo }
      }
    }
  }
  return null
}

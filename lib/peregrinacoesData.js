/**
 * Peregrinações montadas uma única vez a partir dos JSONs (server-only: use em
 * getStaticProps). Lógica em lib/peregrinacoesRegras.js, compartilhada com o validador.
 *
 * Para acrescentar uma rota: ficha em data/peregrinacoes/rotas.json, etapas em
 * data/peregrinacoes/<slug>.json, `npm run build:rota -- <slug>` e os dois imports abaixo.
 */
import rotas from '../data/peregrinacoes/rotas.json'
import caminhoDaFe from '../data/peregrinacoes/caminho-da-fe.json'
import caminhoDaFeMedidas from '../data/peregrinacoes/caminho-da-fe.medidas.json'
import caminhoFrances from '../data/peregrinacoes/caminho-frances-de-santiago.json'
import caminhoFrancesMedidas from '../data/peregrinacoes/caminho-frances-de-santiago.medidas.json'
import santos from '../data/santos.json'
import igrejas from '../data/igrejas.json'
import aparicoes from '../data/aparicoes.json'
import oracoes from '../data/oracoes.json'
import { indexarCitaveis, montarRota, resumirRota } from './peregrinacoesRegras'

const FONTES = {
  'caminho-da-fe': { etapas: caminhoDaFe, medidas: caminhoDaFeMedidas },
  'caminho-frances-de-santiago': { etapas: caminhoFrances, medidas: caminhoFrancesMedidas },
}

const citaveis = indexarCitaveis({ santos, igrejas, aparicoes, oracoes })

const PRONTAS = rotas
  .filter((r) => FONTES[r.slug])
  .map((r) => montarRota(r, FONTES[r.slug].etapas, FONTES[r.slug].medidas, citaveis))

/** Rotas completas, com todas as etapas. */
export function getRotasCompletas() {
  return PRONTAS
}

/** Fichas curtas (sem textos longos), para listas, mapa geral e Minha Jornada. */
export function getRotas() {
  return PRONTAS.map(resumirRota)
}

export function getRota(slug) {
  return PRONTAS.find((r) => r.slug === slug) || null
}

/** Etapas cruas por rota, para o grafo de relações. */
export function getEtapasCruas() {
  return rotas.filter((r) => FONTES[r.slug]).map((r) => ({ slug: r.slug, nome: r.nome, imagem: r.imagem || null, etapas: FONTES[r.slug].etapas }))
}

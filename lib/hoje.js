/**
 * Camada "Hoje" — única fonte das regras do dia (celebração, santos, figurinha, oração).
 *
 * SERVER-ONLY: use apenas em getStaticProps. Importa o calendário, os santos, as orações
 * e o catálogo do álbum; nunca importe este módulo em componentes (incharia o bundle).
 * O cliente recebe a janela de dias pronta e escolhe o dia via hooks/useDiaAtual.js.
 *
 * O "hoje" daqui é `dataBrasil()` (data civil de São Paulo) — ver lib/datas.js.
 */
import oracoes from '../data/oracoes.json'
import { getCelebracaoDoDia, getSantosPorSlugs, getProximasCelebracoes, getCorLiturgica } from './calendarUtils'
import { getFigurinhaDoDia, resumoFigurinha } from './albumData'
import { hash32 } from './albumCatalogo'
import { dataBrasil, dateDeIso, somarDias } from './datas'

const TRECHO_MAX = 180

function trecho(texto = '') {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  if (limpo.length <= TRECHO_MAX) return limpo
  return `${limpo.slice(0, TRECHO_MAX).replace(/\s+\S*$/, '')}…`
}

/**
 * Oração do dia:
 * 1. oração de oracoes.json cujo santoRelacionado é um dos santos do dia;
 * 2. senão, a oração do próprio santo do dia (santos.json);
 * 3. senão, rotação determinística pela data.
 */
export function oracaoDoDia(iso, santos = []) {
  const deOracoes = (o) => ({
    ref: `oracao:${o.slug}`,
    titulo: o.nome,
    texto: o.texto,
    trecho: trecho(o.texto),
    href: `/oracoes/${o.slug}`,
  })
  for (const santo of santos) {
    const o = oracoes.find((x) => x.santoRelacionado === santo.slug)
    if (o) return deOracoes(o)
  }
  const comOracao = santos.find((s) => s.oracao)
  if (comOracao) {
    return {
      ref: `santo:${comOracao.slug}`,
      titulo: `Oração a ${comOracao.nome}`,
      texto: comOracao.oracao,
      trecho: trecho(comOracao.oracao),
      href: `/santos/${comOracao.slug}#oracao`,
    }
  }
  return deOracoes(oracoes[hash32(`oracao-do-dia:${iso}`) % oracoes.length])
}

/** Tudo o que uma página precisa para exibir o dia `iso` (objeto serializável). */
export function montarDia(iso) {
  const date = dateDeIso(iso)
  const cel = getCelebracaoDoDia(date)
  const santosCompletos = cel ? getSantosPorSlugs(cel.santos) : []
  const fig = getFigurinhaDoDia(date)
  const oracao = oracaoDoDia(iso, santosCompletos)

  return {
    data: iso,
    celebracao: cel
      ? { nome: cel.nome, tipo: cel.tipo, descricao: cel.descricao || '', cor: cel.cor || null, corHex: getCorLiturgica(cel.cor) }
      : null,
    santos: santosCompletos.map((s) => ({
      slug: s.slug,
      nome: s.nome,
      imagem: s.imagem || null,
      descricao: s.descricao || '',
      periodo: s.periodo || null,
    })),
    // A figurinha do dia só é resgatada depois de rezar a oração do dia (oracaoRef).
    figurinha: fig ? { ...resumoFigurinha(fig.tipo, fig.slug), data: iso, oracaoRef: oracao.ref } : null,
    figurinhaEhSantoDoDia: Boolean(fig && fig.tipo === 'santo' && cel?.santos?.includes(fig.slug)),
    oracao,
  }
}

/**
 * Ontem, hoje e amanhã (base: data civil de São Paulo). A janela cobre usuários em
 * qualquer fuso sem que o cliente precise do calendário.
 */
export function janelaDeDias(now = new Date()) {
  const hojeServidor = dataBrasil(now)
  const dias = {}
  ;[-1, 0, 1].forEach((delta) => {
    const iso = somarDias(hojeServidor, delta)
    dias[iso] = montarDia(iso)
  })
  return { dias, hojeServidor }
}

/** Próximas solenidades/festas a partir de hoje (BR), serializáveis. */
export function proximasCelebracoes(limite = 10, now = new Date()) {
  return getProximasCelebracoes(limite, dateDeIso(dataBrasil(now))).map((c) => ({
    nome: c.nome,
    tipo: c.tipo,
    descricao: c.descricao,
    santos: c.santos || [],
    diaNumero: c.diaNumero,
    mesNome: c.mesNome,
  }))
}

export const REVALIDATE_HOJE = 3600

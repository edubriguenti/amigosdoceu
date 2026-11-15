/**
 * Link direto para um dia do Calendário Litúrgico: `/calendario?dia=YYYY-MM-DD`.
 *
 * Lógica pura, sem JSON nem React: pode ir para o bundle do cliente e é testada
 * em `tests/calendarioLink.test.mjs`. Monte o link sempre com `hrefDiaCalendario()`.
 */

const FORMATO = /^(\d{4})-(\d{2})-(\d{2})$/
const ANO_MIN = 1900
const ANO_MAX = 2200

/** `YYYY-MM-DD` → `/calendario?dia=YYYY-MM-DD`. */
export function hrefDiaCalendario(iso) {
  return `/calendario?dia=${iso}`
}

/**
 * Lê o parâmetro `dia` da URL (string, array ou ausente) e devolve
 * `{ iso, ano, mes, dia }`, ou `null` se não for uma data civil real.
 */
export function lerDiaDaQuery(valor) {
  const texto = Array.isArray(valor) ? valor[0] : valor
  if (typeof texto !== 'string') return null
  const partes = FORMATO.exec(texto.trim())
  if (!partes) return null
  const [ano, mes, dia] = partes.slice(1).map(Number)
  if (ano < ANO_MIN || ano > ANO_MAX || mes < 1 || mes > 12 || dia < 1) return null
  // Dia 0 do mês seguinte = último dia deste mês (trata fevereiro e anos bissextos).
  if (dia > new Date(ano, mes, 0).getDate()) return null
  return { iso: partes[0], ano, mes, dia }
}

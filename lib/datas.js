/**
 * Datas civis ("que dia é hoje?") em formato ISO `YYYY-MM-DD`.
 *
 * Existem dois "hojes" no site:
 * - `dataBrasil()` → data civil de São Paulo. É o "hoje" do servidor/ISR (lib/hoje.js).
 * - `diaLocal()`   → data civil do ambiente do usuário (navegador).
 *
 * Eles podem divergir (ex.: servidor 25/09 23:30 em SP, usuário 26/09 11:30 no Japão).
 * Só `hooks/useDiaAtual.js` decide qual usar — componentes nunca comparam os dois.
 *
 * Este módulo não importa JSON: pode ir para o bundle do cliente.
 */

const pad = (n) => String(n).padStart(2, '0')

/** Data civil do ambiente em que o código roda (no cliente: a do usuário). */
export function diaLocal(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Data civil em São Paulo, independente do fuso do servidor. */
export function dataBrasil(date = new Date()) {
  // en-CA formata como YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** `YYYY-MM-DD` → Date à meia-noite local, para as funções que leem getDate()/getMonth(). */
export function dateDeIso(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Soma `dias` a uma data ISO, devolvendo outra data ISO. */
export function somarDias(iso, dias) {
  const d = dateDeIso(iso)
  d.setDate(d.getDate() + dias)
  return diaLocal(d)
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]
const SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']

/** "quinta-feira, 25 de setembro" — determinístico (não depende de Intl no cliente). */
export function dataPorExtenso(iso) {
  const d = dateDeIso(iso)
  return `${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`
}

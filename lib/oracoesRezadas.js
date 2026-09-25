/**
 * Orações rezadas — lógica pura (sem React, sem localStorage), usada por hooks/useOracoes.js.
 *
 * Estado: { dias: { 'YYYY-MM-DD': [ref, …] } }, com ref no formato do grafo de relações:
 * "oracao:<slug>" (data/oracoes.json) ou "santo:<slug>" (a oração do próprio santo).
 *
 * Sequência (a mesma definição em toda a interface):
 * - rezou hoje                         → a sequência termina hoje;
 * - não rezou hoje, mas rezou ontem    → a sequência continua (termina ontem);
 * - não rezou hoje nem ontem           → sequência = 0;
 * - várias orações no mesmo dia contam como 1 dia (sequência e diasRezados);
 *   `total` conta cada ref registrada (no máximo uma por ref por dia).
 */
import { somarDias } from './datas.js'

export const ESTADO_VAZIO = Object.freeze({ dias: Object.freeze({}) })

const DIA_ISO = /^\d{4}-\d{2}-\d{2}$/

/** Garante o formato; dado corrompido vira estado vazio. */
export function normalizar(bruto) {
  const dias = {}
  const origem = bruto && typeof bruto === 'object' && bruto.dias && typeof bruto.dias === 'object' ? bruto.dias : {}
  Object.entries(origem).forEach(([dia, refs]) => {
    if (!DIA_ISO.test(dia) || !Array.isArray(refs)) return
    const validas = [...new Set(refs.filter((r) => typeof r === 'string' && r.includes(':')))]
    if (validas.length) dias[dia] = validas
  })
  return { dias }
}

export function rezouNoDia(estado, ref, dia) {
  return Boolean(estado.dias[dia]?.includes(ref))
}

/** Registra `ref` em `dia` (no máximo uma vez). Não muta: devolve o novo estado. */
export function registrarOracaoNoEstado(estado, ref, dia) {
  if (!ref || rezouNoDia(estado, ref, dia)) return { estado, nova: false }
  return {
    estado: { dias: { ...estado.dias, [dia]: [...(estado.dias[dia] || []), ref] } },
    nova: true,
  }
}

/** { diasRezados, sequencia, total, rezouHoje } — ver a definição de sequência acima. */
export function resumirOracoes(estado, hoje) {
  const rezou = (dia) => (estado.dias[dia]?.length || 0) > 0
  const ontem = somarDias(hoje, -1)
  let sequencia = 0
  let dia = rezou(hoje) ? hoje : rezou(ontem) ? ontem : null
  while (dia && rezou(dia)) {
    sequencia++
    dia = somarDias(dia, -1)
  }
  const dias = Object.values(estado.dias)
  return {
    diasRezados: dias.filter((refs) => refs.length > 0).length,
    sequencia,
    total: dias.reduce((s, refs) => s + refs.length, 0),
    rezouHoje: rezou(hoje),
  }
}

// Estrutura do Rosário em passos lineares, derivada de data/rosario.json.
// Fonte única para o componente e o hook: início, 5 décadas e final.
// Puro (sem React/localStorage); recebe os dados para poder ser testado.

/** Lista plana de passos. Cada passo: { tipo, decada?, aveMaria?, ... }. */
export function montarPassos(rosarioData, tipoMisterio) {
  const { oracoes, misterios, estruturaRosario } = rosarioData
  const lista = misterios[tipoMisterio]?.lista || []
  const passos = []

  const oracao = (item, extra = {}) =>
    passos.push({ tipo: 'oracao', oracao: oracoes[item.nome], conta: item.conta, ...extra })

  estruturaRosario.inicio.forEach((item) => {
    if (item.tipo === 'oracao') oracao(item, { intencao: item.intencao })
  })

  for (let d = 0; d < 5; d++) {
    estruturaRosario.decada.forEach((item) => {
      if (item.tipo === 'misterio') {
        passos.push({ tipo: 'misterio', misterio: lista[d], decada: d })
      } else if (item.repeticoes) {
        for (let i = 0; i < item.repeticoes; i++) oracao(item, { aveMaria: i + 1, decada: d })
      } else {
        oracao(item, { decada: d })
      }
    })
  }

  estruturaRosario.final.forEach((item) => {
    if (item.tipo === 'oracao') oracao(item)
  })

  return passos
}

/** Índice do passo em que começa a década `d` (0-4) = o passo do mistério. */
export function passoInicialDaDecada(passos, d) {
  const i = passos.findIndex((p) => p.tipo === 'misterio' && p.decada === d)
  return i < 0 ? 0 : i
}

/** Década (0-4) a que o passo pertence; antes da 1ª década vale 0, no final vale 4. */
export function decadaDoPasso(passos, passo) {
  const p = passos[Math.min(Math.max(passo, 0), passos.length - 1)]
  if (!p) return 0
  if (p.decada !== undefined) return p.decada
  return passo >= passos.length / 2 ? 4 : 0
}

/** Porcentagem 0-100 (limitada: o passo "completo" é o índice passos.length). */
export function progressoPercentual(passos, passo) {
  if (!passos.length) return 0
  return Math.min(100, Math.round((passo / passos.length) * 100))
}

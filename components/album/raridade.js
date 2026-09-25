/**
 * Raridade = identidade visual da figurinha, nunca dificuldade de obtenção
 * nem importância espiritual. As cores seguem as cores litúrgicas.
 */
export const RARIDADE_ESTILOS = {
  comum: {
    label: 'Comum',
    cor: 'sépia',
    pips: 1,
    moldura: 'bg-[#8a7556]',
    pip: 'bg-[#8a7556]',
  },
  incomum: {
    label: 'Incomum',
    cor: 'verde litúrgico',
    pips: 2,
    moldura: 'bg-[#3f7a55]',
    pip: 'bg-[#3f7a55]',
  },
  rara: {
    label: 'Rara',
    cor: 'azul mariano',
    pips: 3,
    moldura: 'bg-[#1e4fa8]',
    pip: 'bg-[#1e4fa8]',
  },
  'muito-rara': {
    label: 'Muito rara',
    cor: 'roxo litúrgico',
    pips: 4,
    moldura: 'bg-[#6b2a93]',
    pip: 'bg-[#6b2a93]',
  },
  especial: {
    label: 'Especial',
    cor: 'vermelho litúrgico',
    pips: 5,
    moldura: 'bg-gradient-to-br from-[#b3263a] via-[#8f1b2c] to-[#b3263a]',
    pip: 'bg-[#a3202f]',
  },
  lendaria: {
    label: 'Lendária',
    cor: 'dourado',
    pips: 6,
    moldura: 'bg-gradient-to-br from-[#f7e7a1] via-[#c9a227] to-[#8a6a14]',
    pip: 'bg-[#b8901c]',
  },
}

export function estiloRaridade(raridade) {
  return RARIDADE_ESTILOS[raridade] || RARIDADE_ESTILOS.comum
}

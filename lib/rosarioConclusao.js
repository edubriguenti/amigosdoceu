/**
 * Figurinha de Cristo ligada a cada mistério do Rosário (id do Álbum: `cristo:<slug>`).
 * Escolhida pelo primeiro mistério da série; todas existem em data/vida-cristo.json
 * (conferido pelo `validate:album` via catálogo).
 */
export const CRISTO_POR_MISTERIO = Object.freeze({
  gozosos: 'nascimento',
  luminosos: 'batismo-jordao',
  dolorosos: 'agonia-horto',
  gloriosos: 'ressurreicao',
})

export function slugCristoDoMisterio(tipo) {
  return CRISTO_POR_MISTERIO[tipo] || null
}

import test from 'node:test'
import assert from 'node:assert/strict'
import { hrefDiaCalendario, lerDiaDaQuery } from '../lib/calendarioLink.js'

test('hrefDiaCalendario monta o link do dia', () => {
  assert.equal(hrefDiaCalendario('2026-11-17'), '/calendario?dia=2026-11-17')
})

test('lerDiaDaQuery lê o que hrefDiaCalendario escreve', () => {
  const href = hrefDiaCalendario('2026-11-17')
  const valor = new URL(href, 'https://exemplo.test').searchParams.get('dia')
  assert.deepEqual(lerDiaDaQuery(valor), { iso: '2026-11-17', ano: 2026, mes: 11, dia: 17 })
})

test('lerDiaDaQuery aceita parâmetro repetido (array) e espaços', () => {
  assert.equal(lerDiaDaQuery(['2026-01-06', '2026-02-02']).iso, '2026-01-06')
  assert.equal(lerDiaDaQuery(' 2026-12-25 ').iso, '2026-12-25')
})

test('lerDiaDaQuery recusa ausência, formato errado e datas que não existem', () => {
  for (const valor of [undefined, null, '', 17, 'amanha', '17/11/2026', '2026-11', '2026-1-7', '2026-13-01', '2026-00-10', '2026-11-00', '2026-11-31', '2026-02-29', '0000-01-01', '9999-01-01']) {
    assert.equal(lerDiaDaQuery(valor), null, `deveria recusar ${JSON.stringify(valor)}`)
  }
})

test('lerDiaDaQuery aceita 29 de fevereiro só em ano bissexto', () => {
  assert.equal(lerDiaDaQuery('2028-02-29').dia, 29)
  assert.equal(lerDiaDaQuery('2027-02-29'), null)
})

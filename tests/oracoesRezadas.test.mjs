import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ESTADO_VAZIO,
  normalizar,
  rezouNoDia,
  registrarOracaoNoEstado,
  resumirOracoes,
} from '../lib/oracoesRezadas.js'
import { somarDias } from '../lib/datas.js'

const com = (...pares) => ({ dias: Object.fromEntries(pares) })

test('somarDias atravessa mês, ano e 29/02', () => {
  assert.equal(somarDias('2026-03-01', -1), '2026-02-28')
  assert.equal(somarDias('2028-03-01', -1), '2028-02-29')
  assert.equal(somarDias('2027-01-01', -1), '2026-12-31')
  assert.equal(somarDias('2026-12-31', 1), '2027-01-01')
})

test('estado vazio: tudo zerado', () => {
  assert.deepEqual(resumirOracoes(ESTADO_VAZIO, '2026-11-19'), {
    diasRezados: 0,
    sequencia: 0,
    total: 0,
    rezouHoje: false,
  })
})

test('rezou hoje: a sequência termina hoje', () => {
  const e = com(['2026-11-19', ['oracao:pai-nosso']], ['2026-11-18', ['oracao:ave-maria']])
  const r = resumirOracoes(e, '2026-11-19')
  assert.equal(r.sequencia, 2)
  assert.equal(r.rezouHoje, true)
})

test('não rezou hoje, mas rezou ontem: a sequência continua', () => {
  const e = com(['2026-11-18', ['oracao:pai-nosso']], ['2026-11-17', ['oracao:pai-nosso']])
  const r = resumirOracoes(e, '2026-11-19')
  assert.equal(r.sequencia, 2)
  assert.equal(r.rezouHoje, false)
})

test('nem hoje nem ontem: sequência zera, mas o histórico fica', () => {
  const e = com(['2026-11-10', ['oracao:pai-nosso']], ['2026-11-09', ['oracao:pai-nosso']])
  const r = resumirOracoes(e, '2026-11-19')
  assert.equal(r.sequencia, 0)
  assert.equal(r.diasRezados, 2)
})

test('um dia sem rezar quebra a sequência', () => {
  const e = com(
    ['2026-11-19', ['oracao:a']],
    ['2026-11-18', ['oracao:a']],
    ['2026-11-16', ['oracao:a']],
    ['2026-11-15', ['oracao:a']],
  )
  assert.equal(resumirOracoes(e, '2026-11-19').sequencia, 2)
})

test('várias orações no mesmo dia contam 1 dia na sequência e N no total', () => {
  const e = com(['2026-11-19', ['oracao:a', 'santo:sao-pedro', 'oracao:b']])
  const r = resumirOracoes(e, '2026-11-19')
  assert.equal(r.sequencia, 1)
  assert.equal(r.diasRezados, 1)
  assert.equal(r.total, 3)
})

test('a sequência atravessa virada de mês e de ano', () => {
  const e = com(['2027-01-01', ['oracao:a']], ['2026-12-31', ['oracao:a']], ['2026-12-30', ['oracao:a']])
  assert.equal(resumirOracoes(e, '2027-01-01').sequencia, 3)
})

test('registrarOracaoNoEstado é idempotente por ref e dia, e não muta', () => {
  const inicial = ESTADO_VAZIO
  const a = registrarOracaoNoEstado(inicial, 'oracao:pai-nosso', '2026-11-19')
  assert.equal(a.nova, true)
  assert.deepEqual(inicial.dias, {})
  const b = registrarOracaoNoEstado(a.estado, 'oracao:pai-nosso', '2026-11-19')
  assert.equal(b.nova, false)
  assert.equal(b.estado, a.estado)
  const c = registrarOracaoNoEstado(a.estado, 'santo:sao-pedro', '2026-11-19')
  assert.equal(c.nova, true)
  assert.deepEqual(c.estado.dias['2026-11-19'], ['oracao:pai-nosso', 'santo:sao-pedro'])
  assert.deepEqual(a.estado.dias['2026-11-19'], ['oracao:pai-nosso'])
})

test('a mesma oração em outro dia é um novo registro', () => {
  const a = registrarOracaoNoEstado(ESTADO_VAZIO, 'oracao:pai-nosso', '2026-11-18')
  const b = registrarOracaoNoEstado(a.estado, 'oracao:pai-nosso', '2026-11-19')
  assert.equal(b.nova, true)
  assert.equal(rezouNoDia(b.estado, 'oracao:pai-nosso', '2026-11-18'), true)
})

test('ref vazia não registra nada', () => {
  assert.equal(registrarOracaoNoEstado(ESTADO_VAZIO, '', '2026-11-19').nova, false)
  assert.equal(registrarOracaoNoEstado(ESTADO_VAZIO, null, '2026-11-19').nova, false)
})

test('normalizar descarta dado corrompido sem lançar erro', () => {
  for (const ruim of [null, undefined, 42, 'x', [], {}, { dias: null }, { dias: 'x' }, { dias: [] }]) {
    assert.deepEqual(normalizar(ruim), { dias: {} })
  }
  const n = normalizar({
    dias: {
      '2026-11-19': ['oracao:a', 'oracao:a', 'sem-dois-pontos', 7, null],
      '19/11/2026': ['oracao:b'],
      '2026-11-18': 'oracao:c',
      '2026-11-17': [],
    },
  })
  assert.deepEqual(n, { dias: { '2026-11-19': ['oracao:a'] } })
})

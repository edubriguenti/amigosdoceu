import eventos from '../data/conexoes/eventos.json'
import trilhas from '../data/conexoes/trilhas.json'
import desafios from '../data/conexoes/desafios.json'
import messiasPrometido from '../data/conexoes/conexoes/messias-prometido.json'
import sacrificioRedencao from '../data/conexoes/conexoes/sacrificio-redencao.json'
import reinoDeus from '../data/conexoes/conexoes/reino-deus.json'
import leiGraca from '../data/conexoes/conexoes/lei-graca.json'
import mariaEscrituras from '../data/conexoes/conexoes/maria-escrituras.json'
import eucaristiaSacramentos from '../data/conexoes/conexoes/eucaristia-sacramentos.json'

const TODAS_CONEXOES = [
  ...messiasPrometido,
  ...sacrificioRedencao,
  ...reinoDeus,
  ...leiGraca,
  ...mariaEscrituras,
  ...eucaristiaSacramentos,
]

export function getTrilhaById(id) {
  return trilhas.find((t) => t.id === id) || null
}

export function getEventos() {
  return eventos
}

export function getTrilhas() {
  return trilhas
}

export function getAllConexoes() {
  return TODAS_CONEXOES
}

export function getConexaoBySlug(slug) {
  return TODAS_CONEXOES.find((c) => c.slug === slug) || null
}

export function getConexoesByEvento(eventoId) {
  if (!eventoId) return TODAS_CONEXOES
  return TODAS_CONEXOES.filter((c) => c.eventoId === eventoId)
}

export function getConexoesByTrilha(trilhaId) {
  return TODAS_CONEXOES.filter((c) => c.trilhaId === trilhaId)
}

function hashDate(dateStr) {
  let h = 0
  for (let i = 0; i < dateStr.length; i++) {
    h = (h * 31 + dateStr.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function getDesafioDoDia(date = new Date()) {
  const dateStr = date.toISOString().slice(0, 10)
  const idx = hashDate(dateStr) % desafios.length
  return { ...desafios[idx], data: dateStr }
}

export function getAllDesafios() {
  return desafios
}

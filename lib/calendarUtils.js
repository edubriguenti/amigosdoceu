import calendarioData from '../data/calendario-liturgico.json'
import santosData from '../data/santos.json'

// Mapeamento de meses em português
const mesesPt = {
  1: 'janeiro',
  2: 'fevereiro',
  3: 'marco',
  4: 'abril',
  5: 'maio',
  6: 'junho',
  7: 'julho',
  8: 'agosto',
  9: 'setembro',
  10: 'outubro',
  11: 'novembro',
  12: 'dezembro'
}

const mesesNomes = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

// Cores litúrgicas
const coresLiturgicas = {
  branco: '#FFFFFF',
  vermelho: '#DC2626',
  verde: '#16A34A',
  roxo: '#9333EA',
  rosa: '#EC4899'
}

/**
 * Obtém a celebração litúrgica para uma data específica
 * @param {Date} date - Data a ser consultada
 * @returns {Object|null} - Objeto com informações da celebração ou null
 */
export function getCelebracaoDoDia(date) {
  const mes = mesesPt[date.getMonth() + 1]
  const dia = date.getDate().toString()

  if (calendarioData[mes] && calendarioData[mes][dia]) {
    return {
      ...calendarioData[mes][dia],
      data: date,
      diaNumero: dia,
      mesNome: mesesNomes[date.getMonth()]
    }
  }

  return null
}

/**
 * Obtém santos do dia com base nos slugs
 * @param {string[]} slugs - Array de slugs dos santos
 * @returns {Array} - Array de objetos de santos
 */
export function getSantosPorSlugs(slugs) {
  if (!slugs || slugs.length === 0) return []

  return slugs
    .map(slug => santosData.find(santo => santo.slug === slug))
    .filter(Boolean)
}

/**
 * Obtém todas as celebrações de um mês
 * @param {number} mes - Número do mês (1-12)
 * @param {number} ano - Ano
 * @returns {Array} - Array de celebrações do mês
 */
export function getCelebracoesMes(mes, ano) {
  const mesKey = mesesPt[mes]
  const celebracoes = []

  if (calendarioData[mesKey]) {
    Object.keys(calendarioData[mesKey]).forEach(dia => {
      const celebracao = calendarioData[mesKey][dia]
      const date = new Date(ano, mes - 1, parseInt(dia))

      celebracoes.push({
        ...celebracao,
        data: date,
        dia: parseInt(dia),
        mesNome: mesesNomes[mes - 1]
      })
    })
  }

  return celebracoes.sort((a, b) => a.dia - b.dia)
}

/**
 * Obtém informações do calendário para um mês completo
 * @param {number} mes - Número do mês (1-12)
 * @param {number} ano - Ano
 * @returns {Object} - Objeto com informações do calendário
 */
export function getCalendarioMes(mes, ano) {
  const primeiroDia = new Date(ano, mes - 1, 1)
  const ultimoDia = new Date(ano, mes, 0)
  const diasNoMes = ultimoDia.getDate()
  const diaSemanaInicio = primeiroDia.getDay() // 0 = Domingo

  const celebracoes = getCelebracoesMes(mes, ano)

  return {
    mes,
    ano,
    mesNome: mesesNomes[mes - 1],
    diasNoMes,
    diaSemanaInicio,
    celebracoes,
    primeiroDia,
    ultimoDia
  }
}

/**
 * Verifica se uma data tem celebração litúrgica
 * @param {Date} date - Data a ser verificada
 * @returns {boolean}
 */
export function temCelebracao(date) {
  return getCelebracaoDoDia(date) !== null
}

/**
 * Obtém próximas celebrações importantes
 * @param {number} limite - Número máximo de celebrações a retornar
 * @returns {Array} - Array de próximas celebrações
 */
export function getProximasCelebracoes(limite = 5) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const proximasCelebracoes = []

  // Buscar pelos próximos 365 dias
  for (let i = 0; i < 365 && proximasCelebracoes.length < limite; i++) {
    const data = new Date(hoje)
    data.setDate(data.getDate() + i)

    const celebracao = getCelebracaoDoDia(data)
    if (celebracao && (celebracao.tipo === 'Solenidade' || celebracao.tipo === 'Festa')) {
      proximasCelebracoes.push(celebracao)
    }
  }

  return proximasCelebracoes
}

/**
 * Formata uma data em português
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
export function formatarData(date) {
  const dia = date.getDate()
  const mes = mesesNomes[date.getMonth()]
  const ano = date.getFullYear()

  return `${dia} de ${mes} de ${ano}`
}

/**
 * Obtém a cor litúrgica
 * @param {string} cor - Nome da cor
 * @returns {string} - Código hexadecimal da cor
 */
export function getCorLiturgica(cor) {
  return coresLiturgicas[cor] || coresLiturgicas.branco
}

export { mesesNomes, mesesPt, coresLiturgicas }

/**
 * Utilities for handling saint relationships
 */

/**
 * Relationship types and their display information
 */
export const TIPOS_RELACIONAMENTO = {
  mentor: {
    label: 'Foi mentor de',
    labelInverso: 'Foi discípulo de',
    icon: '👨‍🏫',
    cor: 'accent'
  },
  discipulo: {
    label: 'Foi discípulo de',
    labelInverso: 'Foi mentor de',
    icon: '🎓',
    cor: 'secondary'
  },
  contemporaneo: {
    label: 'Viveu na mesma época que',
    labelInverso: 'Viveu na mesma época que',
    icon: '🕰️',
    cor: 'primary'
  },
  mesmaOrdem: {
    label: 'Mesma ordem religiosa que',
    labelInverso: 'Mesma ordem religiosa que',
    icon: '⛪',
    cor: 'neutral'
  },
  canonizadoPor: {
    label: 'Foi canonizado por',
    labelInverso: 'Canonizou',
    icon: '🙏',
    cor: 'accent'
  },
  proclamadoPor: {
    label: 'Foi proclamado por',
    labelInverso: 'Proclamou',
    icon: '📜',
    cor: 'secondary'
  },
  fundador: {
    label: 'Fundou a ordem de',
    labelInverso: 'Ordem fundada por',
    icon: '⭐',
    cor: 'accent'
  },
  influenciadoPor: {
    label: 'Foi influenciado por',
    labelInverso: 'Influenciou',
    icon: '💡',
    cor: 'primary'
  }
};

/**
 * Get saint relationships from the santos data
 * @param {string} santoSlug - Slug of the saint
 * @param {Array} santosData - Array of all saints
 * @returns {Array} Array of relationships with full saint data
 */
export function getRelacionamentosSanto(santoSlug, santosData) {
  const santo = santosData.find(s => s.slug === santoSlug);
  if (!santo || !santo.relacionamentos) {
    return [];
  }

  return santo.relacionamentos.map(rel => {
    const santoRelacionado = santosData.find(s => s.slug === rel.santoSlug);
    const tipoInfo = TIPOS_RELACIONAMENTO[rel.tipo] || {
      label: rel.tipo,
      icon: '🔗',
      cor: 'neutral'
    };

    return {
      ...rel,
      santo: santoRelacionado,
      tipoInfo
    };
  }).filter(rel => rel.santo); // Filter out any relationships where saint wasn't found
}

/**
 * Get related saints grouped by relationship type
 * @param {string} santoSlug - Slug of the saint
 * @param {Array} santosData - Array of all saints
 * @returns {Object} Object with relationships grouped by type
 */
export function getRelacionamentosAgrupados(santoSlug, santosData) {
  const relacionamentos = getRelacionamentosSanto(santoSlug, santosData);
  const agrupados = {};

  relacionamentos.forEach(rel => {
    if (!agrupados[rel.tipo]) {
      agrupados[rel.tipo] = {
        tipo: rel.tipo,
        tipoInfo: rel.tipoInfo,
        santos: []
      };
    }
    agrupados[rel.tipo].santos.push({
      ...rel.santo,
      descricaoRelacao: rel.descricao
    });
  });

  return Object.values(agrupados);
}

/**
 * Get inverse relationships (saints that have this saint as a relationship)
 * @param {string} santoSlug - Slug of the saint
 * @param {Array} santosData - Array of all saints
 * @returns {Array} Array of inverse relationships
 */
export function getRelacionamentosInversos(santoSlug, santosData) {
  const relacionamentosInversos = [];

  santosData.forEach(santo => {
    if (santo.relacionamentos) {
      santo.relacionamentos.forEach(rel => {
        if (rel.santoSlug === santoSlug) {
          const tipoInfo = TIPOS_RELACIONAMENTO[rel.tipo] || {
            label: rel.tipo,
            icon: '🔗',
            cor: 'neutral'
          };

          relacionamentosInversos.push({
            tipo: rel.tipo,
            santo: santo,
            descricao: rel.descricao,
            tipoInfo: {
              ...tipoInfo,
              label: tipoInfo.labelInverso
            }
          });
        }
      });
    }
  });

  return relacionamentosInversos;
}

/**
 * Get all relationships (both direct and inverse)
 * @param {string} santoSlug - Slug of the saint
 * @param {Array} santosData - Array of all saints
 * @returns {Array} Combined array of all relationships
 */
export function getTodosRelacionamentos(santoSlug, santosData) {
  const diretos = getRelacionamentosSanto(santoSlug, santosData);
  const inversos = getRelacionamentosInversos(santoSlug, santosData);

  return [...diretos, ...inversos];
}

/**
 * Get relationship timeline sorted by dates
 * @param {string} santoSlug - Slug of the saint
 * @param {Array} santosData - Array of all saints
 * @returns {Array} Timeline of relationships sorted by date
 */
export function getTimelineRelacionamentos(santoSlug, santosData) {
  const santo = santosData.find(s => s.slug === santoSlug);
  if (!santo) return [];

  const todosRel = getTodosRelacionamentos(santoSlug, santosData);

  // Create timeline entries
  const timeline = todosRel
    .filter(rel => rel.santo && (rel.santo.dataNascimento || rel.santo.dataFalecimento))
    .map(rel => ({
      ...rel,
      data: rel.santo.dataNascimento || rel.santo.dataFalecimento,
      periodo: rel.santo.periodo
    }))
    .sort((a, b) => {
      const dataA = parseInt(a.data) || 0;
      const dataB = parseInt(b.data) || 0;
      return dataA - dataB;
    });

  return timeline;
}

/**
 * Check if two saints lived in overlapping time periods
 * @param {Object} santo1 - First saint
 * @param {Object} santo2 - Second saint
 * @returns {boolean} True if they were contemporaries
 */
export function saoContemporaneos(santo1, santo2) {
  if (!santo1.dataNascimento || !santo1.dataFalecimento ||
      !santo2.dataNascimento || !santo2.dataFalecimento) {
    return false;
  }

  const nasc1 = parseInt(santo1.dataNascimento);
  const falec1 = parseInt(santo1.dataFalecimento);
  const nasc2 = parseInt(santo2.dataNascimento);
  const falec2 = parseInt(santo2.dataFalecimento);

  // Check if life periods overlap
  return (nasc1 <= falec2 && nasc2 <= falec1);
}

/**
 * Get suggested relationships based on common attributes
 * @param {string} santoSlug - Slug of the saint
 * @param {Array} santosData - Array of all saints
 * @returns {Array} Array of suggested related saints
 */
export function getSugestoesRelacionamento(santoSlug, santosData) {
  const santo = santosData.find(s => s.slug === santoSlug);
  if (!santo) return [];

  const sugestoes = [];

  santosData.forEach(outroSanto => {
    if (outroSanto.slug === santoSlug) return;

    let score = 0;
    let razoes = [];

    // Same religious order
    if (santo.ordemReligiosa && outroSanto.ordemReligiosa === santo.ordemReligiosa) {
      score += 3;
      razoes.push(`Mesma ordem religiosa: ${santo.ordemReligiosa}`);
    }

    // Same period
    if (santo.periodo && outroSanto.periodo === santo.periodo) {
      score += 2;
      razoes.push(`Mesmo período: ${santo.periodo}`);
    }

    // Both doctors of the church
    if (santo.doutorIgreja && outroSanto.doutorIgreja) {
      score += 2;
      razoes.push('Ambos Doutores da Igreja');
    }

    // Same country
    if (santo.pais && outroSanto.pais === santo.pais) {
      score += 1;
      razoes.push(`Mesmo país: ${santo.pais}`);
    }

    // Contemporaries
    if (saoContemporaneos(santo, outroSanto)) {
      score += 2;
      razoes.push('Viveram na mesma época');
    }

    if (score > 0) {
      sugestoes.push({
        santo: outroSanto,
        score,
        razoes
      });
    }
  });

  return sugestoes.sort((a, b) => b.score - a.score);
}

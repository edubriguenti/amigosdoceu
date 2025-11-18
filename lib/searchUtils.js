// Função auxiliar para normalizar texto (remove acentos e converte para minúsculas)
function normalizeText(text) {
  if (!text) return '';
  return text
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .toLowerCase()
    .trim();
}

// Função de busca fuzzy para santos
export function searchSaints(saints, query) {
  if (!query || query.trim() === '') return saints;

  const normalizedQuery = normalizeText(query);
  return saints.filter(saint =>
    normalizeText(saint.nome).includes(normalizedQuery) ||
    normalizeText(saint.descricao).includes(normalizedQuery) ||
    saint.tags?.some(tag => normalizeText(tag).includes(normalizedQuery)) ||
    normalizeText(saint.pais).includes(normalizedQuery) ||
    normalizeText(saint.ordemReligiosa).includes(normalizedQuery) ||
    saint.padroeiro?.some(p => normalizeText(p).includes(normalizedQuery)) ||
    normalizeText(saint.periodo).includes(normalizedQuery)
  );
}

// Função de busca fuzzy para igrejas
export function searchChurches(churches, query) {
  if (!query || query.trim() === '') return churches;

  const normalizedQuery = normalizeText(query);
  return churches.filter(church =>
    normalizeText(church.nome).includes(normalizedQuery) ||
    normalizeText(church.descricao).includes(normalizedQuery) ||
    church.tags?.some(tag => normalizeText(tag).includes(normalizedQuery)) ||
    normalizeText(church.pais).includes(normalizedQuery) ||
    normalizeText(church.cidade).includes(normalizedQuery) ||
    normalizeText(church.estiloArquitetonico).includes(normalizedQuery) ||
    normalizeText(church.tipo).includes(normalizedQuery) ||
    normalizeText(church.arquiteto).includes(normalizedQuery)
  );
}

// Função de filtragem para santos
export function filterSaints(saints, filters) {
  return saints.filter(saint => {
    // Filtro por países
    if (filters.paises?.length > 0 && !filters.paises.includes(saint.pais)) {
      return false;
    }

    // Filtro por tags
    if (filters.tags?.length > 0) {
      const hasTag = filters.tags.some(tag => saint.tags?.includes(tag));
      if (!hasTag) return false;
    }

    // Filtro por período
    if (filters.periodos?.length > 0 && !filters.periodos.includes(saint.periodo)) {
      return false;
    }

    // Filtro por ordem religiosa
    if (filters.ordensReligiosas?.length > 0 && !filters.ordensReligiosas.includes(saint.ordemReligiosa)) {
      return false;
    }

    // Filtro por doutor da Igreja
    if (filters.doutorIgreja !== undefined && saint.doutorIgreja !== filters.doutorIgreja) {
      return false;
    }

    return true;
  });
}

// Função de filtragem para igrejas
export function filterChurches(churches, filters) {
  return churches.filter(church => {
    // Filtro por países
    if (filters.paises?.length > 0 && !filters.paises.includes(church.pais)) {
      return false;
    }

    // Filtro por tags
    if (filters.tags?.length > 0) {
      const hasTag = filters.tags.some(tag => church.tags?.includes(tag));
      if (!hasTag) return false;
    }

    // Filtro por estilo arquitetônico
    if (filters.estilos?.length > 0 && !filters.estilos.includes(church.estiloArquitetonico)) {
      return false;
    }

    // Filtro por tipo
    if (filters.tipos?.length > 0 && !filters.tipos.includes(church.tipo)) {
      return false;
    }

    return true;
  });
}

// Função de ordenação para santos
export function sortSaints(saints, sortBy) {
  const sorted = [...saints];

  switch(sortBy) {
    case 'nome':
      return sorted.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    case 'nome-desc':
      return sorted.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));

    case 'canonizacao':
      return sorted.sort((a, b) => {
        const yearA = parseInt(a.dataCanonizacao) || 0;
        const yearB = parseInt(b.dataCanonizacao) || 0;
        return yearB - yearA;
      });

    case 'canonizacao-asc':
      return sorted.sort((a, b) => {
        const yearA = parseInt(a.dataCanonizacao) || 0;
        const yearB = parseInt(b.dataCanonizacao) || 0;
        return yearA - yearB;
      });

    case 'popularidade':
      return sorted.sort((a, b) => (b.popularidade || 0) - (a.popularidade || 0));

    case 'popularidade-asc':
      return sorted.sort((a, b) => (a.popularidade || 0) - (b.popularidade || 0));

    default:
      return sorted;
  }
}

// Função de ordenação para igrejas
export function sortChurches(churches, sortBy) {
  const sorted = [...churches];

  switch(sortBy) {
    case 'nome':
      return sorted.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    case 'nome-desc':
      return sorted.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));

    case 'capacidade':
      return sorted.sort((a, b) => (b.capacidade || 0) - (a.capacidade || 0));

    case 'capacidade-asc':
      return sorted.sort((a, b) => (a.capacidade || 0) - (b.capacidade || 0));

    case 'ano':
      return sorted.sort((a, b) => {
        // Extrai o primeiro ano da string (ex: "1506-1626" -> 1506)
        const yearA = parseInt((a.ano || '').match(/\d+/)?.[0]) || 0;
        const yearB = parseInt((b.ano || '').match(/\d+/)?.[0]) || 0;
        return yearA - yearB;
      });

    case 'ano-desc':
      return sorted.sort((a, b) => {
        const yearA = parseInt((a.ano || '').match(/\d+/)?.[0]) || 0;
        const yearB = parseInt((b.ano || '').match(/\d+/)?.[0]) || 0;
        return yearB - yearA;
      });

    default:
      return sorted;
  }
}

// Extrai valores únicos de um campo específico nos dados
export function getUniqueValues(data, field) {
  const values = new Set();

  data.forEach(item => {
    const value = item[field];
    if (Array.isArray(value)) {
      value.forEach(v => v && values.add(v));
    } else if (value) {
      values.add(value);
    }
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

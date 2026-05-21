import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'amigosdoceu_favoritos';
const LISTS_KEY = 'amigosdoceu_listas';

/**
 * Hook para gerenciar favoritos e listas personalizadas
 * Suporta: santos, igrejas, aparições
 */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState({ santos: [], igrejas: [], aparicoes: [], conexoes: [] });
  const [listas, setListas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavoritos = localStorage.getItem(STORAGE_KEY);
        const savedListas = localStorage.getItem(LISTS_KEY);

        if (savedFavoritos) {
          setFavoritos(JSON.parse(savedFavoritos));
        }

        if (savedListas) {
          setListas(JSON.parse(savedListas));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
      setLoaded(true);
    }
  }, []);

  // Salvar favoritos no localStorage quando mudarem
  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
      }
    }
  }, [favoritos, loaded]);

  // Salvar listas no localStorage quando mudarem
  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LISTS_KEY, JSON.stringify(listas));
      } catch (error) {
        console.error('Erro ao salvar listas:', error);
      }
    }
  }, [listas, loaded]);

  // Adicionar item aos favoritos
  const addFavorito = useCallback((tipo, item) => {
    setFavoritos(prev => {
      const tipoFavoritos = prev[tipo] || [];

      // Verificar se já existe
      if (tipoFavoritos.some(fav => fav.slug === item.slug)) {
        return prev;
      }

      return {
        ...prev,
        [tipo]: [...tipoFavoritos, { ...item, addedAt: new Date().toISOString() }]
      };
    });
  }, []);

  // Remover item dos favoritos
  const removeFavorito = useCallback((tipo, slug) => {
    setFavoritos(prev => {
      const tipoFavoritos = prev[tipo] || [];
      return {
        ...prev,
        [tipo]: tipoFavoritos.filter(fav => fav.slug !== slug)
      };
    });
  }, []);

  // Alternar favorito (adicionar se não existe, remover se existe)
  const toggleFavorito = useCallback((tipo, item) => {
    setFavoritos(prev => {
      const tipoFavoritos = prev[tipo] || [];
      const exists = tipoFavoritos.some(fav => fav.slug === item.slug);

      if (exists) {
        return {
          ...prev,
          [tipo]: tipoFavoritos.filter(fav => fav.slug !== item.slug)
        };
      } else {
        return {
          ...prev,
          [tipo]: [...tipoFavoritos, { ...item, addedAt: new Date().toISOString() }]
        };
      }
    });
  }, []);

  // Verificar se item está nos favoritos
  const isFavorito = useCallback((tipo, slug) => {
    const tipoFavoritos = favoritos[tipo] || [];
    return tipoFavoritos.some(fav => fav.slug === slug);
  }, [favoritos]);

  // Obter todos os favoritos de um tipo
  const getFavoritos = useCallback((tipo) => {
    return favoritos[tipo] || [];
  }, [favoritos]);

  // Obter contagem total de favoritos
  const getTotalCount = useCallback(() => {
    return Object.values(favoritos).reduce((sum, arr) => sum + arr.length, 0);
  }, [favoritos]);

  // Criar nova lista
  const createLista = useCallback((nome, descricao = '') => {
    const novaLista = {
      id: Date.now().toString(),
      nome,
      descricao,
      items: [],
      createdAt: new Date().toISOString()
    };

    setListas(prev => [...prev, novaLista]);
    return novaLista;
  }, []);

  // Atualizar lista
  const updateLista = useCallback((listaId, updates) => {
    setListas(prev => prev.map(lista =>
      lista.id === listaId ? { ...lista, ...updates } : lista
    ));
  }, []);

  // Deletar lista
  const deleteLista = useCallback((listaId) => {
    setListas(prev => prev.filter(lista => lista.id !== listaId));
  }, []);

  // Adicionar item a uma lista
  const addToLista = useCallback((listaId, tipo, item) => {
    setListas(prev => prev.map(lista => {
      if (lista.id === listaId) {
        // Verificar se já existe
        const exists = lista.items.some(i => i.tipo === tipo && i.slug === item.slug);
        if (exists) return lista;

        return {
          ...lista,
          items: [...lista.items, { tipo, ...item, addedAt: new Date().toISOString() }]
        };
      }
      return lista;
    }));
  }, []);

  // Remover item de uma lista
  const removeFromLista = useCallback((listaId, tipo, slug) => {
    setListas(prev => prev.map(lista => {
      if (lista.id === listaId) {
        return {
          ...lista,
          items: lista.items.filter(item => !(item.tipo === tipo && item.slug === slug))
        };
      }
      return lista;
    }));
  }, []);

  // Obter lista por ID
  const getLista = useCallback((listaId) => {
    return listas.find(lista => lista.id === listaId);
  }, [listas]);

  // Limpar todos os favoritos
  const clearAllFavoritos = useCallback(() => {
    setFavoritos({ santos: [], igrejas: [], aparicoes: [], conexoes: [] });
  }, []);

  // Exportar favoritos como JSON
  const exportAsJSON = useCallback(() => {
    return JSON.stringify({ favoritos, listas }, null, 2);
  }, [favoritos, listas]);

  // Exportar favoritos como texto
  const exportAsText = useCallback(() => {
    let text = '=== MEUS FAVORITOS - AMIGOS DO CÉU ===\n\n';

    // Favoritos
    if (favoritos.santos?.length > 0) {
      text += '📿 SANTOS:\n';
      favoritos.santos.forEach(santo => {
        text += `- ${santo.nome}\n`;
      });
      text += '\n';
    }

    if (favoritos.igrejas?.length > 0) {
      text += '⛪ IGREJAS:\n';
      favoritos.igrejas.forEach(igreja => {
        text += `- ${igreja.nome} (${igreja.local})\n`;
      });
      text += '\n';
    }

    if (favoritos.aparicoes?.length > 0) {
      text += '✨ APARIÇÕES MARIANAS:\n';
      favoritos.aparicoes.forEach(aparicao => {
        text += `- ${aparicao.nome} - ${aparicao.local}\n`;
      });
      text += '\n';
    }

    // Listas personalizadas
    if (listas.length > 0) {
      text += '\n=== MINHAS LISTAS PERSONALIZADAS ===\n\n';
      listas.forEach(lista => {
        text += `📋 ${lista.nome.toUpperCase()}\n`;
        if (lista.descricao) {
          text += `   ${lista.descricao}\n`;
        }
        lista.items.forEach(item => {
          const emoji = item.tipo === 'santos' ? '📿' : item.tipo === 'igrejas' ? '⛪' : '✨';
          text += `   ${emoji} ${item.nome}\n`;
        });
        text += '\n';
      });
    }

    return text;
  }, [favoritos, listas]);

  return {
    // Estado
    favoritos,
    listas,
    loaded,

    // Operações de favoritos
    addFavorito,
    removeFavorito,
    toggleFavorito,
    isFavorito,
    getFavoritos,
    getTotalCount,
    clearAllFavoritos,

    // Operações de listas
    createLista,
    updateLista,
    deleteLista,
    addToLista,
    removeFromLista,
    getLista,

    // Exportar
    exportAsJSON,
    exportAsText
  };
}

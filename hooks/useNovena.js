import { useState, useEffect } from 'react';

const STORAGE_KEY = 'amigos-do-ceu-novenas';

/**
 * Hook para gerenciar novenas em progresso e completadas
 * @returns {Object} Métodos e estado das novenas
 */
export default function useNovena() {
  const [novenas, setNovenas] = useState({
    emProgresso: [],
    completadas: []
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar novenas do localStorage
  useEffect(() => {
    const carregarNovenas = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setNovenas(data);
        }
      } catch (error) {
        console.error('Erro ao carregar novenas:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    carregarNovenas();
  }, []);

  // Salvar novenas no localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novenas));
      } catch (error) {
        console.error('Erro ao salvar novenas:', error);
      }
    }
  }, [novenas, isLoaded]);

  /**
   * Iniciar uma nova novena
   * @param {Object} novena - Dados da novena
   * @returns {Object} Novena iniciada
   */
  const iniciarNovena = (novena) => {
    const novenaIniciada = {
      id: novena.id,
      slug: novena.slug,
      nome: novena.nome,
      imagem: novena.imagem,
      duracao: novena.duracao,
      dataInicio: new Date().toISOString(),
      diaAtual: 1,
      diasCompletados: [],
      intencao: ''
    };

    setNovenas(prev => ({
      ...prev,
      emProgresso: [...prev.emProgresso, novenaIniciada]
    }));

    return novenaIniciada;
  };

  /**
   * Verificar se uma novena está em progresso
   * @param {string} slug - Slug da novena
   * @returns {Object|null} Novena em progresso ou null
   */
  const getNovenaEmProgresso = (slug) => {
    return novenas.emProgresso.find(n => n.slug === slug) || null;
  };

  /**
   * Marcar dia como completado
   * @param {string} slug - Slug da novena
   * @param {number} dia - Número do dia
   */
  const marcarDiaCompleto = (slug, dia) => {
    setNovenas(prev => {
      const novasEmProgresso = prev.emProgresso.map(novena => {
        if (novena.slug === slug) {
          const diasCompletados = [...novena.diasCompletados];
          if (!diasCompletados.includes(dia)) {
            diasCompletados.push(dia);
          }

          const novoDiaAtual = dia < novena.duracao ? dia + 1 : novena.duracao;

          return {
            ...novena,
            diasCompletados: diasCompletados.sort((a, b) => a - b),
            diaAtual: novoDiaAtual,
            ultimaAtualizacao: new Date().toISOString()
          };
        }
        return novena;
      });

      return {
        ...prev,
        emProgresso: novasEmProgresso
      };
    });
  };

  /**
   * Desmarcar dia como completado
   * @param {string} slug - Slug da novena
   * @param {number} dia - Número do dia
   */
  const desmarcarDiaCompleto = (slug, dia) => {
    setNovenas(prev => {
      const novasEmProgresso = prev.emProgresso.map(novena => {
        if (novena.slug === slug) {
          const diasCompletados = novena.diasCompletados.filter(d => d !== dia);

          return {
            ...novena,
            diasCompletados: diasCompletados.sort((a, b) => a - b),
            ultimaAtualizacao: new Date().toISOString()
          };
        }
        return novena;
      });

      return {
        ...prev,
        emProgresso: novasEmProgresso
      };
    });
  };

  /**
   * Atualizar intenção da novena
   * @param {string} slug - Slug da novena
   * @param {string} intencao - Intenção da novena
   */
  const atualizarIntencao = (slug, intencao) => {
    setNovenas(prev => {
      const novasEmProgresso = prev.emProgresso.map(novena => {
        if (novena.slug === slug) {
          return {
            ...novena,
            intencao
          };
        }
        return novena;
      });

      return {
        ...prev,
        emProgresso: novasEmProgresso
      };
    });
  };

  /**
   * Completar novena (mover para completadas)
   * @param {string} slug - Slug da novena
   */
  const completarNovena = (slug) => {
    setNovenas(prev => {
      const novena = prev.emProgresso.find(n => n.slug === slug);
      if (!novena) return prev;

      const novenaCompletada = {
        ...novena,
        dataCompletada: new Date().toISOString()
      };

      return {
        emProgresso: prev.emProgresso.filter(n => n.slug !== slug),
        completadas: [novenaCompletada, ...prev.completadas]
      };
    });
  };

  /**
   * Cancelar/remover novena em progresso
   * @param {string} slug - Slug da novena
   */
  const cancelarNovena = (slug) => {
    setNovenas(prev => ({
      ...prev,
      emProgresso: prev.emProgresso.filter(n => n.slug !== slug)
    }));
  };

  /**
   * Remover novena das completadas
   * @param {string} slug - Slug da novena
   * @param {string} dataCompletada - Data de completamento para identificar
   */
  const removerNovenaConcluida = (slug, dataCompletada) => {
    setNovenas(prev => ({
      ...prev,
      completadas: prev.completadas.filter(
        n => !(n.slug === slug && n.dataCompletada === dataCompletada)
      )
    }));
  };

  /**
   * Reiniciar uma novena completada
   * @param {string} slug - Slug da novena
   * @param {Object} novenaData - Dados completos da novena
   */
  const reiniciarNovena = (slug, novenaData) => {
    cancelarNovena(slug); // Remove se já estiver em progresso
    return iniciarNovena(novenaData);
  };

  /**
   * Calcular progresso da novena
   * @param {string} slug - Slug da novena
   * @returns {Object} Progresso { percentual, diasCompletados, diasRestantes }
   */
  const getProgresso = (slug) => {
    const novena = getNovenaEmProgresso(slug);
    if (!novena) return null;

    const diasCompletados = novena.diasCompletados.length;
    const diasRestantes = novena.duracao - diasCompletados;
    const percentual = Math.round((diasCompletados / novena.duracao) * 100);

    return {
      percentual,
      diasCompletados,
      diasRestantes,
      diaAtual: novena.diaAtual
    };
  };

  /**
   * Verificar se um dia está completado
   * @param {string} slug - Slug da novena
   * @param {number} dia - Número do dia
   * @returns {boolean}
   */
  const isDiaCompleto = (slug, dia) => {
    const novena = getNovenaEmProgresso(slug);
    return novena ? novena.diasCompletados.includes(dia) : false;
  };

  /**
   * Verificar se novena está completamente finalizada
   * @param {string} slug - Slug da novena
   * @returns {boolean}
   */
  const isNovenaCompleta = (slug) => {
    const novena = getNovenaEmProgresso(slug);
    if (!novena) return false;
    return novena.diasCompletados.length === novena.duracao;
  };

  /**
   * Obter histórico de novenas completadas de uma novena específica
   * @param {string} slug - Slug da novena
   * @returns {Array} Lista de vezes que a novena foi completada
   */
  const getHistoricoNovena = (slug) => {
    return novenas.completadas.filter(n => n.slug === slug);
  };

  /**
   * Obter estatísticas gerais
   * @returns {Object} Estatísticas
   */
  const getEstatisticas = () => {
    const totalEmProgresso = novenas.emProgresso.length;
    const totalCompletadas = novenas.completadas.length;

    // Contar quantas vezes cada novena foi completada
    const novenasCompletadasUnicas = {};
    novenas.completadas.forEach(n => {
      novenasCompletadasUnicas[n.slug] = (novenasCompletadasUnicas[n.slug] || 0) + 1;
    });

    return {
      totalEmProgresso,
      totalCompletadas,
      novenasCompletadasUnicas
    };
  };

  return {
    novenas,
    isLoaded,
    iniciarNovena,
    getNovenaEmProgresso,
    marcarDiaCompleto,
    desmarcarDiaCompleto,
    atualizarIntencao,
    completarNovena,
    cancelarNovena,
    removerNovenaConcluida,
    reiniciarNovena,
    getProgresso,
    isDiaCompleto,
    isNovenaCompleta,
    getHistoricoNovena,
    getEstatisticas
  };
}

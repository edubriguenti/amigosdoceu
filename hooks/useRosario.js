import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rosario-data';

export default function useRosario() {
  // Estado principal
  const [misterioAtual, setMisterioAtual] = useState(null); // gozosos, dolorosos, gloriosos, luminosos
  const [decadaAtual, setDecadaAtual] = useState(0); // 0-4
  const [passoAtual, setPassoAtual] = useState(0); // Posição atual no rosário
  const [emProgresso, setEmProgresso] = useState(false);
  const [pausado, setPausado] = useState(false);

  // Timer
  const [tempoInicio, setTempoInicio] = useState(null);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);

  // Estatísticas
  const [estatisticas, setEstatisticas] = useState({
    rosariosCompletos: 0,
    tempoTotal: 0, // em segundos
    ultimoRosario: null,
    porMisterio: {
      gozosos: 0,
      dolorosos: 0,
      gloriosos: 0,
      luminosos: 0
    }
  });

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        if (parsed.estatisticas) {
          setEstatisticas(parsed.estatisticas);
        }
        if (parsed.emProgresso) {
          setEmProgresso(parsed.emProgresso);
          setMisterioAtual(parsed.misterioAtual);
          setDecadaAtual(parsed.decadaAtual || 0);
          setPassoAtual(parsed.passoAtual || 0);
          setPausado(true); // Sempre retomar como pausado
          if (parsed.tempoDecorrido) {
            setTempoDecorrido(parsed.tempoDecorrido);
          }
        }
      } catch (e) {
        console.error('Erro ao carregar dados do rosário:', e);
      }
    }
  }, []);

  // Salvar progresso no localStorage
  useEffect(() => {
    const dados = {
      estatisticas,
      emProgresso,
      misterioAtual,
      decadaAtual,
      passoAtual,
      tempoDecorrido,
      pausado
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  }, [estatisticas, emProgresso, misterioAtual, decadaAtual, passoAtual, tempoDecorrido, pausado]);

  // Timer
  useEffect(() => {
    let intervalo;
    if (emProgresso && !pausado && tempoInicio) {
      intervalo = setInterval(() => {
        setTempoDecorrido(Math.floor((Date.now() - tempoInicio) / 1000));
      }, 1000);
    }
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [emProgresso, pausado, tempoInicio]);

  // Iniciar rosário com um mistério específico
  const iniciarRosario = useCallback((tipoMisterio) => {
    setMisterioAtual(tipoMisterio);
    setDecadaAtual(0);
    setPassoAtual(0);
    setEmProgresso(true);
    setPausado(false);
    setTempoInicio(Date.now());
    setTempoDecorrido(0);
  }, []);

  // Retomar rosário pausado
  const retomar = useCallback(() => {
    setPausado(false);
    setTempoInicio(Date.now() - (tempoDecorrido * 1000));
  }, [tempoDecorrido]);

  // Pausar rosário
  const pausar = useCallback(() => {
    setPausado(true);
  }, []);

  // Avançar para o próximo passo
  const avancar = useCallback(() => {
    setPassoAtual(prev => prev + 1);
  }, []);

  // Voltar para o passo anterior
  const voltar = useCallback(() => {
    setPassoAtual(prev => Math.max(0, prev - 1));
  }, []);

  // Ir para uma década específica
  const irParaDecada = useCallback((numeroDecada) => {
    setDecadaAtual(numeroDecada);
    // Calcular o passo inicial da década
    // Início: 7 passos (sinal, credo, pai nosso, 3 aves, glória)
    // Cada década: 13 passos (mistério, pai nosso, 10 aves, glória, fátima)
    const passoInicial = 7 + (numeroDecada * 13);
    setPassoAtual(passoInicial);
  }, []);

  // Completar rosário
  const completarRosario = useCallback(() => {
    if (!misterioAtual) return;

    // Atualizar estatísticas
    setEstatisticas(prev => ({
      rosariosCompletos: prev.rosariosCompletos + 1,
      tempoTotal: prev.tempoTotal + tempoDecorrido,
      ultimoRosario: new Date().toISOString(),
      porMisterio: {
        ...prev.porMisterio,
        [misterioAtual]: prev.porMisterio[misterioAtual] + 1
      }
    }));

    // Resetar estado
    setEmProgresso(false);
    setPausado(false);
    setMisterioAtual(null);
    setDecadaAtual(0);
    setPassoAtual(0);
    setTempoInicio(null);
    setTempoDecorrido(0);
  }, [misterioAtual, tempoDecorrido]);

  // Cancelar rosário
  const cancelar = useCallback(() => {
    setEmProgresso(false);
    setPausado(false);
    setMisterioAtual(null);
    setDecadaAtual(0);
    setPassoAtual(0);
    setTempoInicio(null);
    setTempoDecorrido(0);
  }, []);

  // Resetar estatísticas
  const resetarEstatisticas = useCallback(() => {
    setEstatisticas({
      rosariosCompletos: 0,
      tempoTotal: 0,
      ultimoRosario: null,
      porMisterio: {
        gozosos: 0,
        dolorosos: 0,
        gloriosos: 0,
        luminosos: 0
      }
    });
  }, []);

  // Obter mistério do dia baseado no dia da semana
  const getMisterioDoDia = useCallback(() => {
    const diasDaSemana = {
      0: 'gloriosos',    // Domingo
      1: 'gozosos',      // Segunda
      2: 'dolorosos',    // Terça
      3: 'gloriosos',    // Quarta
      4: 'luminosos',    // Quinta
      5: 'dolorosos',    // Sexta
      6: 'gozosos'       // Sábado
    };
    const hoje = new Date().getDay();
    return diasDaSemana[hoje];
  }, []);

  // Formatar tempo decorrido
  const formatarTempo = useCallback((segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  }, []);

  // Calcular porcentagem de progresso
  const calcularProgresso = useCallback(() => {
    // Total de passos: 7 (início) + 65 (5 décadas de 13) + 3 (final) = 75
    const totalPassos = 75;
    return Math.round((passoAtual / totalPassos) * 100);
  }, [passoAtual]);

  return {
    // Estado
    misterioAtual,
    decadaAtual,
    passoAtual,
    emProgresso,
    pausado,
    tempoDecorrido,
    estatisticas,

    // Ações
    iniciarRosario,
    retomar,
    pausar,
    avancar,
    voltar,
    irParaDecada,
    completarRosario,
    cancelar,
    resetarEstatisticas,

    // Utilidades
    getMisterioDoDia,
    formatarTempo,
    calcularProgresso
  };
}

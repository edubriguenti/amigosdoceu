import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRosario from '../hooks/useRosario';
import rosarioData from '../data/rosario.json';

export default function RosarioVirtual() {
  const {
    misterioAtual,
    decadaAtual,
    passoAtual,
    emProgresso,
    pausado,
    tempoDecorrido,
    estatisticas,
    iniciarRosario,
    retomar,
    pausar,
    avancar,
    voltar,
    irParaDecada,
    completarRosario,
    cancelar,
    resetarEstatisticas,
    getMisterioDoDia,
    formatarTempo,
    calcularProgresso
  } = useRosario();

  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(false);
  const [oracaoAtual, setOracaoAtual] = useState(null);

  // Calcular oração atual baseado no passo
  useEffect(() => {
    if (!emProgresso || !misterioAtual) return;

    const { oracoes, misterios, estruturaRosario } = rosarioData;
    const misteriosLista = misterios[misterioAtual].lista;

    // Estrutura completa do rosário
    let passos = [];

    // Início
    estruturaRosario.inicio.forEach(item => {
      if (item.tipo === 'oracao') {
        passos.push({
          tipo: 'oracao',
          oracao: oracoes[item.nome],
          conta: item.conta,
          intencao: item.intencao
        });
      }
    });

    // 5 Décadas
    for (let d = 0; d < 5; d++) {
      estruturaRosario.decada.forEach(item => {
        if (item.tipo === 'misterio') {
          passos.push({
            tipo: 'misterio',
            misterio: misteriosLista[d],
            decada: d
          });
        } else if (item.tipo === 'oracao') {
          if (item.repeticoes) {
            // 10 Ave Marias
            for (let i = 0; i < item.repeticoes; i++) {
              passos.push({
                tipo: 'oracao',
                oracao: oracoes[item.nome],
                conta: item.conta,
                aveMaria: i + 1,
                decada: d
              });
            }
          } else {
            passos.push({
              tipo: 'oracao',
              oracao: oracoes[item.nome],
              conta: item.conta,
              decada: d
            });
          }
        }
      });
    }

    // Final
    estruturaRosario.final.forEach(item => {
      if (item.tipo === 'oracao') {
        passos.push({
          tipo: 'oracao',
          oracao: oracoes[item.nome],
          conta: item.conta
        });
      }
    });

    // Definir oração atual
    if (passoAtual < passos.length) {
      setOracaoAtual(passos[passoAtual]);
    } else {
      // Rosário completo
      setOracaoAtual({ tipo: 'completo' });
    }
  }, [passoAtual, emProgresso, misterioAtual]);

  // Tela de seleção de mistério
  if (!emProgresso) {
    const misterioDoDia = getMisterioDoDia();

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12 -mx-4 md:-mx-6 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
              Rosário Virtual
            </h1>
            <p className="text-lg text-neutral-700">
              Reze o Santo Rosário com acompanhamento visual e espiritual
            </p>
          </motion.div>

          {/* Seleção de Mistério */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {Object.entries(rosarioData.misterios).map(([tipo, dados], index) => {
              const ehDoDia = tipo === misterioDoDia;

              return (
                <motion.button
                  key={tipo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => iniciarRosario(tipo)}
                  className={`relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left ${
                    ehDoDia ? 'ring-4 ring-accent-500' : ''
                  }`}
                  style={{ backgroundColor: dados.cor + '15', borderLeft: `6px solid ${dados.cor}` }}
                >
                  {ehDoDia && (
                    <span className="absolute top-4 right-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Hoje
                    </span>
                  )}
                  <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: dados.cor }}>
                    {dados.nome}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">{dados.dia}</p>
                  <ul className="space-y-1">
                    {dados.lista.slice(0, 2).map((mist, i) => (
                      <li key={i} className="text-sm text-neutral-700">
                        {mist.numero}. {mist.titulo}
                      </li>
                    ))}
                    <li className="text-sm text-neutral-500 italic">
                      e mais {dados.lista.length - 2} mistérios...
                    </li>
                  </ul>
                </motion.button>
              );
            })}
          </div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-neutral-900">
                Suas Estatísticas
              </h2>
              {estatisticas.rosariosCompletos > 0 && (
                <button
                  onClick={resetarEstatisticas}
                  className="text-sm text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Resetar
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  {estatisticas.rosariosCompletos}
                </div>
                <div className="text-sm text-neutral-600">Rosários Completos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  {Math.floor(estatisticas.tempoTotal / 60)}
                </div>
                <div className="text-sm text-neutral-600">Minutos em Oração</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  {estatisticas.porMisterio.gozosos + estatisticas.porMisterio.dolorosos +
                   estatisticas.porMisterio.gloriosos + estatisticas.porMisterio.luminosos}
                </div>
                <div className="text-sm text-neutral-600">Total de Mistérios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  {estatisticas.ultimoRosario
                    ? new Date(estatisticas.ultimoRosario).toLocaleDateString('pt-BR')
                    : '-'}
                </div>
                <div className="text-sm text-neutral-600">Último Rosário</div>
              </div>
            </div>

            {estatisticas.rosariosCompletos > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-700 mb-4">Por tipo de mistério</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(estatisticas.porMisterio).map(([tipo, count]) => (
                    <div key={tipo} className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: rosarioData.misterios[tipo].cor }}>
                        {count}
                      </div>
                      <div className="text-xs text-neutral-600 capitalize">{tipo}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Tela de rosário em progresso
  const misterioInfo = rosarioData.misterios[misterioAtual];
  const progresso = calcularProgresso();
  const estaCompleto = oracaoAtual?.tipo === 'completo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-8 -mx-4 md:-mx-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header com timer e progresso */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold" style={{ color: misterioInfo.cor }}>
                {misterioInfo.nome}
              </h2>
              <p className="text-sm text-neutral-600">{misterioInfo.dia}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent-600 mb-1">
                {formatarTempo(tempoDecorrido)}
              </div>
              <div className="text-sm text-neutral-600">Tempo de oração</div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: misterioInfo.cor }}
            />
          </div>
          <div className="text-center text-sm text-neutral-600 mt-2">
            {progresso}% completo
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Oração atual */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {estaCompleto ? (
                <motion.div
                  key="completo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center"
                >
                  <div className="text-6xl mb-4">🙏</div>
                  <h3 className="text-3xl font-serif font-bold text-accent-600 mb-4">
                    Rosário Completo!
                  </h3>
                  <p className="text-lg text-neutral-700 mb-2">
                    Você completou os {misterioInfo.nome}
                  </p>
                  <p className="text-neutral-600 mb-8">
                    Tempo total: {formatarTempo(tempoDecorrido)}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={completarRosario}
                      className="px-8 py-3 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 transition-colors"
                    >
                      Finalizar
                    </button>
                    <button
                      onClick={cancelar}
                      className="px-8 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-300 transition-colors"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </motion.div>
              ) : oracaoAtual?.tipo === 'misterio' ? (
                <motion.div
                  key={`misterio-${oracaoAtual.decada}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
                          style={{ backgroundColor: misterioInfo.cor + '20', color: misterioInfo.cor }}>
                      {oracaoAtual.decada + 1}ª Década
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-4 text-center">
                    {oracaoAtual.misterio.titulo}
                  </h3>
                  <div className="bg-primary-50 rounded-xl p-6 mb-6">
                    <p className="text-neutral-700 italic text-center">
                      {oracaoAtual.misterio.reflexao}
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-accent-600">
                      Fruto: {oracaoAtual.misterio.fruto}
                    </span>
                  </div>
                </motion.div>
              ) : oracaoAtual?.tipo === 'oracao' ? (
                <motion.div
                  key={`oracao-${passoAtual}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-serif font-bold text-neutral-900">
                      {oracaoAtual.oracao.nome}
                    </h3>
                    {oracaoAtual.aveMaria && (
                      <span className="text-lg font-semibold text-accent-600">
                        {oracaoAtual.aveMaria}/10
                      </span>
                    )}
                  </div>
                  {oracaoAtual.intencao && (
                    <div className="bg-accent-50 rounded-lg p-4 mb-6">
                      <p className="text-sm font-semibold text-accent-700">
                        Intenção: {oracaoAtual.intencao}
                      </p>
                    </div>
                  )}
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {oracaoAtual.oracao.texto}
                  </p>
                  {oracaoAtual.conta && (
                    <div className="mt-6 flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full ${
                        oracaoAtual.conta === 'cruz' ? 'bg-secondary-500' :
                        oracaoAtual.conta === 'grande' ? 'bg-accent-600' : 'bg-neutral-400'
                      }`} />
                      <span className="ml-2 text-sm text-neutral-600">
                        {oracaoAtual.conta === 'cruz' ? 'Crucifixo' :
                         oracaoAtual.conta === 'grande' ? 'Conta grande' : 'Conta pequena'}
                      </span>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Controles */}
            {!estaCompleto && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={voltar}
                    disabled={passoAtual === 0}
                    className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={pausado ? retomar : pausar}
                    className="p-4 rounded-xl bg-accent-600 hover:bg-accent-700 text-white transition-colors"
                  >
                    {pausado ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={avancar}
                    className="p-4 rounded-xl bg-accent-600 hover:bg-accent-700 text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Deseja realmente cancelar este rosário?')) {
                        cancelar();
                      }
                    }}
                    className="p-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar com mistérios */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-serif font-bold text-neutral-900 mb-4">
                Mistérios
              </h3>
              <div className="space-y-3">
                {misterioInfo.lista.map((mist, index) => (
                  <button
                    key={index}
                    onClick={() => irParaDecada(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      decadaAtual === index
                        ? 'ring-2 shadow-md'
                        : 'hover:bg-neutral-50'
                    }`}
                    style={decadaAtual === index ? {
                      backgroundColor: misterioInfo.cor + '15',
                      borderColor: misterioInfo.cor,
                      ringColor: misterioInfo.cor
                    } : {}}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        decadaAtual === index ? 'text-white' : 'text-white'
                      }`}
                      style={{ backgroundColor: misterioInfo.cor }}>
                        {mist.numero}
                      </span>
                      <span className="text-sm text-neutral-700 leading-tight">
                        {mist.titulo}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

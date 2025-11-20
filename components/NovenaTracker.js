import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useNovena from '../hooks/useNovena';

/**
 * Componente de acompanhamento de novena com progresso e dias
 * @param {Object} novena - Dados completos da novena
 */
export default function NovenaTracker({ novena }) {
  const {
    getNovenaEmProgresso,
    marcarDiaCompleto,
    desmarcarDiaCompleto,
    getProgresso,
    isDiaCompleto,
    completarNovena,
    isNovenaCompleta
  } = useNovena();

  const [diaExpandido, setDiaExpandido] = useState(null);
  const novenaEmProgresso = getNovenaEmProgresso(novena.slug);
  const progresso = getProgresso(novena.slug);

  if (!novenaEmProgresso) {
    return null;
  }

  const handleToggleDia = (numeroDia) => {
    if (isDiaCompleto(novena.slug, numeroDia)) {
      desmarcarDiaCompleto(novena.slug, numeroDia);
    } else {
      marcarDiaCompleto(novena.slug, numeroDia);
    }
  };

  const handleCompletarNovena = () => {
    if (confirm('Parabéns por completar a novena! Deseja movê-la para o histórico de completadas?')) {
      completarNovena(novena.slug);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Cabeçalho com progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-serif font-bold text-neutral-800">
            Seu Progresso
          </h3>
          <span className="text-accent-600 font-bold text-2xl">
            {progresso.percentual}%
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="w-full bg-primary-100 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progresso.percentual}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-accent-500 to-accent-600 h-full rounded-full"
          />
        </div>

        {/* Informações do progresso */}
        <div className="flex justify-between mt-3 text-sm text-neutral-600">
          <span>{progresso.diasCompletados} de {novena.duracao} dias completados</span>
          <span>{progresso.diasRestantes} dias restantes</span>
        </div>

        {/* Dia atual sugerido */}
        <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-200">
          <p className="text-sm text-accent-800">
            <strong>Próximo dia:</strong> Dia {progresso.diaAtual} - {novena.dias[progresso.diaAtual - 1]?.titulo}
          </p>
        </div>
      </div>

      {/* Lista de dias */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-neutral-800 mb-4">Dias da Novena</h4>

        {novena.dias.map((dia, index) => {
          const numeroDia = dia.dia;
          const completo = isDiaCompleto(novena.slug, numeroDia);
          const expandido = diaExpandido === numeroDia;

          return (
            <div
              key={numeroDia}
              className={`border rounded-lg overflow-hidden transition-all ${
                completo
                  ? 'border-accent-300 bg-accent-50'
                  : 'border-primary-200 bg-white'
              }`}
            >
              {/* Cabeçalho do dia */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleDia(numeroDia)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      completo
                        ? 'bg-accent-500 border-accent-500'
                        : 'bg-white border-neutral-300 hover:border-accent-400'
                    }`}
                  >
                    {completo && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    )}
                  </button>

                  {/* Título do dia */}
                  <div className="flex-1">
                    <h5 className={`font-semibold ${completo ? 'text-accent-800' : 'text-neutral-800'}`}>
                      Dia {numeroDia}: {dia.titulo}
                    </h5>
                    {dia.intencao && (
                      <p className="text-sm text-neutral-600 mt-1">
                        Intenção: {dia.intencao}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão expandir */}
                <button
                  onClick={() => setDiaExpandido(expandido ? null : numeroDia)}
                  className="ml-4 p-2 hover:bg-primary-100 rounded-full transition-colors"
                >
                  <motion.svg
                    animate={{ rotate: expandido ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
              </div>

              {/* Conteúdo expandido */}
              <AnimatePresence>
                {expandido && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-primary-200 pt-4 space-y-4">
                      {/* Leitura */}
                      {dia.leitura && (
                        <div>
                          <h6 className="font-semibold text-sm text-neutral-700 mb-1">
                            📖 Leitura:
                          </h6>
                          <p className="text-sm text-neutral-600">{dia.leitura}</p>
                        </div>
                      )}

                      {/* Meditação */}
                      {dia.meditacao && (
                        <div>
                          <h6 className="font-semibold text-sm text-neutral-700 mb-1">
                            🙏 Meditação:
                          </h6>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {dia.meditacao}
                          </p>
                        </div>
                      )}

                      {/* Oração */}
                      {dia.oracao && (
                        <div>
                          <h6 className="font-semibold text-sm text-neutral-700 mb-1">
                            ✝️ Oração do Dia:
                          </h6>
                          <p className="text-sm text-neutral-700 leading-relaxed italic bg-primary-50 p-3 rounded">
                            {dia.oracao}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Botão de completar novena */}
      {isNovenaCompleta(novena.slug) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg text-center"
        >
          <p className="text-white font-semibold mb-3">
            🎉 Parabéns! Você completou toda a novena!
          </p>
          <button
            onClick={handleCompletarNovena}
            className="bg-white text-accent-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Finalizar Novena
          </button>
        </motion.div>
      )}
    </div>
  );
}

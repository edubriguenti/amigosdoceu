import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIAS = [
  'Todas',
  'Saúde',
  'Família',
  'Trabalho',
  'Estudos',
  'Relacionamentos',
  'Conversão',
  'Agradecimento',
  'Outras'
];

const STORAGE_KEY = 'amigos-do-ceu-intencoes';

/**
 * Componente para gerenciar intenções de oração
 */
export default function IntencoesOracao() {
  const [intencoes, setIntencoes] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [novaIntencao, setNovaIntencao] = useState({
    texto: '',
    categoria: 'Saúde',
    anonima: false,
    nome: ''
  });

  // Carregar intenções
  useEffect(() => {
    const carregarIntencoes = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setIntencoes(data);
        }
      } catch (error) {
        console.error('Erro ao carregar intenções:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    carregarIntencoes();
  }, []);

  // Salvar intenções
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(intencoes));
      } catch (error) {
        console.error('Erro ao salvar intenções:', error);
      }
    }
  }, [intencoes, isLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!novaIntencao.texto.trim()) {
      alert('Por favor, escreva sua intenção de oração.');
      return;
    }

    const intencao = {
      id: Date.now(),
      texto: novaIntencao.texto.trim(),
      categoria: novaIntencao.categoria,
      anonima: novaIntencao.anonima,
      nome: novaIntencao.anonima ? 'Anônimo' : novaIntencao.nome.trim() || 'Anônimo',
      data: new Date().toISOString(),
      oracoes: 0,
      minhasOracoes: []
    };

    setIntencoes(prev => [intencao, ...prev]);

    // Resetar formulário
    setNovaIntencao({
      texto: '',
      categoria: 'Saúde',
      anonima: false,
      nome: ''
    });
    setMostrarFormulario(false);
  };

  const handleOrar = (id) => {
    setIntencoes(prev =>
      prev.map(intencao => {
        if (intencao.id === id) {
          const jaOrou = intencao.minhasOracoes?.includes('user');

          if (jaOrou) {
            // Remove a oração
            return {
              ...intencao,
              oracoes: Math.max(0, intencao.oracoes - 1),
              minhasOracoes: intencao.minhasOracoes.filter(u => u !== 'user')
            };
          } else {
            // Adiciona a oração
            return {
              ...intencao,
              oracoes: intencao.oracoes + 1,
              minhasOracoes: [...(intencao.minhasOracoes || []), 'user']
            };
          }
        }
        return intencao;
      })
    );
  };

  const intencoesFiltradas = intencoes.filter(intencao =>
    categoriaFiltro === 'Todas' || intencao.categoria === categoriaFiltro
  );

  const formatarData = (isoString) => {
    const data = new Date(isoString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMinutos = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMinutos < 1) return 'Agora mesmo';
    if (diffMinutos < 60) return `${diffMinutos} min atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias < 7) return `${diffDias}d atrás`;

    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-3xl font-serif font-bold text-neutral-800 mb-3">
          Intenções de Oração
        </h2>
        <p className="text-neutral-600 mb-4">
          Compartilhe suas intenções de oração e una-se em oração pelos pedidos dos outros.
        </p>

        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors font-medium"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Adicionar Intenção'}
        </button>
      </div>

      {/* Formulário */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-hidden"
          >
            <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">
              Nova Intenção
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Texto da intenção */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sua Intenção de Oração *
                </label>
                <textarea
                  value={novaIntencao.texto}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, texto: e.target.value })}
                  placeholder="Escreva sua intenção de oração..."
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Categoria
                </label>
                <select
                  value={novaIntencao.categoria}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, categoria: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  {CATEGORIAS.filter(c => c !== 'Todas').map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Seu Nome (opcional)
                </label>
                <input
                  type="text"
                  value={novaIntencao.nome}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, nome: e.target.value })}
                  placeholder="Digite seu nome"
                  disabled={novaIntencao.anonima}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-neutral-100"
                />
              </div>

              {/* Checkbox anônimo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonima"
                  checked={novaIntencao.anonima}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, anonima: e.target.checked })}
                  className="w-4 h-4 text-accent-600 border-neutral-300 rounded focus:ring-accent-500"
                />
                <label htmlFor="anonima" className="ml-2 text-sm text-neutral-700">
                  Publicar como anônimo
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors font-medium"
                >
                  Publicar Intenção
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-neutral-200 text-neutral-700 px-6 py-2 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoriaFiltro === categoria
                  ? 'bg-accent-500 text-white'
                  : 'bg-primary-100 text-neutral-700 hover:bg-primary-200'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de intenções */}
      <div className="space-y-4">
        {intencoesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-neutral-600">
              {categoriaFiltro === 'Todas'
                ? 'Nenhuma intenção de oração publicada ainda. Seja o primeiro!'
                : `Nenhuma intenção na categoria "${categoriaFiltro}".`}
            </p>
          </div>
        ) : (
          intencoesFiltradas.map((intencao, index) => {
            const jaOrou = intencao.minhasOracoes?.includes('user');

            return (
              <motion.div
                key={intencao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-800">
                        {intencao.nome}
                      </span>
                      <span className="text-xs text-neutral-500">
                        • {formatarData(intencao.data)}
                      </span>
                    </div>
                    <span className="inline-block bg-accent-100 text-accent-700 text-xs px-2 py-1 rounded">
                      {intencao.categoria}
                    </span>
                  </div>
                </div>

                {/* Texto da intenção */}
                <p className="text-neutral-700 leading-relaxed mb-4">
                  {intencao.texto}
                </p>

                {/* Botão de orar */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOrar(intencao.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      jaOrou
                        ? 'bg-accent-500 text-white hover:bg-accent-600'
                        : 'bg-primary-100 text-neutral-700 hover:bg-primary-200'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {jaOrou ? 'Estou orando' : 'Orar por isso'}
                  </button>

                  {intencao.oracoes > 0 && (
                    <span className="text-sm text-neutral-600">
                      {intencao.oracoes} {intencao.oracoes === 1 ? 'pessoa está' : 'pessoas estão'} orando
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

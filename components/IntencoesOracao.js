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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setIntencoes(JSON.parse(saved));
    } catch {}
    finally { setIsLoaded(true); }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(intencoes)); } catch {}
    }
  }, [intencoes, isLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novaIntencao.texto.trim()) { alert('Por favor, escreva sua intenção de oração.'); return; }

    setIntencoes(prev => [{
      id: Date.now(),
      texto: novaIntencao.texto.trim(),
      categoria: novaIntencao.categoria,
      anonima: novaIntencao.anonima,
      nome: novaIntencao.anonima ? 'Anônimo' : novaIntencao.nome.trim() || 'Anônimo',
      data: new Date().toISOString(),
      oracoes: 0,
      minhasOracoes: []
    }, ...prev]);

    setNovaIntencao({ texto: '', categoria: 'Saúde', anonima: false, nome: '' });
    setMostrarFormulario(false);
  };

  const handleOrar = (id) => {
    setIntencoes(prev => prev.map(intencao => {
      if (intencao.id !== id) return intencao;
      const jaOrou = intencao.minhasOracoes?.includes('user');
      return jaOrou
        ? { ...intencao, oracoes: Math.max(0, intencao.oracoes - 1), minhasOracoes: intencao.minhasOracoes.filter(u => u !== 'user') }
        : { ...intencao, oracoes: intencao.oracoes + 1, minhasOracoes: [...(intencao.minhasOracoes || []), 'user'] };
    }));
  };

  const intencoesFiltradas = intencoes.filter(i => categoriaFiltro === 'Todas' || i.categoria === categoriaFiltro);

  const formatarData = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const min = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (min < 1) return 'Agora mesmo';
    if (min < 60) return `${min} min atrás`;
    if (h < 24) return `${h}h atrás`;
    if (d < 7) return `${d}d atrás`;
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  const inputClass = "w-full px-4 py-2 bg-cosmic-bg border border-cosmic-border rounded-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-cosmic-blue focus:border-transparent outline-none transition";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="bg-cosmic-surface/60 border border-cosmic-border rounded-xl p-6 mb-6">
        <h2 className="text-3xl font-serif font-bold text-neutral-100 mb-3">
          Intenções de Oração
        </h2>
        <p className="text-neutral-400 mb-4">
          Compartilhe suas intenções de oração e una-se em oração pelos pedidos dos outros.
        </p>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-cosmic-blue text-white px-6 py-2 rounded-lg hover:bg-cosmic-blue/80 transition-colors font-medium"
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
            className="bg-cosmic-surface/60 border border-cosmic-border rounded-xl p-6 mb-6 overflow-hidden"
          >
            <h3 className="text-xl font-serif font-bold text-neutral-100 mb-4">
              Nova Intenção
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Sua Intenção de Oração *
                </label>
                <textarea
                  value={novaIntencao.texto}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, texto: e.target.value })}
                  placeholder="Escreva sua intenção de oração..."
                  rows={4}
                  className={inputClass + " resize-none"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Categoria
                </label>
                <select
                  value={novaIntencao.categoria}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, categoria: e.target.value })}
                  className={inputClass}
                >
                  {CATEGORIAS.filter(c => c !== 'Todas').map(categoria => (
                    <option key={categoria} value={categoria} className="bg-cosmic-bg">
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Seu Nome (opcional)
                </label>
                <input
                  type="text"
                  value={novaIntencao.nome}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, nome: e.target.value })}
                  placeholder="Digite seu nome"
                  disabled={novaIntencao.anonima}
                  className={inputClass + " disabled:opacity-40 disabled:cursor-not-allowed"}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonima"
                  checked={novaIntencao.anonima}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, anonima: e.target.checked })}
                  className="w-4 h-4 accent-cosmic-blue border-cosmic-border rounded"
                />
                <label htmlFor="anonima" className="ml-2 text-sm text-neutral-300">
                  Publicar como anônimo
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-cosmic-blue text-white px-6 py-2 rounded-lg hover:bg-cosmic-blue/80 transition-colors font-medium"
                >
                  Publicar Intenção
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-cosmic-surface-2 text-neutral-300 px-6 py-2 rounded-lg hover:bg-cosmic-surface border border-cosmic-border transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros */}
      <div className="bg-cosmic-surface/60 border border-cosmic-border rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoriaFiltro === categoria
                  ? 'bg-cosmic-blue text-white'
                  : 'bg-cosmic-surface-2 text-neutral-300 hover:bg-cosmic-surface border border-cosmic-border'
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
          <div className="bg-cosmic-surface/60 border border-cosmic-border rounded-xl p-8 text-center">
            <p className="text-neutral-400">
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
                className="bg-cosmic-surface/60 border border-cosmic-border rounded-xl p-6 hover:border-cosmic-blue/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-100">{intencao.nome}</span>
                      <span className="text-xs text-neutral-500">• {formatarData(intencao.data)}</span>
                    </div>
                    <span className="inline-block bg-cosmic-blue/20 text-cosmic-blue-light text-xs px-2 py-1 rounded border border-cosmic-blue/20">
                      {intencao.categoria}
                    </span>
                  </div>
                </div>

                <p className="text-neutral-300 leading-relaxed mb-4">{intencao.texto}</p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOrar(intencao.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      jaOrou
                        ? 'bg-cosmic-gold text-cosmic-bg hover:bg-cosmic-gold/80'
                        : 'bg-cosmic-surface-2 text-neutral-300 hover:bg-cosmic-surface border border-cosmic-border'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {jaOrou ? 'Estou orando' : 'Orar por isso'}
                  </button>
                  {intencao.oracoes > 0 && (
                    <span className="text-sm text-neutral-500">
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

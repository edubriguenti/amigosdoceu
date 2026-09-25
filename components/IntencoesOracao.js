import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { diaLocal } from '../lib/datas';
// Intenções são pessoais e ficam só neste navegador (lidas também por Minha Jornada).
import { INTENCOES_KEY as STORAGE_KEY } from '../lib/jornada';

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

/**
 * Formato atual: { id, texto, categoria, data, vezes, ultimaVez, atendida }.
 * Dados antigos (versão "comunitária") tinham `oracoes`/`nome`/`anonima`: `oracoes`
 * vira `vezes`; nome/anônimo são ignorados.
 */
function normalizarIntencao(i) {
  return {
    id: i.id,
    texto: i.texto,
    categoria: i.categoria || 'Outras',
    data: i.data,
    vezes: Number.isFinite(i.vezes) ? i.vezes : Number(i.oracoes) || 0,
    ultimaVez: i.ultimaVez || null,
    atendida: Boolean(i.atendida),
  };
}

export default function IntencoesOracao() {
  const [intencoes, setIntencoes] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [removendo, setRemovendo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [novaIntencao, setNovaIntencao] = useState({ texto: '', categoria: 'Saúde' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lista = saved ? JSON.parse(saved) : [];
      if (Array.isArray(lista)) setIntencoes(lista.filter((i) => i && i.texto).map(normalizarIntencao));
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
    if (!novaIntencao.texto.trim()) return;

    setIntencoes(prev => [{
      id: Date.now(),
      texto: novaIntencao.texto.trim(),
      categoria: novaIntencao.categoria,
      data: new Date().toISOString(),
      vezes: 0,
      ultimaVez: null,
      atendida: false,
    }, ...prev]);

    setNovaIntencao({ texto: '', categoria: 'Saúde' });
    setMostrarFormulario(false);
  };

  // Um registro por dia: "Rezei por isto" hoje. Tocar de novo no mesmo dia desfaz.
  const handleRezei = (id) => {
    const hoje = diaLocal();
    setIntencoes(prev => prev.map(i => {
      if (i.id !== id) return i;
      return i.ultimaVez === hoje
        ? { ...i, vezes: Math.max(0, i.vezes - 1), ultimaVez: null }
        : { ...i, vezes: i.vezes + 1, ultimaVez: hoje };
    }));
  };

  const handleAtendida = (id) => {
    setIntencoes(prev => prev.map(i => (i.id === id ? { ...i, atendida: !i.atendida } : i)));
  };

  const handleRemover = (id) => {
    setIntencoes(prev => prev.filter(i => i.id !== id));
    setRemovendo(null);
  };

  const intencoesFiltradas = intencoes.filter(i => categoriaFiltro === 'Todas' || i.categoria === categoriaFiltro);
  const hoje = isLoaded ? diaLocal() : null;

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
          Minhas intenções
        </h2>
        <p className="text-neutral-400 mb-4">
          Anote pelo que você está rezando e marque cada dia em que rezou por isso.
        </p>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-cosmic-blue text-white px-6 py-2 rounded-lg hover:bg-cosmic-blue/80 transition-colors font-medium"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nova intenção'}
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
              Nova intenção
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="intencao-texto" className="block text-sm font-medium text-neutral-300 mb-2">
                  Pelo que você quer rezar? *
                </label>
                <textarea
                  id="intencao-texto"
                  value={novaIntencao.texto}
                  onChange={(e) => setNovaIntencao({ ...novaIntencao, texto: e.target.value })}
                  placeholder="Ex.: pela saúde da minha mãe"
                  rows={4}
                  className={inputClass + " resize-none"}
                  required
                />
              </div>
              <div>
                <label htmlFor="intencao-categoria" className="block text-sm font-medium text-neutral-300 mb-2">
                  Categoria
                </label>
                <select
                  id="intencao-categoria"
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
              <p className="text-xs text-neutral-500">
                🔒 Fica guardada só neste navegador. Ninguém mais vê.
              </p>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-cosmic-blue text-white px-6 py-2 rounded-lg hover:bg-cosmic-blue/80 transition-colors font-medium"
                >
                  Guardar intenção
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
                ? 'Você ainda não anotou nenhuma intenção. Comece por aquilo que está no seu coração hoje.'
                : `Nenhuma intenção na categoria "${categoriaFiltro}".`}
            </p>
          </div>
        ) : (
          intencoesFiltradas.map((intencao, index) => {
            const rezouHoje = intencao.ultimaVez === hoje;
            return (
              <motion.div
                key={intencao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-cosmic-surface/60 border rounded-xl p-6 transition-colors ${
                  intencao.atendida ? 'border-cosmic-gold/40' : 'border-cosmic-border hover:border-cosmic-blue/30'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-block bg-cosmic-blue/20 text-cosmic-blue-light text-xs px-2 py-1 rounded border border-cosmic-blue/20">
                    {intencao.categoria}
                  </span>
                  {intencao.atendida && (
                    <span className="inline-block bg-cosmic-gold/15 text-cosmic-gold text-xs px-2 py-1 rounded border border-cosmic-gold/30">
                      🙌 Graça alcançada
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">{formatarData(intencao.data)}</span>
                </div>

                <p className="text-neutral-200 leading-relaxed mb-4">{intencao.texto}</p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleRezei(intencao.id)}
                    aria-pressed={rezouHoje}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      rezouHoje
                        ? 'bg-cosmic-gold text-cosmic-bg hover:bg-cosmic-gold/80'
                        : 'bg-cosmic-surface-2 text-neutral-300 hover:bg-cosmic-surface border border-cosmic-border'
                    }`}
                  >
                    🙏 {rezouHoje ? 'Rezei hoje' : 'Rezei por isto'}
                  </button>
                  {intencao.vezes > 0 && (
                    <span className="text-sm text-neutral-500">
                      {intencao.vezes} {intencao.vezes === 1 ? 'vez' : 'vezes'}
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-3 text-sm">
                    <button
                      onClick={() => handleAtendida(intencao.id)}
                      className="text-neutral-400 hover:text-cosmic-gold transition-colors"
                    >
                      {intencao.atendida ? 'Desmarcar graça' : 'Graça alcançada'}
                    </button>
                    {removendo === intencao.id ? (
                      <span className="flex items-center gap-2">
                        <span className="text-neutral-400">Remover?</span>
                        <button onClick={() => handleRemover(intencao.id)} className="text-red-400 hover:text-red-300 font-medium">Sim</button>
                        <button onClick={() => setRemovendo(null)} className="text-neutral-400 hover:text-neutral-200">Não</button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setRemovendo(intencao.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

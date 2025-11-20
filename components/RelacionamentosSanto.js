import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodosRelacionamentos, getRelacionamentosAgrupados, TIPOS_RELACIONAMENTO } from '../lib/relacionamentosUtils';

/**
 * RelacionamentosSanto Component
 * Displays relationships between saints with filtering and visual organization
 */
export default function RelacionamentosSanto({ santoSlug, santosData }) {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [visualizacao, setVisualizacao] = useState('lista'); // 'lista' ou 'agrupado'

  // Get all relationships (direct and inverse)
  const todosRelacionamentos = getTodosRelacionamentos(santoSlug, santosData);
  const relacionamentosAgrupados = getRelacionamentosAgrupados(santoSlug, santosData);

  // If no relationships, don't render anything
  if (todosRelacionamentos.length === 0) {
    return null;
  }

  // Filter relationships by type
  const relacionamentosFiltrados = filtroTipo === 'todos'
    ? todosRelacionamentos
    : todosRelacionamentos.filter(rel => rel.tipo === filtroTipo);

  // Get unique relationship types from current relationships
  const tiposDisponiveis = [...new Set(todosRelacionamentos.map(rel => rel.tipo))];

  return (
    <section className="mt-12 bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-lg shadow-sm">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-2">
            Santos Relacionados
          </h2>
          <p className="text-neutral-600">
            Descubra conexões espirituais, históricas e teológicas entre os santos
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setVisualizacao('lista')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'lista'
                  ? 'bg-accent-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setVisualizacao('agrupado')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'agrupado'
                  ? 'bg-accent-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Agrupado
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="todos">Todos os tipos ({todosRelacionamentos.length})</option>
              {tiposDisponiveis.map(tipo => {
                const tipoInfo = TIPOS_RELACIONAMENTO[tipo];
                const count = todosRelacionamentos.filter(rel => rel.tipo === tipo).length;
                return (
                  <option key={tipo} value={tipo}>
                    {tipoInfo?.icon || '🔗'} {tipoInfo?.label || tipo} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {visualizacao === 'lista' ? (
            <motion.div
              key="lista"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ListaRelacionamentos relacionamentos={relacionamentosFiltrados} />
            </motion.div>
          ) : (
            <motion.div
              key="agrupado"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VisualizacaoAgrupada
                grupos={relacionamentosAgrupados}
                filtroTipo={filtroTipo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Lista de relacionamentos (view mode)
 */
function ListaRelacionamentos({ relacionamentos }) {
  if (relacionamentos.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Nenhum relacionamento encontrado com este filtro.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {relacionamentos.map((rel, index) => (
        <motion.div
          key={`${rel.santo?.slug}-${index}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <SantoRelacionadoCard relacionamento={rel} />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Visualização agrupada por tipo de relacionamento
 */
function VisualizacaoAgrupada({ grupos, filtroTipo }) {
  const gruposFiltrados = filtroTipo === 'todos'
    ? grupos
    : grupos.filter(g => g.tipo === filtroTipo);

  if (gruposFiltrados.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Nenhum relacionamento encontrado com este filtro.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {gruposFiltrados.map((grupo, index) => (
        <motion.div
          key={grupo.tipo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">{grupo.tipoInfo.icon}</span>
            {grupo.tipoInfo.label}
            <span className="text-sm font-normal text-neutral-500">
              ({grupo.santos.length})
            </span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grupo.santos.map((santo) => (
              <SantoMiniCard key={santo.slug} santo={santo} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Card de santo relacionado (full)
 */
function SantoRelacionadoCard({ relacionamento }) {
  const { santo, tipoInfo, descricao } = relacionamento;

  if (!santo) return null;

  const corClasses = {
    accent: 'border-accent-200 bg-accent-50',
    secondary: 'border-secondary-200 bg-secondary-50',
    primary: 'border-primary-200 bg-primary-50',
    neutral: 'border-neutral-200 bg-neutral-50'
  };

  return (
    <Link href={`/santos/${santo.slug}`}>
      <div className={`h-full border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        corClasses[tipoInfo.cor] || corClasses.neutral
      }`}>
        <div className="flex h-full">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={santo.imagem}
              alt={santo.nome}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2 mb-1">
                <span className="text-lg">{tipoInfo.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 text-sm leading-tight mb-1 group-hover:text-accent-600 transition-colors">
                    {santo.nome}
                  </h4>
                  <p className="text-xs text-neutral-600 mb-1">{tipoInfo.label}</p>
                </div>
              </div>
              {descricao && (
                <p className="text-xs text-neutral-700 line-clamp-2 mt-2">
                  {descricao}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex gap-2 mt-2 text-xs text-neutral-500">
              {santo.periodo && (
                <span className="bg-white px-2 py-0.5 rounded">
                  {santo.periodo}
                </span>
              )}
              {santo.ordemReligiosa && (
                <span className="bg-white px-2 py-0.5 rounded truncate">
                  {santo.ordemReligiosa}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Mini card de santo (para visualização agrupada)
 */
function SantoMiniCard({ santo }) {
  return (
    <Link href={`/santos/${santo.slug}`}>
      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group border border-neutral-100">
        <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={santo.imagem}
            alt={santo.nome}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-sm text-neutral-900 group-hover:text-accent-600 transition-colors truncate">
            {santo.nome}
          </h5>
          {santo.descricaoRelacao && (
            <p className="text-xs text-neutral-600 line-clamp-1">
              {santo.descricaoRelacao}
            </p>
          )}
          {santo.periodo && (
            <p className="text-xs text-neutral-500">{santo.periodo}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

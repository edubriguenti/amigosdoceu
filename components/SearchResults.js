import { motion } from 'framer-motion';

export default function SearchResults({
  count,
  totalCount,
  sortBy,
  onSortChange,
  sortOptions,
  children,
  emptyMessage = "Nenhum resultado encontrado"
}) {
  return (
    <div className="space-y-6">
      {/* Barra de controle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {/* Contador de resultados */}
        <div className="text-sm text-gray-600">
          {count > 0 ? (
            <>
              Mostrando <span className="font-semibold text-gray-900">{count}</span>
              {count !== totalCount && ` de ${totalCount}`}
              {` ${count === 1 ? 'resultado' : 'resultados'}`}
            </>
          ) : (
            <span className="text-gray-500">Nenhum resultado</span>
          )}
        </div>

        {/* Ordenação */}
        {count > 0 && sortOptions && (
          <div className="flex items-center space-x-3">
            <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap">
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       bg-white text-gray-700 cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Resultados ou mensagem vazia */}
      {count > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-sm text-gray-500">
            Tente ajustar sua busca ou limpar os filtros
          </p>
        </motion.div>
      )}
    </div>
  );
}

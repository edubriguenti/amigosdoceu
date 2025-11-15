import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterPanel({
  filters,
  onFilterChange,
  availableFilters,
  resultCount,
  onClearFilters,
  hasActiveFilters
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = (filterKey, value) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange(filterKey, newValues);
  };

  const isFilterActive = (filterKey, value) => {
    return filters[filterKey]?.includes(value) || false;
  };

  const toggleBooleanFilter = (filterKey) => {
    const currentValue = filters[filterKey];
    onFilterChange(filterKey, currentValue === undefined ? true : undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header do painel */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-semibold text-gray-800">Filtros</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Ativos
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Conteúdo dos filtros */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200"
          >
            <div className="p-6 space-y-6">
              {/* Renderizar filtros do tipo array (checkboxes) */}
              {availableFilters.map(filter => {
                if (filter.type === 'checkbox') {
                  return (
                    <div key={filter.key} className="space-y-3">
                      <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                        {filter.label}
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filter.options.map(option => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isFilterActive(filter.key, option)}
                              onChange={() => toggleFilter(filter.key, option)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (filter.type === 'boolean') {
                  return (
                    <div key={filter.key} className="space-y-3">
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={filters[filter.key] === true}
                          onChange={() => toggleBooleanFilter(filter.key)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">{filter.label}</span>
                      </label>
                    </div>
                  );
                }

                return null;
              })}

              {/* Botão limpar filtros */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={onClearFilters}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Limpar Filtros
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

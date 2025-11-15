import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar({ query, onQueryChange, placeholder = "Buscar..." }) {
  const [localQuery, setLocalQuery] = useState(query);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setIsSearching(true);

    // Limpar timeout anterior
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Criar novo timeout para debounce de 300ms
    debounceTimeout.current = setTimeout(() => {
      onQueryChange(value);
      setIsSearching(false);
    }, 300);
  };

  const handleClear = () => {
    setLocalQuery('');
    onQueryChange('');
    setIsSearching(false);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      <div className="relative">
        {/* Ícone de busca */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className={`w-5 h-5 transition-colors ${isSearching ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input de busca */}
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg
                   focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                   transition-all duration-200 text-gray-700 placeholder-gray-400"
        />

        {/* Botão de limpar */}
        {localQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpar busca"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Indicador de busca */}
      {isSearching && (
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}

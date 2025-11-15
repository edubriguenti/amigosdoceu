import { useState, useMemo } from 'react';
import {
  searchSaints,
  searchChurches,
  filterSaints,
  filterChurches,
  sortSaints,
  sortChurches
} from '../lib/searchUtils';

export function useSearch(data, type = 'saints', initialFilters = {}) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('nome');

  const results = useMemo(() => {
    let filtered = data;

    // Aplicar busca
    if (type === 'saints') {
      filtered = searchSaints(filtered, query);
      filtered = filterSaints(filtered, filters);
      filtered = sortSaints(filtered, sortBy);
    } else if (type === 'churches') {
      filtered = searchChurches(filtered, query);
      filtered = filterChurches(filtered, filters);
      filtered = sortChurches(filtered, sortBy);
    }

    return filtered;
  }, [data, query, filters, sortBy, type]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setQuery('');
  };

  const hasActiveFilters = () => {
    return query !== '' || Object.keys(filters).some(key => {
      const value = filters[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    });
  };

  return {
    query,
    setQuery,
    filters,
    setFilters,
    updateFilter,
    sortBy,
    setSortBy,
    results,
    count: results.length,
    clearFilters,
    hasActiveFilters: hasActiveFilters()
  };
}

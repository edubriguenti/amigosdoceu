import Layout from '../../components/Layout'
import ChurchGallery from '../../components/ChurchGallery'
import SearchBar from '../../components/SearchBar'
import FilterPanel from '../../components/FilterPanel'
import SearchResults from '../../components/SearchResults'
import { useSearch } from '../../hooks/useSearch'
import { getUniqueValues } from '../../lib/searchUtils'
import churches from '../../data/igrejas.json'
import { motion } from 'framer-motion'

export default function IgrejasPage() {
  const {
    query,
    setQuery,
    filters,
    updateFilter,
    sortBy,
    setSortBy,
    results,
    count,
    clearFilters,
    hasActiveFilters
  } = useSearch(churches, 'churches');

  // Extrair valores únicos para os filtros
  const availableFilters = [
    {
      key: 'paises',
      label: 'País',
      type: 'checkbox',
      options: getUniqueValues(churches, 'pais').filter(Boolean)
    },
    {
      key: 'tipos',
      label: 'Tipo',
      type: 'checkbox',
      options: getUniqueValues(churches, 'tipo').filter(Boolean)
    },
    {
      key: 'estilos',
      label: 'Estilo Arquitetônico',
      type: 'checkbox',
      options: getUniqueValues(churches, 'estiloArquitetonico').filter(Boolean)
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'checkbox',
      options: getUniqueValues(churches, 'tags').filter(Boolean)
    }
  ];

  const sortOptions = [
    { value: 'nome', label: 'Nome (A-Z)' },
    { value: 'nome-desc', label: 'Nome (Z-A)' },
    { value: 'capacidade', label: 'Capacidade (Maior)' },
    { value: 'capacidade-asc', label: 'Capacidade (Menor)' },
    { value: 'ano', label: 'Ano (Mais Antiga)' },
    { value: 'ano-desc', label: 'Ano (Mais Recente)' }
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-12">
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl font-serif mb-4">Igrejas e Paróquias</h1>
            <p className="text-lg text-gray-700">
              Descubra os templos mais importantes e sagrados do cristianismo ao redor do mundo.
              Desde basílicas milenares até santuários de peregrinação, cada igreja conta uma
              história única de fé, arte e devoção que atravessou gerações.
            </p>
          </div>

          {/* Barra de busca */}
          <div className="mb-6">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              placeholder="Buscar igrejas por nome, país, estilo arquitetônico..."
            />
          </div>

          {/* Painel de filtros */}
          <div className="mb-8">
            <FilterPanel
              filters={filters}
              onFilterChange={updateFilter}
              availableFilters={availableFilters}
              resultCount={count}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Resultados */}
          <SearchResults
            count={count}
            totalCount={churches.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            emptyMessage="Nenhuma igreja encontrada"
          >
            <ChurchGallery churches={results} />
          </SearchResults>
        </section>
      </motion.div>
    </Layout>
  )
}

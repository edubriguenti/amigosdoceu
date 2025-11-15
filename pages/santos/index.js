import Layout from '../../components/Layout'
import Gallery from '../../components/Gallery'
import SearchBar from '../../components/SearchBar'
import FilterPanel from '../../components/FilterPanel'
import SearchResults from '../../components/SearchResults'
import { useSearch } from '../../hooks/useSearch'
import { getUniqueValues } from '../../lib/searchUtils'
import saints from '../../data/santos.json'
import { motion } from 'framer-motion'

export default function SantosPage() {
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
  } = useSearch(saints, 'saints');

  // Extrair valores únicos para os filtros
  const availableFilters = [
    {
      key: 'paises',
      label: 'País',
      type: 'checkbox',
      options: getUniqueValues(saints, 'pais').filter(Boolean)
    },
    {
      key: 'periodos',
      label: 'Período',
      type: 'checkbox',
      options: getUniqueValues(saints, 'periodo').filter(Boolean)
    },
    {
      key: 'ordensReligiosas',
      label: 'Ordem Religiosa',
      type: 'checkbox',
      options: getUniqueValues(saints, 'ordemReligiosa').filter(Boolean)
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'checkbox',
      options: getUniqueValues(saints, 'tags').filter(Boolean)
    },
    {
      key: 'doutorIgreja',
      label: 'Apenas Doutores da Igreja',
      type: 'boolean'
    }
  ];

  const sortOptions = [
    { value: 'nome', label: 'Nome (A-Z)' },
    { value: 'nome-desc', label: 'Nome (Z-A)' },
    { value: 'popularidade', label: 'Popularidade (Maior)' },
    { value: 'popularidade-asc', label: 'Popularidade (Menor)' },
    { value: 'canonizacao', label: 'Canonização (Mais Recente)' },
    { value: 'canonizacao-asc', label: 'Canonização (Mais Antiga)' }
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <section className="py-12">
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl font-serif mb-4">Santos</h1>
            <p className="text-lg text-gray-700">
              Conheça as vidas inspiradoras dos santos — homens e mulheres que dedicaram suas vidas a Deus
              e ao próximo. Cada história é um testemunho de fé, coragem e amor que continua a inspirar
              milhões de pessoas ao redor do mundo.
            </p>
          </div>

          {/* Barra de busca */}
          <div className="mb-6">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              placeholder="Buscar santos por nome, país, ordem religiosa..."
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
            totalCount={saints.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            emptyMessage="Nenhum santo encontrado"
          >
            <Gallery saints={results} />
          </SearchResults>
        </section>
      </motion.div>
    </Layout>
  )
}

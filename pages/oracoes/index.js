import { useState } from 'react';
import Layout from '../../components/Layout';
import OracaoCard from '../../components/OracaoCard';
import oracoes from '../../data/oracoes.json';

export default function OracoesPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busca, setBusca] = useState('');

  // Obter categorias únicas
  const categorias = ['Todas', ...new Set(oracoes.map(o => o.categoria))];

  // Filtrar orações
  const oracoesFiltradas = oracoes.filter(oracao => {
    const matchCategoria = categoriaFiltro === 'Todas' || oracao.categoria === categoriaFiltro;
    const matchBusca = busca === '' ||
      oracao.nome.toLowerCase().includes(busca.toLowerCase()) ||
      oracao.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
      oracao.tags?.some(tag => tag.toLowerCase().includes(busca.toLowerCase()));

    return matchCategoria && matchBusca;
  });

  return (
    <Layout
      title="Orações Católicas"
      description="Coleção de orações católicas tradicionais e devocionais para fortalecer sua vida espiritual."
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-accent-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Orações Católicas
            </h1>
            <p className="text-xl text-accent-50 mb-8">
              Encontre orações tradicionais e devocionais para fortalecer sua vida de oração
            </p>

            {/* Barra de busca */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar orações..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-300"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400"
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
            </div>
          </div>
        </div>
      </section>

      {/* Filtros de categoria */}
      <section className="bg-white border-b border-neutral-200 py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  categoriaFiltro === categoria
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-primary-100 text-neutral-700 hover:bg-primary-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contador de resultados */}
      <section className="bg-primary-50 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-neutral-600">
            {oracoesFiltradas.length === oracoes.length
              ? `${oracoes.length} ${oracoes.length === 1 ? 'oração disponível' : 'orações disponíveis'}`
              : `${oracoesFiltradas.length} de ${oracoes.length} ${oracoesFiltradas.length === 1 ? 'oração encontrada' : 'orações encontradas'}`
            }
          </p>
        </div>
      </section>

      {/* Grade de orações */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          {oracoesFiltradas.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-lg shadow-md p-8">
                <svg
                  className="w-20 h-20 mx-auto text-neutral-300 mb-4"
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
                <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">
                  Nenhuma oração encontrada
                </h3>
                <p className="text-neutral-600 mb-4">
                  Não encontramos orações que correspondam à sua busca.
                </p>
                <button
                  onClick={() => {
                    setBusca('');
                    setCategoriaFiltro('Todas');
                  }}
                  className="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oracoesFiltradas.map((oracao, index) => (
                <OracaoCard key={oracao.id} oracao={oracao} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-neutral-800 mb-4">
              Explore Mais Recursos Devocionais
            </h2>
            <p className="text-neutral-600 mb-8">
              Fortaleça sua vida de oração com novenas e intenções de oração compartilhadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/novenas"
                className="bg-accent-500 text-white px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors font-medium"
              >
                Ver Novenas
              </a>
              <a
                href="/intencoes"
                className="bg-white text-accent-600 border-2 border-accent-500 px-8 py-3 rounded-lg hover:bg-accent-50 transition-colors font-medium"
              >
                Intenções de Oração
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

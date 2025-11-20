import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import useNovena from '../../hooks/useNovena';
import novenas from '../../data/novenas.json';

export default function NovenasPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const { novenas: novenasUsuario, isLoaded } = useNovena();

  // Obter categorias únicas
  const categorias = ['Todas', ...new Set(novenas.map(n => n.categoria))];

  // Filtrar novenas
  const novenasFiltradas = novenas.filter(novena => {
    return categoriaFiltro === 'Todas' || novena.categoria === categoriaFiltro;
  });

  // Verificar se uma novena está em progresso
  const getNovenaStatus = (slug) => {
    const emProgresso = novenasUsuario.emProgresso.find(n => n.slug === slug);
    const completadas = novenasUsuario.completadas.filter(n => n.slug === slug);

    if (emProgresso) {
      const progresso = Math.round((emProgresso.diasCompletados.length / emProgresso.duracao) * 100);
      return { tipo: 'em_progresso', progresso };
    }

    if (completadas.length > 0) {
      return { tipo: 'completada', vezes: completadas.length };
    }

    return { tipo: 'nao_iniciada' };
  };

  return (
    <Layout
      title="Novenas Católicas"
      description="Novenas tradicionais da Igreja Católica para fortalecer sua devoção e fé."
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-accent-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Novenas Católicas
            </h1>
            <p className="text-xl text-accent-50 mb-8">
              Aprofunde sua vida de oração com novenas tradicionais e acompanhe seu progresso
            </p>
          </div>
        </div>
      </section>

      {/* Estatísticas do usuário */}
      {isLoaded && (novenasUsuario.emProgresso.length > 0 || novenasUsuario.completadas.length > 0) && (
        <section className="bg-white py-8 border-b border-neutral-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-neutral-800 mb-4">
                Suas Novenas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-1">
                    {novenasUsuario.emProgresso.length}
                  </div>
                  <div className="text-sm text-neutral-600">Em Progresso</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {novenasUsuario.completadas.length}
                  </div>
                  <div className="text-sm text-neutral-600">Completadas</div>
                </div>
                <div className="bg-secondary-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-secondary-600 mb-1">
                    {novenas.length}
                  </div>
                  <div className="text-sm text-neutral-600">Disponíveis</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros de categoria */}
      <section className="bg-primary-50 border-b border-neutral-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  categoriaFiltro === categoria
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-white text-neutral-700 hover:bg-primary-100'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grade de novenas */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {novenasFiltradas.map((novena, index) => {
                const status = isLoaded ? getNovenaStatus(novena.slug) : { tipo: 'nao_iniciada' };

                return (
                  <motion.div
                    key={novena.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Imagem */}
                    <div className="relative h-48 bg-gradient-to-br from-accent-100 to-accent-200">
                      {novena.imagem && (
                        <img
                          src={novena.imagem}
                          alt={novena.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}

                      {/* Badge de status */}
                      {status.tipo !== 'nao_iniciada' && (
                        <div className="absolute top-3 right-3">
                          {status.tipo === 'em_progresso' ? (
                            <span className="inline-block bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                              {status.progresso}% completo
                            </span>
                          ) : (
                            <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                              ✓ Completada {status.vezes}x
                            </span>
                          )}
                        </div>
                      )}

                      {/* Badge da categoria */}
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-accent-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                          {novena.categoria}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-5">
                      <h3 className="text-xl font-serif font-bold text-neutral-800 mb-2">
                        {novena.nome}
                      </h3>

                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {novena.descricao}
                      </p>

                      {/* Informações */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{novena.duracao} dias</span>
                        </div>
                        {novena.dataFesta && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{novena.dataFesta}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {novena.tags && novena.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {novena.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Link */}
                      <Link
                        href={`/novenas/${novena.slug}`}
                        className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium text-sm transition-colors group"
                      >
                        {status.tipo === 'em_progresso' ? 'Continuar novena' : 'Ver novena'}
                        <svg
                          className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-neutral-800 mb-4">
              Explore Mais Recursos de Oração
            </h2>
            <p className="text-neutral-600 mb-8">
              Fortaleça sua vida espiritual com orações tradicionais e intenções compartilhadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/oracoes"
                className="bg-accent-500 text-white px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors font-medium"
              >
                Ver Orações
              </Link>
              <Link
                href="/intencoes"
                className="bg-white text-accent-600 border-2 border-accent-500 px-8 py-3 rounded-lg hover:bg-accent-50 transition-colors font-medium"
              >
                Intenções de Oração
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

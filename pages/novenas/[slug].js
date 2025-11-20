import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import NovenaTracker from '../../components/NovenaTracker';
import useNovena from '../../hooks/useNovena';
import novenas from '../../data/novenas.json';
import santos from '../../data/santos.json';
import Link from 'next/link';

export async function getStaticPaths() {
  const paths = novenas.map((novena) => ({
    params: { slug: novena.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const novena = novenas.find((n) => n.slug === params.slug);

  // Buscar santo relacionado, se houver
  let santoRelacionado = null;
  if (novena.santoRelacionado) {
    santoRelacionado = santos.find(s => s.slug === novena.santoRelacionado);
  }

  return {
    props: {
      novena,
      santoRelacionado
    },
  };
}

export default function NovenaPage({ novena, santoRelacionado }) {
  const router = useRouter();
  const {
    iniciarNovena,
    getNovenaEmProgresso,
    cancelarNovena,
    atualizarIntencao,
    getHistoricoNovena,
    isLoaded
  } = useNovena();

  const [mostrarFormularioInicio, setMostrarFormularioInicio] = useState(false);
  const [intencaoTexto, setIntencaoTexto] = useState('');
  const [novenaEmProgresso, setNovenaEmProgresso] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (isLoaded) {
      const emProgresso = getNovenaEmProgresso(novena.slug);
      setNovenaEmProgresso(emProgresso);

      const hist = getHistoricoNovena(novena.slug);
      setHistorico(hist);

      if (emProgresso) {
        setIntencaoTexto(emProgresso.intencao || '');
      }
    }
  }, [isLoaded, novena.slug]);

  const handleIniciarNovena = () => {
    const novaNovenaSalva = iniciarNovena(novena);
    if (intencaoTexto.trim()) {
      atualizarIntencao(novena.slug, intencaoTexto.trim());
    }
    setNovenaEmProgresso(novaNovenaSalva);
    setMostrarFormularioInicio(false);
  };

  const handleCancelarNovena = () => {
    if (confirm('Tem certeza que deseja cancelar esta novena? Seu progresso será perdido.')) {
      cancelarNovena(novena.slug);
      setNovenaEmProgresso(null);
      setIntencaoTexto('');
    }
  };

  const handleSalvarIntencao = () => {
    atualizarIntencao(novena.slug, intencaoTexto.trim());
    alert('Intenção atualizada com sucesso!');
  };

  return (
    <Layout
      title={`${novena.nome} - Novenas`}
      description={novena.descricao || `${novena.nome} - Novena católica de ${novena.duracao} dias.`}
    >
      {/* Breadcrumb */}
      <div className="bg-primary-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link href="/" className="text-accent-600 hover:text-accent-700">
              Início
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <Link href="/novenas" className="text-accent-600 hover:text-accent-700">
              Novenas
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-neutral-600">{novena.nome}</span>
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Cabeçalho */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-8 mb-8"
            >
              {/* Imagem */}
              {novena.imagem && (
                <div className="mb-6 rounded-lg overflow-hidden max-w-md mx-auto">
                  <img
                    src={novena.imagem}
                    alt={novena.nome}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Categoria */}
              <div className="text-center mb-4">
                <span className="inline-block bg-accent-100 text-accent-700 text-sm font-semibold px-4 py-2 rounded-full">
                  {novena.categoria}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-800 mb-4 text-center">
                {novena.nome}
              </h1>

              {/* Descrição */}
              <p className="text-lg text-neutral-600 mb-6 text-center">
                {novena.descricao}
              </p>

              {/* Informações */}
              <div className="flex flex-wrap justify-center gap-6 mb-6 text-neutral-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{novena.duracao} dias</span>
                </div>
                {novena.dataFesta && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Festa: {novena.dataFesta}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {novena.tags && novena.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {novena.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Histórico de completadas */}
              {historico.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-center text-green-800">
                    <strong>🎉 Você já completou esta novena {historico.length} {historico.length === 1 ? 'vez' : 'vezes'}!</strong>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Botão de iniciar/cancelar novena */}
            {!novenaEmProgresso ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-8 mb-8"
              >
                <h2 className="text-2xl font-serif font-bold text-neutral-800 mb-4 text-center">
                  Iniciar Novena
                </h2>
                <p className="text-neutral-600 mb-6 text-center">
                  Inicie esta novena e acompanhe seu progresso ao longo dos {novena.duracao} dias.
                </p>

                {/* Formulário de intenção */}
                <div className="max-w-2xl mx-auto mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sua Intenção (opcional)
                  </label>
                  <textarea
                    value={intencaoTexto}
                    onChange={(e) => setIntencaoTexto(e.target.value)}
                    placeholder="Escreva a intenção pela qual você está rezando esta novena..."
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={handleIniciarNovena}
                    className="bg-accent-500 text-white px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors font-medium text-lg"
                  >
                    Iniciar Novena
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Campo de intenção editável */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-6 mb-8"
                >
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">
                    Sua Intenção
                  </h3>
                  <textarea
                    value={intencaoTexto}
                    onChange={(e) => setIntencaoTexto(e.target.value)}
                    placeholder="Escreva sua intenção de oração..."
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSalvarIntencao}
                      className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors font-medium text-sm"
                    >
                      Salvar Intenção
                    </button>
                    <button
                      onClick={handleCancelarNovena}
                      className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300 transition-colors font-medium text-sm"
                    >
                      Cancelar Novena
                    </button>
                  </div>
                </motion.div>

                {/* Tracker de progresso */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <NovenaTracker novena={novena} />
                </motion.div>
              </>
            )}

            {/* Santo relacionado */}
            {santoRelacionado && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">
                  Santo Relacionado
                </h3>
                <Link
                  href={`/santos/${santoRelacionado.slug}`}
                  className="flex items-center gap-4 hover:bg-primary-50 p-4 rounded-lg transition-colors"
                >
                  {santoRelacionado.imagem && (
                    <img
                      src={santoRelacionado.imagem}
                      alt={santoRelacionado.nome}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-800 text-lg">
                      {santoRelacionado.nome}
                    </h4>
                    {santoRelacionado.descricao && (
                      <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                        {santoRelacionado.descricao}
                      </p>
                    )}
                    <p className="text-sm text-accent-600 mt-2">
                      Ver santo →
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useRouter } from 'next/router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import FavoritoButton from '../../components/FavoritoButton';
import oracoes from '../../data/oracoes.json';
import santos from '../../data/santos.json';
import Link from 'next/link';

export async function getStaticPaths() {
  const paths = oracoes.map((oracao) => ({
    params: { slug: oracao.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const oracao = oracoes.find((o) => o.slug === params.slug);

  // Buscar santo relacionado, se houver
  let santoRelacionado = null;
  if (oracao.santoRelacionado) {
    santoRelacionado = santos.find(s => s.slug === oracao.santoRelacionado);
  }

  // Buscar orações relacionadas (mesma categoria)
  const oracoesRelacionadas = oracoes
    .filter(o => o.categoria === oracao.categoria && o.id !== oracao.id)
    .slice(0, 3);

  return {
    props: {
      oracao,
      santoRelacionado,
      oracoesRelacionadas
    },
  };
}

export default function OracaoPage({ oracao, santoRelacionado, oracoesRelacionadas }) {
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);
  const [compartilhandoVia, setCompartilhandoVia] = useState(null);

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(oracao.texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar a oração. Por favor, tente novamente.');
    }
  };

  const handleCompartilhar = (via) => {
    const titulo = `${oracao.nome} - Amigos do Céu`;
    const texto = `${oracao.nome}\n\n${oracao.texto}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';

    let shareUrl = '';

    switch (via) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto + '\n\n' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`;
        break;
      default:
        return;
    }

    setCompartilhandoVia(via);
    setTimeout(() => setCompartilhandoVia(null), 1000);

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Layout
      title={`${oracao.nome} - Orações`}
      description={oracao.descricao || `${oracao.nome} - Oração católica tradicional.`}
    >
      {/* Breadcrumb */}
      <div className="bg-primary-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link href="/" className="text-accent-600 hover:text-accent-700">
              Início
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <Link href="/oracoes" className="text-accent-600 hover:text-accent-700">
              Orações
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-neutral-600">{oracao.nome}</span>
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Cabeçalho */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              {/* Categoria */}
              <span className="inline-block bg-accent-100 text-accent-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                {oracao.categoria}
              </span>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-800 mb-4">
                {oracao.nome}
              </h1>

              {/* Descrição */}
              {oracao.descricao && (
                <p className="text-lg text-neutral-600 mb-6">
                  {oracao.descricao}
                </p>
              )}

              {/* Origem */}
              {oracao.origem && (
                <p className="text-sm text-neutral-500 italic">
                  {oracao.origem}
                </p>
              )}
            </motion.div>

            {/* Imagem (opcional) */}
            {oracao.imagem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12 rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto"
              >
                <img
                  src={oracao.imagem}
                  alt={oracao.nome}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            )}

            {/* Texto da oração */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-lg p-8 md:p-12 mb-8 border border-accent-200"
            >
              <p className="text-lg md:text-xl text-neutral-800 leading-relaxed whitespace-pre-line font-serif text-center">
                {oracao.texto}
              </p>
            </motion.div>

            {/* Ações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {/* Favoritar */}
              <FavoritoButton
                item={{
                  id: oracao.id,
                  slug: oracao.slug,
                  nome: oracao.nome,
                  imagem: oracao.imagem,
                  categoria: oracao.categoria
                }}
                type="oracao"
                variant="button"
              />

              {/* Copiar */}
              <button
                onClick={handleCopiar}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  copiado
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                {copiado ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar Oração
                  </>
                )}
              </button>

              {/* Compartilhar */}
              <div className="relative">
                <button
                  onClick={() => handleCompartilhar('whatsapp')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                  title="Compartilhar no WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </motion.div>

            {/* Santo relacionado */}
            {santoRelacionado && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-primary-50 rounded-lg p-6 mb-12"
              >
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">
                  Santo Relacionado
                </h3>
                <Link
                  href={`/santos/${santoRelacionado.slug}`}
                  className="flex items-center gap-4 hover:bg-white p-4 rounded-lg transition-colors"
                >
                  {santoRelacionado.imagem && (
                    <img
                      src={santoRelacionado.imagem}
                      alt={santoRelacionado.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-neutral-800">
                      {santoRelacionado.nome}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Ver santo →
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Orações relacionadas */}
            {oracoesRelacionadas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-6">
                  Orações Relacionadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {oracoesRelacionadas.map(oracaoRel => (
                    <Link
                      key={oracaoRel.id}
                      href={`/oracoes/${oracaoRel.slug}`}
                      className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-neutral-800 mb-2">
                        {oracaoRel.nome}
                      </h4>
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {oracaoRel.descricao}
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}

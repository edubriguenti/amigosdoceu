import Link from 'next/link';
import { motion } from 'framer-motion';
import FavoritoButton from './FavoritoButton';

/**
 * Card para exibição de uma oração
 * @param {Object} oracao - Dados da oração
 * @param {number} index - Índice para animação
 */
export default function OracaoCard({ oracao, index = 0 }) {
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Imagem */}
      <div className="relative h-48 bg-gradient-to-br from-accent-100 to-accent-200">
        {oracao.imagem && (
          <img
            src={oracao.imagem}
            alt={oracao.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Badge da categoria */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-accent-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {oracao.categoria}
          </span>
        </div>

        {/* Botão de favoritar */}
        <div className="absolute top-3 right-3">
          <FavoritoButton
            item={{
              id: oracao.id,
              slug: oracao.slug,
              nome: oracao.nome,
              imagem: oracao.imagem,
              categoria: oracao.categoria
            }}
            type="oracao"
            variant="icon"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Nome da oração */}
        <h3 className="text-xl font-serif font-bold text-neutral-800 mb-2">
          {oracao.nome}
        </h3>

        {/* Descrição */}
        {oracao.descricao && (
          <p className="text-sm text-neutral-600 mb-4 flex-1">
            {truncateText(oracao.descricao)}
          </p>
        )}

        {/* Tags */}
        {oracao.tags && oracao.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {oracao.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Link para página completa */}
        <Link
          href={`/oracoes/${oracao.slug}`}
          className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium text-sm transition-colors group mt-auto"
        >
          Ver oração completa
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
}

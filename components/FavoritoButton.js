import { useFavoritos } from '../hooks/useFavoritos';
import { useState } from 'react';

/**
 * Botão de favorito com animação
 * @param {string} tipo - Tipo do item: 'santos', 'igrejas', 'aparicoes'
 * @param {object} item - Objeto com dados do item (deve ter slug, nome, imagem, etc)
 * @param {string} variant - Variante visual: 'icon' (apenas ícone) ou 'button' (botão com texto)
 * @param {string} size - Tamanho: 'sm', 'md', 'lg'
 */
export default function FavoritoButton({ tipo, item, variant = 'icon', size = 'md' }) {
  const { toggleFavorito, isFavorito, loaded } = useFavoritos();
  const [isAnimating, setIsAnimating] = useState(false);

  const isFav = loaded && isFavorito(tipo, item.slug);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorito(tipo, item);

    // Animação de feedback
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl'
  };

  const iconSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-300
          ${isFav
            ? 'bg-accent-500 text-white hover:bg-accent-600'
            : 'bg-white border border-neutral-300 text-neutral-700 hover:border-accent-500 hover:text-accent-500'
          }
          ${isAnimating ? 'scale-95' : 'scale-100'}
          focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
        `}
        aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <span
          className={`
            ${iconSizeClasses[size]}
            transition-transform duration-300
            ${isAnimating ? 'scale-125' : 'scale-100'}
          `}
        >
          {isFav ? '❤️' : '🤍'}
        </span>
        <span className="text-sm font-medium">
          {isFav ? 'Favoritado' : 'Favoritar'}
        </span>
      </button>
    );
  }

  // Variante 'icon' (padrão)
  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-300
        ${isFav
          ? 'bg-accent-500 text-white shadow-md hover:bg-accent-600'
          : 'bg-white/90 backdrop-blur-sm text-neutral-600 hover:bg-white hover:text-accent-500 shadow-sm'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
      `}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <span
        className={`
          ${iconSizeClasses[size]}
          transition-transform duration-300
          ${isAnimating ? 'scale-125 rotate-12' : 'scale-100'}
        `}
      >
        {isFav ? '❤️' : '🤍'}
      </span>
    </button>
  );
}

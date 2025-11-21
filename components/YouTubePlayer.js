import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Componente para exibir vídeo do YouTube em miniatura
 * @param {string} videoId - ID do vídeo do YouTube (ex: "KYqBotSlWqE")
 * @param {string} title - Título do vídeo/oração
 * @param {string} size - Tamanho: "small", "medium" ou "large"
 */
export default function YouTubePlayer({ videoId, title = 'Oração', size = 'medium' }) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!videoId) return null;

  // Dimensões baseadas no tamanho
  const sizes = {
    small: { width: '100%', height: '200px', maxWidth: '320px' },
    medium: { width: '100%', height: '280px', maxWidth: '480px' },
    large: { width: '100%', height: '360px', maxWidth: '640px' }
  };

  const dimensions = sizes[size] || sizes.medium;

  // URL do embed do YouTube com parâmetros otimizados
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="youtube-player-container"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-accent-50 to-accent-100 border-b border-accent-200">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-accent-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <h3 className="text-sm font-semibold text-neutral-800">
              {title}
            </h3>
          </div>
        </div>

        {/* Player */}
        <div className="relative bg-neutral-900" style={{ paddingBottom: '56.25%' }}>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-neutral-600 mx-auto mb-2 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                <p className="text-sm text-neutral-500">Carregando...</p>
              </div>
            </div>
          )}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-neutral-600 hover:text-accent-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            Assistir no YouTube
          </a>
        </div>
      </div>
    </motion.div>
  );
}

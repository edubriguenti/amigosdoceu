import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * TimelineCard - Card para exibir evento da linha do tempo da Vida de Cristo
 * @param {Object} event - Dados do evento
 * @param {number} index - Índice do evento na timeline
 * @param {Function} onImageClick - Callback ao clicar na imagem
 */
export default function TimelineCard({ event, index, onImageClick }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary-300 via-secondary-400 to-secondary-300 -z-10 hidden md:block" />

      {/* Timeline dot */}
      <div className="absolute left-1/2 top-8 w-4 h-4 bg-secondary-500 rounded-full border-4 border-parchment transform -translate-x-1/2 hidden md:block shadow-lg" />

      <div className={`md:grid md:grid-cols-2 md:gap-8 md:items-start ${isEven ? '' : 'md:grid-flow-dense'}`}>
        {/* Imagem */}
        <div className={`mb-4 md:mb-0 ${isEven ? '' : 'md:col-start-2'}`}>
          <button
            onClick={() => onImageClick(event)}
            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-secondary-400 focus:ring-offset-2 group"
            aria-label={`Ver imagem ampliada de ${event.title}`}
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay com ícone de zoom */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
            {/* Número do evento */}
            <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-secondary-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">
              {event.id}
            </div>
          </button>
        </div>

        {/* Conteúdo */}
        <div className={`${isEven ? '' : 'md:col-start-1 md:row-start-1'} ${isEven ? 'md:text-left' : 'md:text-right'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary-400">
            <h3 className="text-2xl font-serif text-gray-900 mb-3">
              {event.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {event.description}
            </p>
            {event.scripture && (
              <p className="text-sm text-secondary-600 font-medium italic flex items-center gap-2 justify-start">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{event.scripture}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import TimelineCard from '../components/TimelineCard';
import ImageModal from '../components/ImageModal';
import { motion } from 'framer-motion';
import vidaCristoData from '../data/vida-cristo.json';

export default function VidaDeCristo() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const timelineRef = useRef(null);

  // Modo apresentação
  useEffect(() => {
    if (!isPresentationMode) return;

    const interval = setInterval(() => {
      setPresentationIndex((prev) => {
        if (prev >= vidaCristoData.length - 1) {
          setIsPresentationMode(false);
          return 0;
        }
        return prev + 1;
      });
    }, 5000); // 5 segundos por imagem

    return () => clearInterval(interval);
  }, [isPresentationMode]);

  // Atualizar modal durante apresentação
  useEffect(() => {
    if (isPresentationMode) {
      setSelectedEvent(vidaCristoData[presentationIndex]);
      setModalOpen(true);
    }
  }, [presentationIndex, isPresentationMode]);

  const handleImageClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
    setIsPresentationMode(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsPresentationMode(false);
  };

  const handlePrevImage = () => {
    const currentIndex = vidaCristoData.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex > 0) {
      setSelectedEvent(vidaCristoData[currentIndex - 1]);
    }
  };

  const handleNextImage = () => {
    const currentIndex = vidaCristoData.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex < vidaCristoData.length - 1) {
      setSelectedEvent(vidaCristoData[currentIndex + 1]);
    }
  };

  const startPresentation = () => {
    setPresentationIndex(0);
    setIsPresentationMode(true);
  };

  const stopPresentation = () => {
    setIsPresentationMode(false);
  };

  const scrollToEvent = (index) => {
    const element = document.getElementById(`event-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentEventIndex = selectedEvent ? vidaCristoData.findIndex(e => e.id === selectedEvent.id) : 0;
  const progress = vidaCristoData.length > 0 ? ((currentEventIndex + 1) / vidaCristoData.length) * 100 : 0;

  return (
    <Layout>
      <SEO
        title="Vida de Cristo em Imagens – Amigos do Céu"
        description="Linha do tempo visual da vida de Jesus Cristo com imagens inspiradas no estilo sacro da Igreja Nossa Senhora do Brasil."
        image="/images/vida-cristo/nascimento.jpg"
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-12 md:py-16"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">✝️</span>
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            Vida de Cristo em Imagens
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            Contemple toda a vida de Jesus Cristo através de uma jornada visual inspirada no estilo sacro
            das pinturas barrocas brasileiras. De Belém ao Calvário, da manjedoura à glória da Ressurreição.
          </p>

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={startPresentation}
              className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 flex items-center gap-2"
              aria-label="Iniciar modo apresentação"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Modo Apresentação
            </button>
            <a
              href="#timeline"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg shadow-lg border-2 border-gray-300 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Ver Linha do Tempo
            </a>
          </div>
        </div>
      </motion.section>

      {/* Progress Bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-parchment/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Progresso da Jornada
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary-400 to-secondary-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium text-secondary-600 whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <section id="timeline" className="py-12 md:py-16" ref={timelineRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16 md:space-y-24">
            {vidaCristoData.map((event, index) => (
              <div key={event.id} id={`event-${index}`}>
                <TimelineCard
                  event={event}
                  index={index}
                  onImageClick={handleImageClick}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <div className="fixed right-2 top-32 z-40 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 p-2 max-h-[400px] overflow-y-auto w-48 hover:bg-white/95 hover:w-56 transition-all duration-300">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 sticky top-0 bg-white/90 backdrop-blur-sm pb-1 border-b border-gray-200/50">
            Nav. Rápida
          </h3>
          <div className="space-y-0.5">
            {vidaCristoData.map((event, index) => (
              <button
                key={event.id}
                onClick={() => scrollToEvent(index)}
                className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-secondary-50 hover:text-secondary-700 rounded transition-all focus:outline-none focus:ring-1 focus:ring-secondary-400"
              >
                <span className="font-semibold text-secondary-600">{event.id}.</span> <span className="truncate block">{event.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Presentation Mode Controls */}
      {isPresentationMode && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-4"
        >
          <span className="text-sm font-medium text-gray-700">
            Modo Apresentação: {presentationIndex + 1}/{vidaCristoData.length}
          </span>
          <button
            onClick={stopPresentation}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Parar
          </button>
        </motion.div>
      )}

      {/* Image Modal */}
      <ImageModal
        event={selectedEvent}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        currentIndex={currentEventIndex}
        total={vidaCristoData.length}
      />

      {/* Bottom Quote */}
      <section className="py-12 text-center bg-gradient-to-b from-transparent to-secondary-50">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim."
            <br />
            <span className="font-semibold text-secondary-700">— João 14:6</span>
          </p>
        </div>
      </section>
    </Layout>
  );
}

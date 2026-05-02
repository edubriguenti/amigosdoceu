import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ParticulasHero from './ParticulasHero'

/**
 * Efeito heróico #2 — Hero cinematográfico.
 * 3 camadas: partículas + pergaminho/Bíblia + texto.
 * Parallax leve no scroll. Brilho central pulsante. CTA premium.
 */
export default function HeroConexoes({ onExplorar }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, 60])
  const yBible = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacityFade = useTransform(scrollYProgress, [0, 0.7], [1, 0.4])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[80vh] md:min-h-[90vh] flex items-center"
    >
      {/* Camada 1: partículas */}
      <ParticulasHero count={28} />

      {/* Brilho central radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(251,191,36,0.18), transparent 50%), radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.20), transparent 60%)',
          mixBlendMode: 'screen',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 px-4 md:px-8 py-16 items-center">
        {/* Lado esquerdo: texto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-2 md:order-1"
        >
          <p className="text-cosmic-blue-light tracking-[0.3em] text-xs md:text-sm uppercase mb-4">
            Conexões da Bíblia
          </p>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-white mb-5">
            Descubra como Deus conectou cada promessa ao seu cumprimento.
          </h1>
          <p className="text-neutral-300 text-base md:text-lg mb-8 leading-relaxed max-w-md">
            O Antigo Testamento revela a promessa.
            <br />
            O Novo Testamento revela o cumprimento.
          </p>
          <button
            type="button"
            onClick={onExplorar}
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cosmic-blue to-blue-700 text-white font-medium rounded-xl shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue-light focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-bg transition-all motion-safe:hover:scale-[1.02]"
          >
            Explorar Conexões
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>

        {/* Lado direito: visual AT ↔ NT */}
        <motion.div
          style={{ opacity: opacityFade }}
          className="order-1 md:order-2 relative h-[300px] md:h-[420px]"
        >
          {/* Brilho central pulsante */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full motion-safe:animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, rgba(59,130,246,0.3) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            aria-hidden="true"
          />

          {/* Pergaminho (AT) */}
          <motion.div
            style={{ y: yScroll }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] aspect-[3/4]"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/conexoes/hero-scroll.jpg"
                alt="Pergaminho do Antigo Testamento"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]"
                priority
              />
            </div>
            <p className="absolute -bottom-6 left-0 right-0 text-center text-cosmic-gold text-xs tracking-widest font-semibold">ANTIGO<br/>TESTAMENTO</p>
          </motion.div>

          {/* Símbolo central de conexão */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-cosmic-gold flex items-center justify-center bg-cosmic-bg/40 backdrop-blur-sm motion-safe:animate-pulse-scale shadow-[0_0_40px_rgba(251,191,36,0.6)]">
              <svg className="w-7 h-7 md:w-9 md:h-9 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>

          {/* Bíblia (NT) */}
          <motion.div
            style={{ y: yBible }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] aspect-[3/4]"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/conexoes/hero-bible.jpg"
                alt="Bíblia aberta no Novo Testamento"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                priority
              />
            </div>
            <p className="absolute -bottom-6 left-0 right-0 text-center text-cosmic-blue-light text-xs tracking-widest font-semibold">NOVO<br/>TESTAMENTO</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

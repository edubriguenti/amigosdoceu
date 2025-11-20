import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritos } from '../hooks/useFavoritos';

/**
 * Header Responsivo Mobile-First
 * Mobile (<768px): Hamburger menu com overlay
 * Desktop (≥768px): Navegação horizontal
 * Sticky com backdrop-blur para elevação visual
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { getTotalCount, loaded } = useFavoritos();

  // Fecha menu ao navegar
  useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events?.on('routeChangeStart', handleRouteChange);
    return () => router.events?.off('routeChangeStart', handleRouteChange);
  }, [router]);

  // Previne scroll do body quando menu está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { name: 'Santos', href: '/santos' },
    { name: 'Igrejas', href: '/igrejas' },
    { name: 'Aparições', href: '/aparicoes' },
    { name: 'Mapa', href: '/mapa' },
    { name: 'Santos do Dia', href: '/santos-do-dia' },
    { name: 'Rosário', href: '/rosario' },
    { name: 'Calendário', href: '/calendario' },
    { name: 'Orações', href: '/oracoes' },
    { name: 'Novenas', href: '/novenas' },
    { name: 'Intenções', href: '/intencoes' }
  ];

  const favoritosCount = loaded ? getTotalCount() : 0;

  return (
    <>
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="text-xl md:text-2xl lg:text-3xl font-serif text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 -ml-2"
            >
              Amigos do Céu
            </Link>

            {/* Desktop Navigation - Oculto em mobile */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              {navigation.map((item) => {
                const isActive = router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-3 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {/* Favoritos Link com Badge */}
              <Link
                href="/favoritos"
                className={`
                  relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${router.pathname === '/favoritos'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }
                `}
                title="Meus Favoritos"
              >
                <span className="flex items-center gap-1">
                  ❤️
                  {favoritosCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-accent-500 rounded-full">
                      {favoritosCount > 99 ? '99+' : favoritosCount}
                    </span>
                  )}
                </span>
              </Link>
            </nav>

            {/* Mobile Menu Button - Visível apenas em mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  // Ícone X (fechar)
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Ícone hamburger (abrir)
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop - Fecha menu ao clicar fora */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel - Desliza da direita */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[320px] bg-white shadow-2xl md:hidden overflow-y-auto"
              aria-label="Menu mobile"
            >
              {/* Header do Menu */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-parchment">
                <span className="text-lg font-serif text-gray-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Fechar menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links de Navegação */}
              <div className="p-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = router.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        block px-4 py-3 text-base font-medium rounded-lg transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                {/* Favoritos Link com Badge (Mobile) */}
                <Link
                  href="/favoritos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${router.pathname === '/favoritos'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    ❤️ Meus Favoritos
                  </span>
                  {favoritosCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-semibold text-white bg-accent-500 rounded-full">
                      {favoritosCount > 99 ? '99+' : favoritosCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Footer do Menu - Citação bíblica */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 text-center italic leading-relaxed">
                  "Temos ao nosso redor uma grande nuvem de testemunhas."
                  <br />
                  <span className="font-semibold">Hebreus 12:1</span>
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

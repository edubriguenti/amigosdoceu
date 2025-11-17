import Header from './Header'
import Footer from './Footer'

/**
 * Layout Principal
 * Usa novos componentes Header (responsivo) e Footer (expandido)
 * Sticky header + skip link para acessibilidade
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Link - Acessibilidade (visível apenas no :focus) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:font-medium"
      >
        Pular para conteúdo principal
      </a>

      {/* Header responsivo com hamburger menu */}
      <Header />

      {/* Main content com ID para skip link */}
      <main id="main-content" className="flex-1 container mx-auto px-4 md:px-6">
        {children}
      </main>

      {/* Footer expandido */}
      <Footer />
    </div>
  )
}
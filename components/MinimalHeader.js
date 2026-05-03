import Link from 'next/link'

export default function MinimalHeader() {
  return (
    <header className="sticky top-0 z-40 bg-cosmic-surface/90 backdrop-blur-sm border-b border-cosmic-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center h-14 md:h-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm md:text-base font-serif text-neutral-100 hover:text-cosmic-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue focus-visible:ring-offset-2 rounded px-2 -ml-2"
            aria-label="Voltar à página inicial"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Amigos do Céu</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

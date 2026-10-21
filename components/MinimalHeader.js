import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ITENS_HEADER, ITENS_MAIS, secaoAtiva } from '../lib/navegacao'

const FOCO = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue rounded'

function MenuMais({ pathname }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (!aberto) return undefined
    const fora = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false) }
    const esc = (e) => { if (e.key === 'Escape') setAberto(false) }
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberto])

  useEffect(() => {
    const fechar = () => setAberto(false)
    router.events.on('routeChangeStart', fechar)
    return () => router.events.off('routeChangeStart', fechar)
  }, [router.events])

  const ativo = ITENS_MAIS.some((i) => secaoAtiva([i.href], pathname))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-mais"
        onClick={() => setAberto((v) => !v)}
        className={`px-3 py-2 text-sm transition-colors ${FOCO} ${
          ativo ? 'text-cosmic-gold' : 'text-neutral-300 hover:text-cosmic-gold'
        }`}
      >
        Mais <span aria-hidden="true">▾</span>
      </button>
      {aberto && (
        <ul
          id="menu-mais"
          className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-cosmic-border bg-cosmic-surface py-1 shadow-xl"
        >
          {ITENS_MAIS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={secaoAtiva([item.href], pathname) ? 'page' : undefined}
                className="block px-4 py-2 text-sm text-neutral-200 hover:bg-cosmic-surface-2 hover:text-cosmic-gold focus:outline-none focus-visible:bg-cosmic-surface-2"
              >
                {item.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function MinimalHeader() {
  const { pathname } = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-cosmic-surface/90 backdrop-blur-sm border-b border-cosmic-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center h-14 md:h-16">
          <Link
            href="/"
            className={`group inline-flex items-center gap-2 text-sm md:text-base font-serif text-neutral-100 hover:text-cosmic-gold transition-colors focus-visible:ring-offset-2 px-2 -ml-2 ${FOCO}`}
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

          <nav aria-label="Seções do site" className="hidden md:flex items-center gap-1 ml-8">
            {ITENS_HEADER.map((item) => {
              const atual = secaoAtiva(item.prefixos, pathname)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={atual ? 'page' : undefined}
                  className={`px-3 py-2 text-sm transition-colors ${FOCO} ${
                    atual ? 'text-cosmic-gold' : 'text-neutral-300 hover:text-cosmic-gold'
                  }`}
                >
                  {item.rotulo}
                </Link>
              )
            })}
            <MenuMais pathname={pathname} />
          </nav>

          <Link
            href="/busca"
            aria-label="Buscar"
            aria-current={pathname === '/busca' ? 'page' : undefined}
            className={`ml-auto inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-neutral-300 hover:text-cosmic-gold transition-colors ${FOCO}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
          </Link>

          <Link
            href="/minha-jornada"
            className={`inline-flex items-center gap-1.5 text-sm text-neutral-300 hover:text-cosmic-gold transition-colors px-2 py-1 ${FOCO}`}
          >
            <span aria-hidden="true">🧭</span>
            <span className="hidden sm:inline">Minha Jornada</span>
            <span className="sr-only sm:hidden">Minha Jornada</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

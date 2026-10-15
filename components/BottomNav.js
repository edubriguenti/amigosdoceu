import Link from 'next/link'
import { useRouter } from 'next/router'

const ITENS = [
  { href: '/', rotulo: 'Início', icone: '🏠', prefixos: [] },
  { href: '/santos', rotulo: 'Santos', icone: '✨', prefixos: ['/santos'] },
  { href: '/oracoes', rotulo: 'Rezar', icone: '🙏', prefixos: ['/oracoes', '/novenas', '/rosario'] },
  { href: '/album-sagrado', rotulo: 'Álbum', icone: '📖', prefixos: ['/album-sagrado'] },
  { href: '/minha-jornada', rotulo: 'Jornada', icone: '🧭', prefixos: ['/minha-jornada'] },
]

function ativo(item, pathname) {
  if (item.href === '/') return pathname === '/'
  return item.prefixos.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

/** Navegação principal no celular (some a partir de md). Só nas páginas internas. */
export default function BottomNav() {
  const { pathname } = useRouter()

  return (
    <nav
      aria-label="Navegação principal"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cosmic-surface/95 backdrop-blur-sm border-t border-cosmic-border pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {ITENS.map((item) => {
          const atual = ativo(item, pathname)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={atual ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cosmic-blue ${
                  atual ? 'text-cosmic-gold' : 'text-neutral-300 hover:text-cosmic-gold'
                }`}
              >
                <span aria-hidden="true" className="text-lg leading-none">{item.icone}</span>
                <span>{item.rotulo}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

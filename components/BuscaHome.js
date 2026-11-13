import { useState } from 'react'
import { useRouter } from 'next/router'

/**
 * Campo de busca da home. A home não tem header, então este é o único caminho
 * até a busca global (/busca) a partir da página de entrada.
 * É um formulário GET de verdade: sem JavaScript ele também leva a /busca?q=…
 */
export default function BuscaHome() {
  const router = useRouter()
  const [texto, setTexto] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    const q = texto.trim()
    router.push(q ? { pathname: '/busca', query: { q } } : '/busca')
  }

  return (
    <form role="search" action="/busca" method="get" onSubmit={enviar} className="mt-6 max-w-xl mx-auto">
      <label htmlFor="busca-home" className="sr-only">Buscar santos, orações, lugares e mais</label>
      <div className="flex items-stretch rounded-full bg-cosmic-surface border border-cosmic-border focus-within:border-cosmic-gold focus-within:ring-2 focus-within:ring-cosmic-gold/60 transition-colors">
        <svg className="hidden min-[360px]:block w-5 h-5 ml-4 self-center shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
        </svg>
        <input
          id="busca-home"
          name="q"
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Santo, oração, lugar…"
          autoComplete="off"
          enterKeyHint="search"
          className="flex-1 min-w-0 min-h-[48px] pl-5 min-[360px]:pl-3 pr-2 bg-transparent text-white placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="submit"
          className="m-1 px-3 min-[360px]:px-4 min-h-[44px] rounded-full bg-cosmic-gold text-cosmic-bg font-medium hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}

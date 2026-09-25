import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/**
 * Seção "🔗 Conexões": entidades relacionadas, agrupadas por tipo.
 * `grupos` vem pronto do getStaticProps (lib/relacoes.js → getRelacionadas).
 * Mostra até VISIVEIS itens por grupo; o resto aparece ao tocar em "+N".
 */

const VISIVEIS = 3

// Orações e novenas não têm imagens próprias publicadas: usam um ícone.
const ICONE = { santo: '✨', aparicao: '🌹', igreja: '⛪', cristo: '✝️', oracao: '🙏', novena: '🕯️' }
const COM_IMAGEM = new Set(['santo', 'aparicao', 'igreja', 'cristo'])

function ItemConexao({ item }) {
  const imagem = COM_IMAGEM.has(item.tipo) && item.imagem
  return (
    <li>
      <Link
        href={item.href}
        className="group flex items-center gap-3 rounded-xl border border-cosmic-border bg-cosmic-surface/60 p-2 pr-4 hover:border-cosmic-gold/50 hover:bg-cosmic-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
      >
        <span className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-cosmic-surface-2 flex items-center justify-center text-xl">
          {imagem ? (
            <Image src={imagem} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            <span aria-hidden="true">{ICONE[item.tipo]}</span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-neutral-100 leading-snug group-hover:text-cosmic-gold transition-colors">
            {item.nome}
          </span>
          {item.rotulo && <span className="block text-xs text-neutral-400 truncate">{item.rotulo}</span>}
        </span>
      </Link>
    </li>
  )
}

function GrupoConexoes({ grupo }) {
  const [aberto, setAberto] = useState(false)
  const visiveis = aberto ? grupo.itens : grupo.itens.slice(0, VISIVEIS)
  const restantes = grupo.itens.length - VISIVEIS

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">{grupo.titulo}</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {visiveis.map((item) => (
          <ItemConexao key={`${item.tipo}:${item.slug}`} item={item} />
        ))}
        {!aberto && restantes > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="h-full min-h-[4rem] w-full rounded-xl border border-dashed border-cosmic-border text-sm text-neutral-300 hover:border-cosmic-gold/50 hover:text-cosmic-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
              aria-label={`Mostrar mais ${restantes} em ${grupo.titulo}`}
            >
              + {restantes}
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default function EntidadesRelacionadas({ grupos, titulo = 'Conexões' }) {
  if (!grupos?.length) return null
  return (
    <section aria-labelledby="conexoes-entidade" className="max-w-4xl mx-auto px-4 mt-12">
      <h2 id="conexoes-entidade" className="text-2xl font-serif mb-5">
        🔗 {titulo}
      </h2>
      <div className="space-y-6">
        {grupos.map((g) => (
          <GrupoConexoes key={g.tipo} grupo={g} />
        ))}
      </div>
    </section>
  )
}

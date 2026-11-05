import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { buscar, montarIndice, TIPOS_BUSCA } from '../lib/busca'
import santos from '../data/santos.json'
import oracoes from '../data/oracoes.json'
import novenas from '../data/novenas.json'
import aparicoes from '../data/aparicoes.json'
import igrejas from '../data/igrejas.json'
import vidaCristo from '../data/vida-cristo.json'
import { getAllConexoes } from '../lib/conexoesData'

export async function getStaticProps() {
  const indice = montarIndice({
    santos, oracoes, novenas, aparicoes, igrejas, vidaCristo, conexoes: getAllConexoes(),
  })
  return { props: { indice } }
}

const SUGESTOES = ['Maria', 'Rosário', 'Fátima', 'Roma', 'Páscoa', 'Padroeiro']

export default function Busca({ indice }) {
  const router = useRouter()
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState(null)

  // Lê ?q= (links vindos do header ou compartilhados) quando o roteador estiver pronto.
  useEffect(() => {
    if (router.isReady && typeof router.query.q === 'string') setTexto(router.query.q)
  }, [router.isReady, router.query.q])

  const todos = useMemo(() => buscar(indice, texto), [indice, texto])
  const contagem = useMemo(() => {
    const c = {}
    todos.forEach((r) => { c[r.tipo] = (c[r.tipo] || 0) + 1 })
    return c
  }, [todos])
  const resultados = tipo ? todos.filter((r) => r.tipo === tipo) : todos
  const consultaVazia = texto.trim() === ''

  const atualizar = (valor) => {
    setTexto(valor)
    setTipo(null)
    router.replace({ pathname: '/busca', query: valor.trim() ? { q: valor } : {} }, undefined, { shallow: true })
  }

  return (
    <Layout>
      <SEO
        title="Buscar"
        description="Busque santos, orações, novenas, aparições, igrejas, eventos da vida de Cristo e conexões bíblicas."
        url="https://amigosdoceu.vercel.app/busca"
        noindex={true}
      />
      <div className="max-w-3xl mx-auto py-10 md:py-14">
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-6 text-center">Buscar no Amigos do Céu</h1>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-6">
          <label htmlFor="campo-busca" className="sr-only">Buscar santos, orações, lugares e mais</label>
          <input
            id="campo-busca"
            type="search"
            value={texto}
            onChange={(e) => atualizar(e.target.value)}
            placeholder="Ex.: Santa Teresinha, Ave Maria, Fátima…"
            autoComplete="off"
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl bg-cosmic-surface border border-cosmic-border text-white placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
          />
        </form>

        {consultaVazia ? (
          <div className="text-center">
            <p className="text-neutral-300 mb-4">Digite um nome, tema ou lugar. Ou comece por aqui:</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {SUGESTOES.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => atualizar(s)}
                    className="min-h-[44px] px-4 rounded-full border border-cosmic-border bg-cosmic-surface text-neutral-200 hover:border-cosmic-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {todos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filtrar por tipo">
                {[[null, 'Tudo', todos.length], ...Object.entries(TIPOS_BUSCA).filter(([t]) => contagem[t]).map(([t, v]) => [t, v.rotulo, contagem[t]])].map(([t, rotulo, n]) => (
                  <button
                    key={rotulo}
                    type="button"
                    aria-pressed={tipo === t}
                    onClick={() => setTipo(t)}
                    className={`min-h-[40px] px-3 rounded-full border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold ${
                      tipo === t
                        ? 'border-cosmic-gold bg-cosmic-gold/15 text-cosmic-gold'
                        : 'border-cosmic-border bg-cosmic-surface text-neutral-200 hover:border-cosmic-gold'
                    }`}
                  >
                    {rotulo} <span className="text-neutral-400">({n})</span>
                  </button>
                ))}
              </div>
            )}

            <p role="status" aria-live="polite" className="text-sm text-neutral-400 mb-3">
              {resultados.length === 0
                ? `Nenhum resultado para “${texto.trim()}”.`
                : `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'}`}
            </p>

            {resultados.length === 0 ? (
              <p className="text-neutral-300">
                Tente outra grafia ou uma palavra mais curta. Você também pode explorar{' '}
                <Link href="/santos" className="text-cosmic-gold underline">os santos</Link> ou{' '}
                <Link href="/oracoes" className="text-cosmic-gold underline">as orações</Link>.
              </p>
            ) : (
              <ul className="space-y-3">
                {resultados.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={r.href}
                      className="flex gap-3 p-4 rounded-xl border border-cosmic-border bg-cosmic-surface hover:border-cosmic-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
                    >
                      <span className="text-2xl" aria-hidden="true">{TIPOS_BUSCA[r.tipo].icone}</span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wider text-neutral-400">{TIPOS_BUSCA[r.tipo].rotulo}</span>
                        <span className="block font-medium text-white">{r.titulo}</span>
                        {r.resumo && <span className="block text-sm text-neutral-300 mt-0.5">{r.resumo}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

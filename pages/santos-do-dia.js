import Link from 'next/link'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import SaintCard from '../components/SaintCard'
import useDiaAtual from '../hooks/useDiaAtual'
import { dataPorExtenso } from '../lib/datas'
import { janelaDeDias, proximasCelebracoes, REVALIDATE_HOJE } from '../lib/hoje'

// Renderizada no servidor (ISR) para o dia de São Paulo; useDiaAtual corrige para o dia do usuário.
export async function getStaticProps() {
  const { dias, hojeServidor } = janelaDeDias()
  return {
    props: { dias, hojeServidor, proximas: proximasCelebracoes(10) },
    revalidate: REVALIDATE_HOJE,
  }
}

const ESTILO_TIPO = {
  Solenidade: 'border-cosmic-gold/60 text-cosmic-gold bg-cosmic-gold/10',
  Festa: 'border-cosmic-blue-light/60 text-cosmic-blue-light bg-cosmic-blue/10',
  Memória: 'border-emerald-400/60 text-emerald-300 bg-emerald-500/10',
}
const estiloTipo = (tipo) => ESTILO_TIPO[tipo] || 'border-cosmic-purple/60 text-purple-300 bg-cosmic-purple/10'

const botao =
  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold'

export default function SantosDoDia({ dias, hojeServidor, proximas }) {
  const dia = useDiaAtual(dias, hojeServidor)
  const { celebracao, santos, figurinha, oracao } = dia
  const santoPrincipal = santos[0]

  return (
    <Layout>
      <SEO
        title="Santos do Dia"
        description="Santo celebrado hoje no calendário litúrgico católico. Veja a vida, oração e tradição associada à data de hoje."
        url="https://amigosdoceu.vercel.app/santos-do-dia"
        keywords="santo do dia, calendário litúrgico, santo de hoje, comemoração diária, hagiografia"
      />
      <div className="py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif mb-3">Santos do Dia</h1>
          <p className="text-lg text-neutral-300 first-letter:uppercase">{dataPorExtenso(dia.data)}</p>
        </header>

        {/* Celebração do dia — um pequeno hub: conhecer, colecionar, rezar */}
        <section
          aria-labelledby="celebracao-hoje"
          className="max-w-3xl mx-auto mb-12 rounded-2xl border border-cosmic-border bg-cosmic-surface/70 p-6 md:p-8 text-center"
        >
          {celebracao ? (
            <>
              <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${estiloTipo(celebracao.tipo)}`}>
                {celebracao.tipo}
              </span>
              <h2 id="celebracao-hoje" className="text-3xl font-serif mb-3">{celebracao.nome}</h2>
              {celebracao.descricao && <p className="text-neutral-300">{celebracao.descricao}</p>}
            </>
          ) : (
            <>
              <h2 id="celebracao-hoje" className="text-2xl font-serif mb-3">Dia comum</h2>
              <p className="text-neutral-300">
                Hoje não há uma celebração específica no calendário litúrgico. Ainda assim, há uma oração e uma figurinha esperando por você.
              </p>
            </>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {santoPrincipal && (
              <Link href={`/santos/${santoPrincipal.slug}`} className={`${botao} bg-cosmic-surface-2 border border-cosmic-border hover:border-cosmic-gold/60`}>
                ✨ Ver santo
              </Link>
            )}
            {figurinha && (
              <Link href={figurinha.href} className={`${botao} bg-cosmic-surface-2 border border-cosmic-border hover:border-cosmic-gold/60`}>
                🃏 Ver no Álbum
              </Link>
            )}
            {oracao && (
              <Link href={oracao.href} className={`${botao} bg-cosmic-gold text-[#1b1406] hover:bg-amber-300`}>
                🙏 Rezar
              </Link>
            )}
          </div>
        </section>

        {santos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-center mb-8">Conheça os Santos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {santos.map((santo) => (
                <SaintCard key={santo.slug} saint={santo} />
              ))}
            </div>
          </section>
        )}

        {oracao && (
          <section className="max-w-3xl mx-auto mb-12 rounded-2xl border border-cosmic-border bg-cosmic-surface/40 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-cosmic-gold mb-2">Uma oração para hoje</h2>
            <p className="font-serif text-xl mb-2">{oracao.titulo}</p>
            <p className="text-neutral-300 italic leading-relaxed">{oracao.trecho}</p>
            <Link href={oracao.href} className="mt-3 inline-block text-cosmic-blue-light hover:underline">
              Rezar agora →
            </Link>
          </section>
        )}

        {proximas.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-serif text-center mb-8">Próximas celebrações importantes</h2>
            <ul className="max-w-4xl mx-auto space-y-3">
              {proximas.map((prox) => (
                <li
                  key={`${prox.mesNome}-${prox.diaNumero}`}
                  className="p-4 rounded-xl border border-cosmic-border bg-cosmic-surface/50 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${estiloTipo(prox.tipo)}`}>{prox.tipo}</span>
                      <span className="font-semibold">{prox.nome}</span>
                    </div>
                    {prox.descricao && <p className="text-sm text-neutral-400">{prox.descricao}</p>}
                    {prox.santos.length > 0 && (
                      <Link href={`/santos/${prox.santos[0]}`} className="text-sm text-cosmic-blue-light hover:underline mt-1 inline-block">
                        Ver santo →
                      </Link>
                    )}
                  </div>
                  <div className="text-sm font-medium text-neutral-300 whitespace-nowrap">
                    {prox.diaNumero} de {prox.mesNome}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="text-center mt-12">
          <Link href="/calendario" className={`${botao} px-6 py-3 bg-cosmic-gold text-[#1b1406] hover:bg-amber-300`}>
            Ver calendário litúrgico completo →
          </Link>
        </div>
      </div>
    </Layout>
  )
}

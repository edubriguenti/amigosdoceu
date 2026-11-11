import Link from 'next/link'

const numero = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

/**
 * Cartão de uma rota: folha de pergaminho com o esboço do caminho a tinta.
 * `rota` vem de getRotas(); `esboco` é o `d` de um <path> em viewBox 0 0 300 110
 * (lib/peregrinacoesEsboco.js); `feitas` só é mostrado depois de `carregado`.
 */
export default function RotaCard({ rota, esboco, feitas = 0, carregado = false }) {
  const comecou = carregado && feitas > 0
  const concluida = carregado && feitas >= rota.totalEtapas
  const invertido = Boolean(esboco && esboco.inicio[0] > esboco.fim[0])
  return (
    <Link
      href={`/peregrinacoes/${rota.slug}`}
      className="group block rounded-2xl overflow-hidden border border-cosmic-border bg-cosmic-surface/60 hover:border-cosmic-gold/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
    >
      <div className="album-papel relative px-5 pt-5 pb-3">
        {esboco && (
          <svg viewBox="0 0 300 110" className="w-full h-28" aria-hidden="true">
            <path d={esboco.d} fill="none" stroke="#8a1c1c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 5" />
            <circle cx={esboco.inicio[0]} cy={esboco.inicio[1]} r="4" fill="#f4ead2" stroke="#3b2f24" strokeWidth="1.5" />
            <g transform={`translate(${esboco.fim[0]} ${esboco.fim[1]})`} stroke="#3b2f24" strokeWidth="2" strokeLinecap="round">
              <circle r="7" fill="#8a1c1c" stroke="#f4ead2" strokeWidth="1.5" />
              <path d="M0 -4v8M-2.6 -1.4h5.2" stroke="#f4ead2" strokeWidth="1.4" />
            </g>
          </svg>
        )}
        <p className="flex justify-between text-xs font-serif text-[#5c4b36]">
          {/* Os nomes ficam do lado em que cada ponta está no desenho (Santiago fica a oeste). */}
          <span>{invertido ? rota.destino : rota.inicio}</span>
          <span>{invertido ? rota.inicio : rota.destino}</span>
        </p>
      </div>
      <div className="p-5">
        <h2 className="font-serif text-2xl text-neutral-50 group-hover:text-cosmic-gold transition-colors">{rota.nome}</h2>
        {rota.subtitulo && <p className="mt-1 text-sm text-cosmic-gold">{rota.subtitulo}</p>}
        <p className="mt-3 text-neutral-300 leading-relaxed">{rota.resumo}</p>
        <p className="mt-4 text-sm text-neutral-200">
          <strong className="font-semibold">{rota.distanciaKm != null ? `${numero(rota.distanciaKm)} km` : '—'}</strong> · {rota.totalEtapas} etapas · {rota.paises.join(' e ')}
        </p>
        {comecou && (
          <div className="mt-3">
            <div
              className="h-2 rounded-full bg-cosmic-surface-2 overflow-hidden"
              role="progressbar"
              aria-valuenow={feitas}
              aria-valuemin={0}
              aria-valuemax={rota.totalEtapas}
              aria-label={`Etapas feitas no ${rota.nome}`}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cosmic-gold" style={{ width: `${(feitas / rota.totalEtapas) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {concluida ? '✓ Caminho concluído' : `${feitas} de ${rota.totalEtapas} etapas feitas`}
            </p>
          </div>
        )}
        <p className="mt-4 text-sm font-semibold text-cosmic-gold">{comecou && !concluida ? 'Continuar o roteiro' : 'Ver o roteiro etapa por etapa'} →</p>
      </div>
    </Link>
  )
}

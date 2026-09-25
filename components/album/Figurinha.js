import { useState } from 'react'
import Image from 'next/image'
import { formatarNumero } from '../../lib/albumCatalogo'
import { estiloRaridade } from './raridade'

const TAMANHOS = {
  sm: { sizes: '120px', borda: 'p-[5px]', moldura: 'p-[2px]', numero: 'text-[9px] px-1', nome: 'text-[11px]', sub: 'hidden', pip: 'w-1 h-1', legenda: 'px-1 pt-1 pb-1' },
  md: { sizes: '(max-width: 640px) 45vw, 220px', borda: 'p-[7px]', moldura: 'p-[3px]', numero: 'text-[10px] px-1.5', nome: 'text-[13px] md:text-sm', sub: 'text-[10px]', pip: 'w-1.5 h-1.5', legenda: 'px-1.5 pt-1.5 pb-1.5' },
  lg: { sizes: '360px', borda: 'p-3', moldura: 'p-1', numero: 'text-xs px-2 py-0.5', nome: 'text-xl', sub: 'text-xs', pip: 'w-2 h-2', legenda: 'px-3 pt-3 pb-3' },
}

const FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="0" y2="1"%3E%3Cstop offset="0" stop-color="%23e9dcc0"/%3E%3Cstop offset="1" stop-color="%23c9b48c"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="300" height="400"/%3E%3Ctext x="50%25" y="52%25" font-family="serif" font-size="64" fill="%238a7556" text-anchor="middle"%3E%E2%9C%A0%3C/text%3E%3C/svg%3E'

/**
 * Miniatura da Wikimedia Commons (960px, tamanho padrão do cache deles, suficiente para
 * telas retina) em vez do original, que pode ter mais de 10.000px. O next/image reduz
 * daí para o tamanho exibido. Outras origens ficam como estão.
 */
export function miniaturaWikimedia(src, largura = 960) {
  const m = src && src.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w\/\w\w)\/([^/]+\.(?:jpe?g|png|webp))$/i)
  if (!m) return src
  const [, base, hash, arquivo] = m
  return `${base}/thumb/${hash}/${arquivo}/${largura}px-${arquivo}`
}

/**
 * A figurinha "santinho": borda branca de papel, filete na cor da raridade,
 * número impresso, imagem e legenda. Frente 100% figurinha — a ficha fica no verso.
 */
export function FaceFigurinha({ figurinha, tamanho = 'md', nova = false }) {
  const t = TAMANHOS[tamanho]
  const r = estiloRaridade(figurinha.raridade)
  // 0 = miniatura, 1 = original (miniatura falhou, ex.: original menor que 960px), 2 = ilustração padrão
  const [tentativa, setTentativa] = useState(0)
  const fontes = [miniaturaWikimedia(figurinha.imagem), figurinha.imagem]
  const src = !figurinha.imagem || tentativa >= 2 ? FALLBACK : fontes[tentativa]
  const lendaria = figurinha.raridade === 'lendaria'

  return (
    <div className={`relative w-full aspect-[3/4] rounded-[5px] bg-[#fbf8f0] ${t.borda} shadow-[0_1px_2px_rgba(40,28,12,.35),0_6px_14px_-6px_rgba(40,28,12,.45)]`}>
      <div className={`relative h-full rounded-[3px] overflow-hidden ${r.moldura} ${t.moldura}`}>
        {lendaria && (
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3px]">
            <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-brilho-lendario" />
          </span>
        )}
        <div className="relative h-full flex flex-col bg-[#fbf8f0] rounded-[2px] overflow-hidden">
          <div className="relative flex-1 min-h-0 bg-[#e9dcc0]">
            <Image
              src={src}
              alt=""
              fill
              sizes={t.sizes}
              unoptimized={src === FALLBACK || src.endsWith('.svg')}
              className="object-cover object-top"
              onError={() => setTentativa((n) => (n === 0 && fontes[0] === fontes[1] ? 2 : n + 1))}
            />
            <span className={`absolute top-1 left-1 rounded-sm bg-[#fbf8f0]/95 font-serif tabular-nums text-[#3b2f24] ${t.numero}`}>
              {formatarNumero(figurinha.numero)}
            </span>
          </div>
          <div className={`text-center text-[#2e241b] ${t.legenda}`}>
            <p className={`font-serif leading-tight line-clamp-2 [font-variant:small-caps] tracking-wide ${t.nome}`}>
              {figurinha.nome}
            </p>
            {figurinha.subtitulo && (
              <p className={`mt-0.5 text-[#6b5a45] leading-snug truncate ${t.sub}`}>{figurinha.subtitulo}</p>
            )}
            <div className="mt-1 flex justify-center gap-[3px]" aria-hidden>
              {Array.from({ length: r.pips }).map((_, i) => (
                <span key={i} className={`rounded-full ${r.pip} ${t.pip}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {nova && <SeloNova tamanho={tamanho} />}
    </div>
  )
}

/** Selo de lacre vermelho que marca uma figurinha recém-chegada. */
export function SeloNova({ tamanho = 'md' }) {
  const dim = tamanho === 'lg' ? 'w-14 h-14 text-xs' : tamanho === 'sm' ? 'w-8 h-8 text-[8px]' : 'w-11 h-11 text-[10px]'
  return (
    <span
      className={`absolute -top-2 -right-2 ${dim} rotate-[-14deg] rounded-full flex items-center justify-center font-serif italic text-[#fbe9d0] bg-[radial-gradient(circle_at_35%_30%,#c0394b,#8b1e2d_60%,#5e1320)] shadow-[0_2px_4px_rgba(0,0,0,.45),inset_0_0_0_2px_rgba(255,255,255,.12)]`}
    >
      Nova
    </span>
  )
}

/** Verso fechado da figurinha (usado na revelação): azul-mariano com ornamento dourado. */
export function VersoFechado() {
  return (
    <div className="relative w-full aspect-[3/4] rounded-[5px] album-capa p-2 shadow-[0_8px_20px_-6px_rgba(0,0,0,.6)]">
      <div className="h-full rounded-[3px] border border-[#c9a227]/70 p-1">
        <div className="h-full rounded-[2px] border border-[#c9a227]/40 flex flex-col items-center justify-center gap-2 text-[#e3c565]">
          <span className="text-4xl leading-none font-serif" aria-hidden>✠</span>
          <span className="font-serif italic text-sm">Álbum Sagrado</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Figurinha clicável. `rotacao` (graus) dá o ar de figurinha colada à mão.
 */
export default function Figurinha({ figurinha, tamanho = 'md', nova = false, rotacao = 0, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={rotacao ? { '--tw-rotate': `${rotacao}deg` } : undefined}
      className={`group block w-full text-left rounded-[5px] transform transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ece2cb] ${className}`}
      aria-label={`Figurinha ${formatarNumero(figurinha.numero)}: ${figurinha.nome}${nova ? ' (nova)' : ''}`}
    >
      <FaceFigurinha figurinha={figurinha} tamanho={tamanho} nova={nova} />
    </button>
  )
}

/** Itens e regra de "seção ativa" compartilhados pela barra inferior (celular) e pelo header (desktop). */
export function secaoAtiva(prefixos, pathname) {
  return prefixos.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export const ITENS_HEADER = [
  { href: '/santos', rotulo: 'Santos', prefixos: ['/santos'] },
  { href: '/vida-de-cristo', rotulo: 'Cristo', prefixos: ['/vida-de-cristo'] },
  { href: '/conexoes', rotulo: 'Bíblia', prefixos: ['/conexoes'] },
  { href: '/mapa', rotulo: 'Lugares', prefixos: ['/mapa', '/igrejas', '/aparicoes'] },
  { href: '/oracoes', rotulo: 'Rezar', prefixos: ['/oracoes', '/novenas', '/rosario'] },
  { href: '/album-sagrado', rotulo: 'Álbum', prefixos: ['/album-sagrado'] },
]

export const ITENS_MAIS = [
  { href: '/santos-do-dia', rotulo: 'Santos do dia' },
  { href: '/calendario', rotulo: 'Calendário litúrgico' },
  { href: '/igrejas', rotulo: 'Igrejas' },
  { href: '/aparicoes', rotulo: 'Aparições marianas' },
  { href: '/favoritos', rotulo: 'Favoritos' },
  { href: '/intencoes', rotulo: 'Minhas intenções' },
]

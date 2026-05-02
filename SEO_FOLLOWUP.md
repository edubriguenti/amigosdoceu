# SEO — Follow-up

Pendências da auditoria SEO (rodada em 2026-05-01 pelo `searchfit-seo:seo-auditor`). Cobre o que ainda não foi implementado nas branches `feature/conexoes-biblia` e `feature/seo-best-practices`.

## Status atual

### ✅ Concluído

| ID | Descrição | Onde |
|---|---|---|
| C1 | `<SEO>` em todas as páginas top-level (11 que estavam sem) | `pages/santos`, `igrejas`, `aparicoes`, `oracoes`, `novenas`, `album-sagrado`, `calendario`, `santos-do-dia`, `intencoes`, `favoritos`, `mapa` |
| C2 | `santos/[slug]`, `igrejas/[slug]`, `aparicoes/[slug]` convertidos para SSG (`getStaticPaths` + `getStaticProps`) | 3 arquivos `pages/*/[slug].js` |
| C3 | `/images/og-image.jpg` criado (1920×941) | `public/images/og-image.jpg` |
| C4 | `<html lang="pt-BR">` | `pages/_document.js` |
| C5 | `_app.js` não injeta mais `<title>`/`<meta description>` conflitantes | `pages/_app.js` |
| H2 | Footer expandido com 14 links (todas as 7 seções faltantes) | `components/Footer.js` |
| H3 | `<img>` → `next/image` em `SaintCard`, `AparicaoCard` e nas 3 páginas de detalhe | `components/SaintCard.js`, `AparicaoCard.js`, `pages/*/[slug].js` |
| H4 | Alt text descritivo nos cards (não só nome) | mesmos componentes |
| H5 | JSON-LD por entidade: `Person` (santos), `Place`+`ReligiousBuilding` (igrejas), `Event` (aparições) + `BreadcrumbList` em todas | nas 3 páginas de detalhe |
| H6 | Canonical em todas as páginas (consequência de C1) | via `<SEO>` |
| M1 | Inter + Playfair Display via `next/font/google` (self-hosted, swap, sem CLS) | `pages/_app.js`, `tailwind.config.cjs`, `styles/globals.css` |

---

## ⏳ Pendente (em ordem de impacto)

### M3 — Sitemap: prioridades inflacionadas + `lastmod` falso
**Arquivo:** `pages/sitemap.xml.js`

**Problema:**
- 13 de 15 páginas estáticas estão entre 0.7–1.0 — Google ignora prioridades quando todas são parecidas.
- `lastmod: today` para toda URL em toda request é ruído. Google pode descontar.

**O que fazer:**
- Reescalar prioridades:
  - Home: `1.0`
  - Hubs primários (santos, igrejas, aparicoes, vida-de-cristo, conexoes): `0.9`
  - Páginas de detalhe (santos/[slug] etc.): `0.7`
  - Calendário, santos-do-dia: `0.6` (utilitário transitório)
  - Mapa, rosario, novenas, oracoes, album-sagrado: `0.6`
  - Favoritos, intenções: `0.3` (área pessoal, sem conteúdo público)
- Substituir `lastmod: today` por `mtime` do arquivo JSON correspondente (`fs.statSync('data/santos.json').mtime`) ou por uma constante de release.

**Esforço:** ~30 min.

---

### M2 — Sitemap em build-time em vez de SSR
**Arquivo:** `pages/sitemap.xml.js`

**Problema:** usa `getServerSideProps` num site totalmente estático. Na Vercel, vira serverless function com cold-start a cada requisição.

**Opções:**
1. **Pacote `next-sitemap`** — adiciona `npm i -D next-sitemap`, configura `next-sitemap.config.js`, roda no `postbuild`. Gera `public/sitemap.xml` estático servido pelo CDN.
2. **Script custom no `postbuild`** — `scripts/generate-sitemap.mjs` lê `data/*.json` e escreve `public/sitemap.xml`.

Opção 1 é a recomendada (mantida pela comunidade, suporta multi-sitemap se crescer).

**Esforço:** ~1 h. Depende de M3 (priorities) — fazer juntos.

---

### M5 — PWA assets (manifest + theme-color + apple-touch-icon dimensionado)
**Arquivos:** novo `public/site.webmanifest`, edição em `pages/_app.js`

**O que fazer:**
- Criar `public/site.webmanifest` com `name`, `short_name`, `theme_color: '#fbbf24'`, `background_color: '#f7f3ee'`, `icons[]` (192, 512).
- Em `_app.js` `<Head>`: adicionar `<link rel="manifest" href="/site.webmanifest">` e `<meta name="theme-color" content="#fbbf24">`.
- Gerar variantes do ícone em 192×192 e 512×512 (atualmente só temos `rosario_icon2.png`).

**Por que importa:** install prompt em mobile, status bar tema correto, melhor preview em compartilhamentos. Não é fator direto de ranking, mas é UX premium.

**Esforço:** ~30 min (PWA básico) ou 1 h (com gerador de ícones).

---

### M4 — `<h1>` da home pobre em keywords
**Arquivo:** `pages/index.js` (linha ~83)

**Atual:** `<h1>Amigos do Céu</h1>` — só a marca.

**Sugestão:**
```jsx
<h1 className="...">
  Amigos do Céu
  <span className="block text-base md:text-lg text-neutral-700 font-sans font-normal mt-2">
    Portal Católico — Santos, Igrejas, Aparições e Conexões da Bíblia
  </span>
</h1>
```

Mantém o impacto visual da marca e adiciona o cluster de keywords ao H1 (maior peso semântico da página).

**Esforço:** 5 min.

---

### L4 — `viewport` restringe zoom a 5x (acessibilidade)
**Arquivo:** `components/SEO.js` (linha 41)

**Problema:** `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">` — auditores de a11y (Axe, Lighthouse) flagam `maximum-scale` como anti-pattern WCAG.

**Fix:**
```diff
- <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
+ <meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Esforço:** 1 min.

---

### L2 — `keywords` meta é dead weight
**Arquivo:** `components/SEO.js` (linhas 32-33, 40)

Search engines (Google, Bing) ignoram `<meta name="keywords">` desde ~2009. Mantemos hoje porque é inofensivo, mas poderia sair para reduzir noise no markup. Decisão de gosto — não fix.

---

### L3 — Links sociais `href="#"` placeholders
**Arquivo:** `components/Footer.js` (Facebook + Instagram)

Quando os perfis existirem, substituir. Enquanto isso, considerar remover os ícones — link com `href="#"` é mau sinal para crawlers e a11y.

**Esforço:** 5 min para remover; depende do produto para preencher de verdade.

---

## 🔮 Próximas oportunidades (Fase 2 SEO)

Não estavam na auditoria mas surgiram durante a implementação:

### Schema adicional para `/conexoes`
A página tem `LearningResource`. Cada conexão individual poderia ter sua própria URL (`/conexoes/[slug]`) com schema `Article` ou `Quotation` (citando ambos os versículos). Hoje o deep-link é via `?ref=` que não cria URL canônica indexável separada.

### Schema `Quiz`/`Question`/`Answer` para o Desafio do Dia
Schema.org tem `Quiz` mas é pouco suportado. `Question`/`Answer` é melhor. Pode emitir um por dia.

### Schema `Event` para entradas do calendário litúrgico
Cada celebração em `data/calendario-liturgico.json` poderia virar `Event` (recurring) e ser emitida em `/calendario`. Útil para Google Knowledge Graph e respostas de "quando é a festa de X".

### Internacionalização (hreflang)
Site é só pt-BR hoje. Se um dia tiver versão EN/ES, configurar `hreflang` no `<SEO>` e listar variantes no sitemap.

### Sitemap de imagens
Google aceita `<image:image>` no sitemap. Útil porque temos muito conteúdo visual (santos, igrejas, aparições).

### Sitemap de notícias / vídeo
Não aplicável hoje — só citar caso surjam vídeos (vida de Cristo poderia ter).

---

## Como continuar

1. Branch `feature/seo-best-practices` está pronta para PR contendo C1-C5, H2-H6, M1.
2. Para os pendentes: criar nova branch `feature/seo-polish` com M3+M2 (sitemap completo) e M4+M5+L4 (quick wins).
3. Re-rodar a auditoria via `/agent searchfit-seo:seo-auditor:AGENT` depois do merge para confirmar deltas.

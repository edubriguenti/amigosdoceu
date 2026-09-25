# Auditoria do fluxo diário (Etapa 1.1)

_25/09/2026. Código idêntico ao de produção (merge `24104f0`), rodado em servidor local de
produção para não alterar o progresso real no navegador._

Fluxo avaliado:

```
Hoje → Conhecer → Rezar → Rezei 🙏 → figurinha → Álbum → Conexão → Minha Jornada
```

## Fluxo: pontas soltas

| # | Onde | Problema | Correção nesta branch |
|---|---|---|---|
| F1 | Hoje → "Rezar agora" | Leva para `/oracoes/[slug]` (sai da home), e rezar ali não registra nada | Modal de oração no próprio painel; "Amém" registra a oração |
| F2 | Hoje → figurinha | "Receber" é um clique livre, sem ação que o justifique | A figurinha do dia só vem ao rezar a oração do dia |
| F3 | `/oracoes/[slug]`, oração do santo | Não há "Rezei": rezar não aparece em lugar nenhum | Botão "🙏 Rezei" (só registra) |
| F4 | Minha Jornada | Não mostra oração (dias rezados, sequência) | Cartão "🙏 Orações" |
| F5 | Hoje → Jornada | Nenhuma ponte explícita entre o painel e o progresso | "Continuar minha jornada →" no painel |
| F6 | Popup de notificações | Aparece após 3s na primeira visita e cobre o painel Hoje no celular | Nunca na home; só a partir do 2º dia de visita |

## Imagens

- 76 caminhos locais em `data/` apontavam para arquivos inexistentes: 15 orações, 5 novenas
  e 56 imagens de Conexões (estas últimas não são exibidas por nenhum componente).
  Nos cards de orações e novenas, o resultado era uma requisição 404 e uma área vazia.
- Miniaturas do Wikimedia: o otimizador do Next voltava à origem com frequência (cache
  padrão de 60s), o que provoca 429.

Correção: `imagem: null` + placeholder temático por categoria, `npm run validate:imagens`
e `minimumCacheTTL` de 30 dias com `remotePatterns`.

## Contraste (WCAG AA: 4.5:1 texto normal, 3:1 texto grande)

Script rodado no Chrome em 1280px: razão de contraste de cada nó de texto contra o fundo
efetivo (fundos com gradiente ou imagem são ignorados).

**Graves (< 3:1), texto escuro direto sobre o fundo escuro:**

| Rota | Elemento | Razão |
|---|---|---|
| `/oracoes`, `/novenas`, `/novenas/[slug]` | tags `bg-primary-100 text-primary-700`: o tom `primary-700` não existe na paleta, então o texto herda o branco (tag invisível) | 1.01 |
| `/calendario` | botão "← Anterior" (`bg-gray-100`, sem cor de texto) | 1.01 |
| `/vida-de-cristo` | título `text-gray-900` e subtítulo `text-gray-700` do hero | 1.08 / 1.86 |
| `/santos`, `/igrejas`, `/aparicoes` | parágrafo de introdução `text-gray-700` | 1.86 |
| `/aparicoes/[slug]` | "Local:" e o valor | 1.86 |
| `/calendario` | introdução, "Voltar para hoje", bloco "Tipos de celebrações" (texto sem cor sobre fundo escuro, `strong` coloridos 700) | 1.86–2.9 |
| `/vida-de-cristo` | "Modo Apresentação", porcentagem, referências bíblicas, número do evento | 1.9–2.9 |
| `/oracoes/[slug]` | botão "WhatsApp" (branco sobre `green-500`) | 2.28 |

**Moderados (3–4.5:1):**

- Texto pequeno `text-neutral-500` sobre o fundo escuro (Minha Jornada, Conexões,
  Intenções, Aparições): trocar por `neutral-400`.
- Branco sobre `bg-cosmic-blue` / `bg-accent-500` (#3b82f6, 3.68): usar `blue-600` / `accent-600`.
- Rodapé (copyright e frase final, 3.97) e abas inativas de `/favoritos` (3.7–4.0).

Sem falhas: `/santos/sao-pedro`, `/album-sagrado`.

## Fora do escopo (vai para `proximas-etapas.md`)

- `/oracoes/[slug]` e `/novenas/[slug]` usam `<Layout title>` em vez do componente `<SEO>`.
- Tema claro residual (cartões `bg-white`) em Orações e Novenas: deve ser unificado no design
  system (Etapa 4).

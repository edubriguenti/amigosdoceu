# Amigos do Céu: próximas etapas

_Atualizado em 25/09/2026, depois do merge da rodada 1 (PR #37)._

A rodada 1 está em produção: bloco "Hoje", Conexões, Minha Jornada e as correções P0.
A base de integração existe. Faltam duas coisas: **o fluxo diário fechar sem pontas soltas**
e **conteúdo suficiente para alimentá-lo**. As etapas abaixo seguem essa ordem.

| # | Etapa | Por quê | Tamanho |
|---|---|---|---|
| 0 | Confirmar produção | Parte das avaliações externas ainda vê a versão anterior | minutos |
| 1 | ✅ Rodada 1.1: polimento do fluxo | Hoje → rezar → figurinha → álbum → conexão → jornada precisa fechar | feito (`improve/fluxo-diario`) |
| 2 | Conteúdo: calendário e santos | Na maior parte do ano o "Hoje" mostra "Um dia comum" | 3–5 dias (paralelizável) |
| 3 | Rosário e Novenas como experiência | Loop diário de oração, recompensado pelo Álbum | 2–3 dias |
| 4 | Navegação mobile e design system | O site precisa parecer um produto só no celular | 2–3 dias |
| 5 | Descoberta: filtros, categorias e rede bíblica | Escalar para centenas de santos | depois |

Regra para todas as etapas: uma branch por etapa (`feature/…` ou `fix/…`), um commit por
bloco, e PR só com build e validadores passando.

---

## Etapa 0: confirmar produção

Conferido em 25/09 às 13:28 GMT: a produção está no build `TaxaG7P57_EauAz9eTqSJ`, com o
merge `24104f0`.

1. [ ] Abrir no navegador (não por crawler), com recarga forçada: `/`, `/santos-do-dia`,
   `/minha-jornada`, `/favoritos`, `/intencoes`, `/santos/sao-pedro`,
   `/aparicoes/nossa-senhora-de-fatima`, `/album-sagrado`.
2. [ ] Pedir ao revisor externo uma nova inspeção. A que ele fez pegou uma cópia antiga
   (ainda com "Peça orações" na home).
3. [ ] Apagar a branch `feature/jornada-integrada` (local e remota), que já está no `main`.

**Pronto quando:** as 8 rotas abrem, e a home mostra "Hoje na Igreja" e o card "Minha Jornada".

---

## Etapa 1: rodada 1.1, polimento do fluxo ✅

> Concluída na branch `improve/fluxo-diario`. Detalhes em `docs/auditoria-fluxo-diario.md`.
> A oração do dia é rezada no próprio painel Hoje e libera a figurinha do dia; "Rezei"
> registra as demais orações; imagens ausentes viram placeholder; contraste corrigido;
> ESLint como gate. Os itens abaixo ficam como registro.

Branch sugerida: `improve/fluxo-diario`

Objetivo: percorrer o caminho abaixo sem nenhuma ponta solta.

```
Hoje (home) → Conhecer (santo) → Rezar → Receber figurinha → Álbum → Conexão → Minha Jornada
```

### 1.1 Percorrer o fluxo e registrar os problemas
1. [ ] Em produção, no celular (≈390px) e no desktop, com o localStorage limpo, seguir o
   caminho acima e anotar cada ponto em que o usuário "cai para fora" (sem próximo passo claro).
2. [ ] Repetir com progresso já existente (figurinha recebida, novena em andamento).
3. [ ] Consolidar tudo numa lista de bugs e ajustes antes de mexer no código.

### 1.2 Pontas soltas que já conhecemos
- [ ] **"Rezar agora" não fecha o ciclo.** A home leva para `/oracoes/[slug]`, mas rezar
  ali não gera nada: nem registro nem figurinha. Hoje as figurinhas por oração só destravam
  dentro do Álbum (`components/album/OracaoDesbloqueio.js`). Proposta: um botão "Rezei 🙏"
  no fim da oração que registra o dia e, se houver figurinha ligada (santo relacionado),
  cola no álbum com o aviso `AvisoNovaFigurinha`.
- [ ] **Imagens quebradas em Orações e Novenas.** 15 de 16 orações e 5 de 5 novenas
  apontam para arquivos inexistentes (`/images/oracoes/*.jpg` responde 404). Buscar as
  imagens com a skill `wikimedia-image` ou mostrar um fundo temático quando faltar.
- [ ] **O popup de notificações cobre o bloco "Hoje" no celular.** Adiar o popup
  (`components/NotificacoesLiturgicas.js`) até a segunda visita ou até o usuário rolar a
  página, e nunca exibi-lo por cima do painel do dia.
- [ ] **Miniaturas das Conexões.** O Wikimedia responde 429 quando muitas imagens são
  otimizadas de uma vez. Avaliar `remotePatterns` + `minimumCacheTTL` no `next.config.js`
  (o `images.domains` está obsoleto) ou salvar localmente as imagens mais usadas.
- [ ] **Minha Jornada pouco visível.** Na home ela aparece só como card secundário (a
  home não tem header). Avaliar um link discreto no painel "Hoje" ("Continuar minha jornada →").
- [ ] **Contraste em páginas antigas.** Ainda há texto escuro sobre o fundo escuro, por
  exemplo nas abas de `/favoritos` e na citação do fim de `/vida-de-cristo`. Varrer
  `text-gray-7xx`, `text-neutral-9xx` e `bg-white` em `pages/` e `components/`.
- [ ] **Lint.** `npm run lint` não roda porque falta a configuração do ESLint. Criar a
  config (Next core-web-vitals), corrigir o que aparecer e manter no fluxo de PR.

**Pronto quando:** o fluxo inteiro funciona sem beco sem saída, nenhuma imagem 404 aparece
nas páginas principais e `npm run lint` passa.

**Verificação:** `npm run build`, `npm run lint`, `npm run validate:album`,
`npm run validate:relacoes`, e percorrer o fluxo no Chrome, no celular e no desktop.

---

## Etapa 2: conteúdo (calendário, santos e relações)

Branches sugeridas: `feature/calendario-completo` e uma por lote de santos.

**Métrica da etapa:** `npm run validate:album` imprime a cobertura do fluxo diário:
quantos dias do ano têm santo do dia cadastrado. Ponto de partida: **21/365 (6%)**.

Hoje o calendário tem **31 celebrações no ano**, só 21 delas ligadas a um santo, e o site
tem **19 santos**. O "Hoje", o Santos do Dia, a figurinha do dia e as Conexões dependem
desses dados.

### 2.1 Calendário
1. [ ] Completar `data/calendario-liturgico.json` com as solenidades, festas e memórias
   obrigatórias do calendário romano geral e as próprias do Brasil.
2. [ ] Ligar cada celebração aos slugs dos santos já cadastrados (`santos: [...]`).
   Faltam, por exemplo: São Sebastião (20/01), Dom Bosco (31/01) e Santa Rita (22/05).
3. [ ] Fazer o `validate:album` avisar sobre santo sem festa no calendário e sobre
   celebração que cita um slug inexistente.

### 2.2 Santos (19 → 60–100)
1. [ ] Priorizar quem tem festa no calendário e alta devoção no Brasil.
2. [ ] Adicionar com a skill `add-santo`. Para rodar em paralelo, seguir
   `.claude/rules/agent-santos.md`: um agente por lote, cada um só em `data/santos.json`
   e `public/images/santos/`.
3. [ ] Rodar `npm run validate:album` depois de cada lote. As figurinhas novas entram
   sozinhas no álbum.

### 2.3 Relações
1. [ ] Para cada santo novo, cadastrar em `data/relacoes.json` só relações **diretas e
   verificáveis**: santuário, basílica, evento de Cristo, aparição.
2. [ ] Santo↔santo vai em `santos.json` (`relacionamentos`), **em um santo só**.
3. [ ] Rodar `npm run validate:relacoes`.

**Pronto quando:** pelo menos 2 de cada 3 dias do ano têm celebração com santo cadastrado,
e cada santo tem ao menos uma conexão.

---

## Etapa 3: Rosário e Novenas como experiência

Branch sugerida: `feature/oracao-guiada`

### 3.1 Rosário
1. [ ] Modo contemplativo em tela cheia: mistério do dia, conta por conta
   ("Ave-Maria 3/10"), botões Anterior/Próximo e suporte a teclado.
2. [ ] Tela de conclusão com tempo, mistérios e número de Ave-Marias, e uma figurinha de
   Cristo ligada ao mistério rezado (ex.: Luminosos → `cristo:batismo-jordao`).
3. [ ] Corrigir o `hooks/useRosario.js`: hoje ele grava no mount antes de ler os dados
   salvos (no Strict Mode as estatísticas podem voltar a zero). Usar o mesmo padrão de
   leitura e escrita síncrona do `useAlbum`.

### 3.2 Novenas
1. [ ] Linha do tempo "Dia 4 de 9" com os dias marcados (✓ / ● / ○) e "Volte amanhã".
2. [ ] Mostrar a novena em andamento no bloco "Hoje" da home, quando houver.
3. [ ] Ao concluir a novena, colar a figurinha do santo relacionado.

**Pronto quando:** rezar um terço ou um dia de novena termina com uma tela de conclusão e
um próximo passo, e isso se reflete em Minha Jornada.

---

## Etapa 4: navegação mobile e design system

Branch sugerida: `improve/navegacao-mobile`

1. [ ] Barra inferior no celular com 5 ações: Início · Santos · Rezar · Álbum · Jornada.
2. [ ] No desktop, header curto: Santos · Cristo · Bíblia · Lugares · Rezar · Álbum · ☰ Mais.
3. [ ] Extrair componentes comuns: `SacredCard`, `EntityHero`, `PrayerBlock`,
   `ProgressBar` (hoje duplicada em Minha Jornada e na Vida de Cristo), `SectionLabel`.
4. [ ] Unificar os tokens de cor: o tema escuro `cosmic` já virou o padrão do site todo,
   então documentar isso e remover os restos do tema claro antigo.

---

## Etapa 5: descoberta (depois)

- Filtros e categorias de santos: apóstolos, mártires, doutores, papas, fundadores,
  santos do Brasil, padroeiro de… (`lib/searchUtils.js` já tem a base).
- Conexões da Bíblia como rede: passagem ↔ evento de Cristo ↔ santo ↔ igreja, usando o
  mesmo grafo de `lib/relacoesGrafo.js`, com os tipos novos `biblia:` e `trilha:`.
- Página do dia no calendário: cada celebração vira um mini-hub
  (Ver santo · Ver no Álbum · Rezar · Novena relacionada).

---

## Comandos de referência

```bash
npm run dev                 # desenvolvimento em http://localhost:3000
npm run build               # build de produção (confere ISR e o tamanho do bundle)
npm run validate:album      # catálogo do Álbum Sagrado
npm run validate:relacoes   # grafo de relações + santos.relacionamentos
```

# Histórico de alterações

Registro cumulativo, mais recente primeiro. Planejamento em `docs/proximas-etapas.md`.

## 2026-10-20: página 404 em português com atalhos

- **Problema:** qualquer endereço inexistente (ex.: `/xyz`, `/busca`) mostrava o 404 padrão do Next: fundo branco, "This page could not be found" em inglês, sem cabeçalho, rodapé nem caminho de volta. Reproduzido no Chromium (390px).
- **Solução:** `pages/404.js` com o `Layout` do site (header/barra inferior), mensagem em português, botão "Voltar ao início" e grade de atalhos (Santos, Orações, Álbum, Conexões, Calendário, Lugares). `noindex`.
- **Arquivos:** `pages/404.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px e 1280px): `/xyz` responde 404 com título "Página não encontrada", `noindex,nofollow`, sem overflow horizontal e 0 erros de página; clicar em "Santos" navega para `/santos`. `lint` (0 erros, 18 avisos preexistentes), `validate:album`, `validate:imagens` e `build` passaram. Captura de tela conferida.
- **Limitações:** não há busca global (`/busca` não existe) — oportunidade para uma próxima rodada; sem teste automatizado (o projeto não tem runner).

## 2026-10-19: imagem que falha vira placeholder temático em santos, aparições e igrejas

- **Problema:** as imagens remotas do Wikimedia (11 dos 19 santos) respondem 429/500 com frequência. Reproduzido no Chromium (390px): em `/santos` os cards mostravam só o texto alternativo ("Imagem de Frei Galvão — …") sobre um bloco escuro, e o mesmo na página do santo e nos santos relacionados. `SaintCard`/`AparicaoCard` também não tinham fallback quando `imagem` era `null`, e `ChurchCard` usava `<img>` sem fallback.
- **Solução:** novo `components/ImagemSagrada.js` (`next/image` + `onError` → `PlaceholderSagrado` com o ícone da categoria; sem `src` também cai no placeholder). Usado nos cards e páginas de detalhe de santos, aparições e igrejas e em `RelacionamentosSanto`. `PlaceholderSagrado` ganha as props `icone` e `compacto`.
- **Arquivos:** `components/ImagemSagrada.js`, `components/PlaceholderSagrado.js`, `SaintCard.js`, `AparicaoCard.js`, `ChurchCard.js`, `RelacionamentosSanto.js`, `pages/{santos,igrejas,aparicoes}/[slug].js`, `docs/proximas-etapas.md`.
- **Testes:** no ambiente da rotina o Wikimedia é inacessível (ENOTFOUND), o que reproduz a falha: antes, 11 imagens quebradas em `/santos`; depois, 0 imagens quebradas e 11 placeholders em `/santos`, 13 em `/igrejas`, 2 em `/santos/santo-agostinho`; 0 erros de página. `lint` (0 erros, 18 avisos; um a menos que antes), `validate:album`, `validate:imagens` e `build` passaram. Captura de tela conferida.
- **Pendências:** o caminho em que a imagem carrega com sucesso não foi exercitado no navegador (sem acesso ao Wikimedia); `EntidadesRelacionadas`, `TimelineCard` e Conexões ainda não usam o fallback; o placeholder claro destoa um pouco do tema escuro; sem teste automatizado (o projeto não tem runner). A raiz do problema (hospedar localmente as imagens mais usadas) segue na Etapa 1.2.

## 2026-10-18: calendário litúrgico: celebrações que faltavam e data errada de hoje

- **Problema:** o calendário tinha só 36 dias preenchidos, sem Nossa Senhora Aparecida (12/10, padroeira do Brasil), Assunção, Natividade de Maria, os apóstolos e evangelistas etc. Pior: em 18/10 o "Hoje" da home e `/santos-do-dia` mostravam São Paulo da Cruz (data de sua morte), escondendo a festa de São Lucas. Reproduzido no Chromium (390px) em `/`, `/santos-do-dia` e `/calendario`.
- **Solução:** São Paulo da Cruz movido para 20/10 (calendário romano geral) e 33 celebrações universais de data certa adicionadas (festas dos Apóstolos e Evangelistas, Assunção, Aparecida, Guadalupe, Santa Luzia, Rosário, Santos Inocentes etc.), com `santos: []` quando o santo ainda não está cadastrado. Sem mudança de código.
- **Arquivos:** `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album` e `validate:relacoes` sem erros, `lint` 0 erros (19 avisos preexistentes), `build` ok. Chromium após o build: home e `/santos-do-dia` mostram "São Lucas, Evangelista · Festa" em 18/10, `/calendario` lista 7/10 e 12/10; 0 erros de página.
- **Pendências:** datas de Frei Galvão (10/05 e 23/12) e Santa Teresinha (30/09 e 01/10) parecem divergir do calendário brasileiro e não foram alteradas por falta de fonte; memórias facultativas e próprias do Brasil seguem em aberto (Etapa 2.1). Datas conferidas de memória, sem fonte oficial consultada: vale revisão.

## 2026-10-17: header de desktop com as seções do site

- **Problema:** em telas largas as páginas internas só tinham "← Amigos do Céu" e "Minha Jornada" no topo (a barra inferior some a partir de `md`). Reproduzido no Chromium (1280px) em `/santos`: nenhum caminho direto para outras seções; Cristo, Bíblia, Lugares, Calendário, Favoritos etc. exigiam voltar à home.
- **Solução:** `MinimalHeader` ganha, a partir de `md`, a navegação Santos · Cristo · Bíblia · Lugares · Rezar · Álbum · Mais ▾ (Santos do dia, Calendário, Igrejas, Aparições, Favoritos, Intenções), com `aria-current` na seção ativa. O menu "Mais" fecha com Esc, clique fora e ao navegar. Itens e regra de seção ativa ficam em `lib/navegacao.js` (compartilhada com `BottomNav`).
- **Arquivos:** `components/MinimalHeader.js`, `components/BottomNav.js`, `lib/navegacao.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium): em 1280px a seção ativa é "Rezar" em `/rosario` e "Santos" em `/santos`; "Mais" abre 6 links, fecha com Esc e ao navegar para `/calendario`; em 390px a nav do header fica oculta; 0 erros de página. `lint` (0 erros, 19 avisos preexistentes), `validate:album` e `build` passaram. Captura de tela conferida.
- **Pendências:** entre 768 e ~900px o header não foi inspecionado visualmente; menu "Mais" sem navegação por setas (Tab funciona); sem teste automatizado (o projeto não tem runner).

## 2026-10-16: terço rezado conta na sequência de orações

- **Problema:** concluir o Rosário dava figurinha, mas não registrava nada em `amigos-do-ceu:oracoes`; quem rezava o terço todo dia continuava com "sequência 0" em Minha Jornada e no bloco Hoje.
- **Solução:** ao chegar ao fim, o terço é registrado como oração do dia com a ref `rosario:<misterio>` (`refOracaoRosario` em `lib/rosarioConclusao.js`; `registrarOracaoHoje` é idempotente) e a tela de conclusão mostra "N dias seguidos de oração". Não altera a figurinha do dia (que exige a oração do dia específica).
- **Arquivos:** `components/RosarioVirtual.js`, `lib/rosarioConclusao.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px): com oração registrada ontem e rosário Luminoso no passo 79 de 80, "Próximo" mostra "2 dias seguidos de oração"; `localStorage` ganha `rosario:luminosos` no dia de hoje e permanece igual após recarregar (sem duplicar); 0 erros de página. Resultados de lint/validadores/build abaixo no PR.
- **Pendências:** só o mistério Luminoso foi exercitado; mistérios/Ave-Marias rezadas em Minha Jornada e modo contemplativo (3.1.1) seguem abertos; sem teste automatizado (o projeto não tem runner). PR: ver lista de PRs.

## 2026-10-15: Rosário conclui com figurinha de Cristo e próximo passo

- **Problema:** a tela "Rosário Completo!" não dava recompensa nem caminho: rezar um terço inteiro não tinha ligação com o Álbum (diferente da novena, que já cola a figurinha ao concluir) e os botões de controle (anterior, pausar, próximo, cancelar) eram só ícones, sem nome acessível.
- **Solução:** ao chegar ao fim, a figurinha de Cristo do mistério é colada no Álbum (Gozosos → Nascimento, Luminosos → Batismo no Jordão, Dolorosos → Agonia no Horto, Gloriosos → Ressurreição; `lib/rosarioConclusao.js`), com aviso "Nova figurinha" (ou "Figurinha deste mistério" se já a tinha) e link direto para ela; novo botão "Minha Jornada". Controles com `aria-label`.
- **Arquivos:** `lib/rosarioConclusao.js`, `pages/rosario.js` (`getStaticProps` com `resumoFigurinha`), `components/RosarioVirtual.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px): rosário Luminoso no passo 79 de 80 → "Próximo passo" → tela de conclusão com "Nova figurinha: Batismo no Rio Jordão", `localStorage` grava `cristo:batismo-jordao` com origem `rosario`; recarga mostra "Figurinha deste mistério" (sem duplicar); o link abre `/album-sagrado/vida-publica?figurinha=cristo:batismo-jordao`; 0 erros de página/console. `lint` (0 erros, 19 avisos preexistentes), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram.
- **Pendências:** só o mistério Luminoso foi exercitado no navegador (os demais usam o mesmo código, mapeamento conferido só pelo build/catálogo); rezar o terço ainda não conta na sequência de orações (não há `oracao:` para o terço); modo contemplativo (3.1.1) segue aberto; sem teste automatizado (o projeto não tem runner).

## 2026-10-15: barra de navegação inferior no celular

- **Problema:** nas páginas internas o único caminho de navegação era "← Amigos do Céu" (voltar à home) e o ícone da Jornada. Reproduzido no Chromium (390px): de `/oracoes` para o Álbum eram dois passos via home; nenhuma página internamente levava às outras seções.
- **Solução:** `BottomNav` fixa no celular (Início · Santos · Rezar · Álbum · Jornada), com `aria-current` na seção ativa (Rezar cobre orações, novenas e rosário), alvos de 56px e área segura do iOS. Some a partir de `md`. A home (sem header) não a mostra. Toasts e avisos fixos (`FigurinhaNoSite`, `DescobertaToast`, `NotificacoesLiturgicas`, barra da Vida de Cristo) subiram para não ficarem atrás dela; o `Layout` reserva espaço no rodapé.
- **Arquivos:** `components/BottomNav.js`, `components/Layout.js`, `components/album/FigurinhaNoSite.js`, `components/conexoes/DescobertaToast.js`, `components/NotificacoesLiturgicas.js`, `pages/vida-de-cristo.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium): nav visível e com item ativo correto em 390px (`/santos/sao-pedro`, `/rosario`), oculta em 1200px e na home, clique em "Álbum" navega, rodapé não fica sob a barra, sem overflow horizontal, 0 erros de página. `lint` (0 erros, 19 avisos preexistentes), `validate:album` e `build` passaram.
- **Pendências:** header de desktop (Etapa 4.2) segue aberto; `validate:relacoes`/`validate:imagens` não rodados (sem mudança de dados); sem teste automatizado (o projeto não tem runner).

## 2026-10-14: Rosário: navegar por década cai no lugar certo e progresso chega a 100%

- **Problema:** `useRosario` assumia 13 passos por década e 75 no total, mas o `data/rosario.json` gera 14 por década e 80. Reproduzido no Chromium: ir à década 5 marcava 79% e a barra da lateral não acompanhava o avanço com "próximo" (a década só mudava ao clicar na lateral); no fim a barra passava de 100%.
- **Solução:** novo `lib/rosarioPassos.js` (puro) monta a lista de passos a partir do JSON e é a fonte única da posição das décadas e do progresso; a década atual passa a ser derivada do passo; "próximo" não passa do passo final.
- **Arquivos:** `lib/rosarioPassos.js`, `hooks/useRosario.js`, `components/RosarioVirtual.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 1100px): décadas 2/5/1 → 26%/79%/9% (= 21, 63, 7 de 80 passos) com a lateral destacando a década certa; +14 passos a partir da década 1 move o destaque para a década 2; da década 5 ao fim são 17 passos, 100% e tela "Rosário Completo!"; 0 erros de página. `lint` (0 erros, 19 avisos preexistentes), `validate:album` e `build` passaram.
- **Pendências:** modo contemplativo e figurinha ligada à conclusão (3.1) seguem abertos; sem teste automatizado (o projeto não tem runner). `npm ci` falha: `package-lock.json` fora de sincronia com `package.json` (@emnapi); usei `npm install --no-save`.

## 2026-10-14: linha do tempo "Dia X de 9" na novena

- **Problema:** a página da novena em andamento só mostrava uma barra de % e uma lista longa de dias; no celular não dava para ver de relance em que dia a pessoa estava, e nada dizia que o dia já fora rezado. Os botões de marcar/expandir não tinham nome acessível.
- **Solução:** fileira de marcos (✓ rezado, ● próximo, número pendente) no topo do "Seu Progresso", texto "Dia X de 9: título" e, se o último dia foi marcado hoje, "Volte amanhã para o Dia X". Botões com `aria-label`/`aria-pressed`/`aria-expanded`. Marcar dias continua livre (sem bloqueio por data).
- **Arquivos:** `components/NovenaTracker.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px): início (marco 1 atual), 2 dias marcados (✓ ✓ ● e "Volte amanhã"), recarga preserva, 9 dias (sem bloco de próximo dia), 0 erros de página; captura de tela confirmou que os 9 marcos cabem na largura (corrigido estouro inicial). `lint` (0 erros), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram.
- **Pendências:** sem teste automatizado (o projeto não tem runner); "Volte amanhã" é informativo.

## 2026-10-14: novena em andamento aparece no bloco "Hoje" da home

- **Problema:** quem iniciava uma novena não via nada dela na home (sem header, o bloco "Hoje" só mostrava celebração, figurinha e oração). Reproduzido no Chromium (390px) com uma novena no dia 4 de 9: nenhuma menção. O único caminho de volta era Novenas ou Minha Jornada.
- **Solução:** faixa "Novena em andamento" no painel Hoje, com nome, "Dia X de 9" e botão contextual (Rezar o dia de hoje / Ver novena se já rezou hoje / Finalizar se todos os dias estão marcados); com mais de uma, mostra a tocada mais recentemente e "+N em andamento". Leitor puro `getNovenasEmAndamento` em `lib/jornada.js` (tolera dado ausente ou corrompido; sem `useNovena`, para não gravar no mount da home).
- **Arquivos:** `components/HojeNoCeu.js`, `lib/jornada.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px) em 6 estados: dia pendente, rezado hoje, pronta, duas novenas, sem novenas, JSON corrompido e itens inválidos; faixa correta em cada um e 0 erros de console/página. `lint` (0 erros, 19 avisos preexistentes), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram.
- **Pendências:** linha do tempo "Dia X de 9" na página da novena (3.2.1); sem teste automatizado (o projeto não tem runner). PR: ver lista de PRs do repositório.

## 2026-10-13: Novenas: progresso não se perde mais e conclusão com figurinha

- **Problema:** a página da novena e o `NovenaTracker` usavam duas instâncias de `useNovena`, cada uma com cópia própria do estado. Reproduzido no Chromium: marcar 3 dias e clicar em "Salvar Intenção" apagava os dias marcados (a instância da página regravava o `localStorage` com a cópia velha). Além disso, "Finalizar Novena" deixava a tela com "Cancelar Novena" de uma novena já encerrada, sem confirmação nem contagem no histórico até recarregar.
- **Solução:** uma única instância do hook, criada na página e passada ao tracker; tela "Novena concluída" com próximo passo (Ver no Álbum, Minha Jornada); a figurinha do santo relacionado é colada ao concluir (Etapa 3.2.3); removido o `confirm()` ao finalizar.
- **Arquivos:** `pages/novenas/[slug].js`, `components/NovenaTracker.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px): antes da correção o progresso era perdido (0 de 3 dias após recarregar), depois foi preservado; fluxo iniciar → 9 dias → finalizar mostra a conclusão, a figurinha nova e o histórico "1 vez" sem recarregar. `lint` (0 erros, 19 avisos preexistentes), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram.
- **Pendências:** linha do tempo "Dia X de 9" e novena em andamento no bloco "Hoje" (3.2.1, 3.2.2); novenas sem santo relacionado não dão figurinha; imagem do santo na página da novena segue quebrada (404); sem teste automatizado (o projeto não tem runner).

## 2026-10-13: Rosário não apaga mais o progresso salvo ao carregar

- **Problema:** `hooks/useRosario.js` gravava no `localStorage` no primeiro render, antes de ler os dados salvos. Reproduzido no navegador (dev, Strict Mode): com 3 rosários e 30 min salvos, recarregar `/rosario` zerava as estatísticas. Estatísticas parciais/corrompidas também podiam quebrar a tela.
- **Solução:** a gravação só começa depois da leitura (`carregado`); estatísticas salvas são mescladas com os valores padrão; falha ao gravar não derruba a página.
- **Arquivos:** `hooks/useRosario.js`, `docs/proximas-etapas.md`.
- **Testes:** reprodução no Chromium (Playwright) antes e depois: estatísticas preservadas ao recarregar; rosário em andamento retomado; JSON corrompido sem erro de página. `lint` (0 erros, 19 avisos preexistentes), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram.
- **Pendências:** modo contemplativo e tela de conclusão com figurinha (Etapa 3.1) seguem abertos; sem teste automatizado do hook (o projeto não tem runner de testes).

## 2026-10-13: calendário litúrgico mais completo e validado

- **Problema:** só 21/365 dias tinham santo do dia; 3 santos cadastrados (São Sebastião, Dom Bosco, Santa Rita) nunca apareciam no "Hoje". Além disso, março tinha a chave `"25"` repetida: Santa Catarina de Sena (duplicada, a memória real é 29/04) escondia a Anunciação do Senhor.
- **Solução:** novas celebrações ligadas a santos existentes (20/01, 31/01, 22/02, 22/05, 11/07); removida a duplicata; `validate:album` agora dá erro para slug inexistente e dia repetido, e avisa sobre santo sem festa.
- **Arquivos:** `data/calendario-liturgico.json`, `scripts/validate-album.mjs`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes`, `validate:imagens`, `lint` (0 erros, 19 avisos preexistentes) e `build` passaram. Não houve teste visual no navegador.
- **Pendências:** cobertura 25/365 (7%); falta conteúdo (mais santos e celebrações), Etapa 2.2. Datas 21/03 (São Bento) e 25/03 já existentes não foram revisadas.

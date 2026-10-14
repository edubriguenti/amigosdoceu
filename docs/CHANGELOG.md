# Histórico de alterações

Registro cumulativo, mais recente primeiro. Planejamento em `docs/proximas-etapas.md`.

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

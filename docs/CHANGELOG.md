# Histórico de alterações

Registro cumulativo, mais recente primeiro. Planejamento em `docs/proximas-etapas.md`.

## 2026-11-12: busca encontra as peregrinações (rotas, etapas e paradas)

- **Problema:** as Peregrinações (PR #75) não existiam para a busca global. No Chromium (390px e 1280px, build de produção), `/busca?q=caminho da fé` não trazia a rota (só "Via Sacra" e Santa Teresinha para "caminho") e `/busca?q=santiago` trazia só a catedral. Quem procura uma cidade do percurso ("Pamplona", "Andradas") não achava nada.
- **Solução:** o índice da busca passa a incluir cada rota, cada etapa (título "Origem → Destino", com rota, número e km) e cada parada sem página própria; etapas e paradas abrem direto em `?etapa=<n>`. Novo filtro "Peregrinações" e sugestão "Peregrinação". Na ordenação, em empate a rota vem antes das etapas, e as paradas (78) ficam sempre depois das páginas, para não afogar santos, orações e igrejas (em "maria" elas tomavam as posições 5 a 22 antes desse ajuste).
- **Testes automatizados (novo):** `npm test` roda o runner nativo do Node sobre `tests/*.test.mjs`, sem dependência nova. Primeiro arquivo: `tests/busca.test.mjs` (10 testes de `lib/busca.js`).
- **Arquivos:** `lib/busca.js`, `pages/busca.js`, `tests/busca.test.mjs`, `package.json`, `CLAUDE.md`, `docs/proximas-etapas.md`.
- **Testes:** `npm test` 10/10; `lint` 0 erros (18 avisos preexistentes); `validate:album`, `validate:relacoes`, `validate:imagens`, `validate:peregrinacoes` sem erros; `build` ok. Chromium (390px e 1280px) após o build: "caminho da fé" → a rota; "santiago" → rota em 1º, catedral, etapa 33 e 6 paradas; "Pamplona" → etapas 4 e 3 e uma parada; "cruz de ferro" → parada da etapa 24; "andradas" + filtro "Peregrinações" (`aria-pressed=true`) → clicar em "Andradas → Barra" abre `?etapa=2` com a etapa em foco e Voltar retorna à busca com o termo; só com teclado (digitar, Tab, Enter) chega-se à etapa 24; "xyzabc" mantém o estado vazio; varredura de 21 rotas sem overflow e 0 erros de página.
- **Limitações:** o HTML de `/busca` cresceu de 64 KB para 108 KB sem compressão (o índice ganhou 127 itens); não medi o tamanho comprimido. A busca continua sem tolerância a erro de digitação. Não testado com leitor de tela.

## 2026-11-11: São Josafá no site, ligado à memória de 12/11

- **Problema:** a exploração (Chromium, 390px, 18 rotas: sem overflow, sem erros de página, sem alvos < 32px) não achou defeito de UI; a lacuna era de conteúdo: amanhã (12/11) a memória de São Josafá não tinha santo ligado, página nem figurinha (24 santos no site).
- **Solução:** novo santo `sao-josafa` (arcebispo de Polotsk, c. 1580–1623, mártir da unidade da Igreja) ligado à celebração de 12/11. A figurinha entra sozinha no Álbum e a oração dele vira a oração do dia.
- **Arquivos:** `data/santos.json`, `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes` e `validate:imagens` sem erros; `lint` 0 erros (18 avisos preexistentes); `build` ok (gera `/santos/sao-josafa`). Chromium (390px) após o build: a página abre com "Festa: 12 de novembro" e a oração; a visita registra `santo:sao-josafa` no álbum; `/busca?q=josafa` lista o santo; sem overflow e 0 erros de página. **Não testado:** o bloco "Hoje" da home em 12/11 (home gerada no build) e o clique em "Rezar".
- **Limitações:** sem imagem (`imagem: null`, placeholder). Texto e oração escritos de memória, vale revisão (datas e título de mártir). Sem teste automatizado (o projeto não tem runner).

## 2026-11-10: mapa e busca com alvos de 44px; rodapé sem links de rede social mortos

- **Problema:** em `/mapa` (Chromium, 390px) os cinco botões de filtro/ação tinham 40px de altura e não informavam qual filtro estava ativo a leitores de tela; o link "os santos" do estado vazio de `/busca` tinha 20px. O rodapé (todas as páginas internas) mostrava ícones de Facebook e Instagram com `href="#"`: não levavam a lugar nenhum e tinham 36px.
- **Solução:** `min-h-[44px]` e `aria-pressed` nos botões do mapa; `py-3` nos links do estado vazio da busca; ícones sociais removidos do rodapé (o projeto não tem perfis reais cadastrados; reintroduzir com a URL oficial quando existir).
- **Arquivos:** `components/MapaInterativo.js`, `pages/busca.js`, `components/Footer.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px) antes e depois: alvos < 44px em `/busca` vazia e `/mapa` caíram de {link 20px, botões 40px, 2 ícones 36px} para só o link oculto "Pular para conteúdo" e os controles do Leaflet (zoom 30px, atribuição 15px); clique em "Igrejas" muda `aria-pressed` (Igrejas true, Todos false) e "Mostrar Rotas" fica `aria-pressed=true`; rodapé com 0 links sociais; 0 erros de página. `lint` (0 erros, 18 avisos preexistentes), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram.
- **Pendências:** botões de zoom (30px) e atribuição do Leaflet seguem pequenos; o mapa ainda usa `alert()` para pedir localização; sem teste automatizado (o projeto não tem runner).

## 2026-11-09: links de ação do fluxo diário com alvo de toque de 44px no celular

- **Problema:** varredura em 24 rotas (Chromium, 390px, build de produção) mostrou links e botões de ação com 17–24px de altura nas telas que o usuário mais percorre: "Continuar minha jornada →" (home), "Rezar agora →" e "Ver igreja →" (`/santos-do-dia`), "Voltar para hoje" e "Ver biografia do santo →" (`/calendario`), "Ver no álbum" e o "×" (28px) do aviso de figurinha nova, "Ver no Google Maps", "Assistir no YouTube" e os breadcrumbs de orações/novenas. Alvos tão pequenos geram toques errados (o PR #69 já tinha corrigido o mesmo problema nas Conexões).
- **Solução:** `inline-flex items-center min-h-11` (convenção já usada em `OracaoCard`/`novenas/index`) nesses links; "×" do aviso passou a 44×44 com margem negativa para não aumentar o card; breadcrumbs viraram `flex` com `py-1` para a faixa não crescer.
- **Arquivos:** `components/HojeNoCeu.js`, `components/CalendarioMensal.js`, `components/YouTubePlayer.js`, `components/album/FigurinhaNoSite.js`, `pages/santos-do-dia.js`, `pages/aparicoes/[slug].js`, `pages/oracoes/[slug].js`, `pages/novenas/[slug].js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px) antes: 17–24px nos links citados; depois: nenhum deles aparece mais com altura/largura < 32px em `/`, `/santos-do-dia`, `/calendario`, `/oracoes/pai-nosso`, `/santos/sao-leao-magno`, `/mapa`, `/aparicoes/nossa-senhora-de-fatima`, `/novenas/novena-sao-jose`; aviso de figurinha: "Ver no álbum" 88×44, "×" 44×44, fecha ao clicar, sem overflow horizontal, 0 erros de página; captura do breadcrumb de `/oracoes/pai-nosso` sem quebra visual. `lint` 0 erros (18 avisos preexistentes) e `build` ok.
- **Limitações:** `/busca` (link "os santos" no estado vazio, 20px) e botões de filtro do `/mapa` (21px) seguem pequenos; imagens remotas retornam 500 no sandbox (proxy sem acesso ao Wikimedia), sem relação com a mudança; sem teste automatizado (o projeto não tem runner). Não rodei `validate:*` (nenhum JSON alterado).

## 2026-11-08: "Conhecer" da home leva à igreja nas celebrações da Dedicação de Latrão, Aparecida e Guadalupe

- **Problema:** na Festa de 09/11 (Dedicação da Basílica de Latrão) o botão "Conhecer" do bloco "Hoje" levava a `/santos-do-dia`, que repete a mesma celebração (beco sem saída), embora a igreja `sao-joao-laterano` exista no site. Em 08/11 a "próxima celebração" apontava para `/calendario`. O mesmo vale para Aparecida (12/10) e Guadalupe (12/12), que também não têm santo ligado.
- **Solução:** campo opcional `igrejas: [slug]` nas celebrações do calendário (3 preenchidas). `lib/hoje.js` o expõe (`igrejas`, `igrejaSlug`); "Conhecer" e a "próxima celebração" da home usam santo → igreja → fallback; `/santos-do-dia` ganha "⛪ Ver igreja" (dia sem santo) e "Ver igreja →" nas próximas celebrações; o painel do dia em `/calendario` ganha "Conhecer a igreja →" (44px). `validate:album` dá erro para igreja inexistente.
- **Arquivos:** `data/calendario-liturgico.json`, `lib/hoje.js`, `components/HojeNoCeu.js`, `components/CalendarioMensal.js`, `pages/santos-do-dia.js`, `scripts/validate-album.mjs`, `CLAUDE.md`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album` e `validate:relacoes` sem erros; slug inválido faz o validador falhar ("igreja inexistente"); `lint` 0 erros (18 avisos preexistentes); `build` ok. Chromium (390px, build de produção, relógio simulado): em 08/11 o link da próxima celebração vai a `/igrejas/sao-joao-laterano`; em 09/11 "Conhecer" abre a Basílica de Latrão; `/santos-do-dia` mostra "Ver igreja"; `/calendario` (dia 9) mostra "Conhecer a igreja →" com 44px; sem overflow. Antes da correção o "Conhecer" apontava para `/santos-do-dia` (reproduzido).
- **Limitações:** com o relógio simulado aparecem erros de hidratação #418 (a data do cliente difere do HTML estático); sem simulação, 0 erros nas 4 páginas testadas. Não testado: "Rezar" e a figurinha em 09/11. Sem teste automatizado (o projeto não tem runner).

## 2026-11-07: Conexões: carrossel com alvos de toque decentes e navegação que não muda de escopo

- **Problema:** em `/conexoes` (Chromium, 390px) o carrossel "Conexão em destaque" tinha 28 bolinhas de 8×8 px como botões (`role=tab`): alvos de toque minúsculos e 28 paradas de Tab. Além disso, o primeiro "Próxima" restringia silenciosamente a lista ao evento da conexão (de "28" para 13): o efeito de deep-link reagia ao próprio `?ref=` que `setConexaoAtiva` escreve, então "Próxima" nunca saía do evento e a volta ao início ocorria em 13.
- **Solução:** acima de 7 conexões, as bolinhas dão lugar a "Conexão N de M" (`aria-live`); com 7 ou menos, as bolinhas ficam com área de toque de 44px; setas anterior/próxima com 44×44px. O contexto passa a ignorar o eco do `?ref=` que ele mesmo escreveu; deep-link externo continua selecionando o evento.
- **Arquivos:** `components/conexoes/ConexaoEmDestaque.js`, `contexts/ConexoesContext.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px, build de produção): contador "1 de 28" → "2 de 28" → volta a "28 de 28"; setas medem 44×44px; eventos com ≤7 conexões mostram bolinhas e os maiores mostram o contador (8 e 13); `?ref=numeros-21-joao-3` abre o evento "Lei" com "2 de 8"; 0 erros de página. `lint` 0 erros (18 avisos preexistentes), `validate:album`, `validate:relacoes`, `validate:imagens` e `build` passaram. Antes da correção (mesmo ambiente) as 28 bolinhas e o salto 28 → 13 foram reproduzidos.
- **Limitações:** navegação só por teclado nas bolinhas (≤7) não foi exercitada; as imagens remotas retornam 500 no sandbox (proxy sem acesso ao Wikimedia), então não deu para avaliar miniaturas; sem teste automatizado (o projeto não tem runner).

## 2026-11-06: São Leão Magno no site, ligado à memória de 10/11

- **Problema:** em 06/11 a home mostrava "Um dia comum" (sem celebração no calendário até 09/11); a próxima memória litúrgica de santo, 10/11 (São Leão Magno, Papa e Doutor), não tinha santo ligado, página nem figurinha (23 santos no site).
- **Solução:** novo santo `sao-leao-magno` (Papa, c. 400–461, Doutor da Igreja) ligado à celebração de 10/11. A figurinha entra sozinha no Álbum e a oração dele vira a oração do dia.
- **Arquivos:** `data/santos.json`, `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes` e `validate:imagens` sem erros; `lint` 0 erros (18 avisos preexistentes); `build` ok (gera `/santos/sao-leao-magno`). Chromium (390px) após o build: `/santos/sao-leao-magno` abre com "Festa: 10 de novembro"; a visita cola a figurinha (álbum passa de 81 para 82); `/busca?q=leao` lista o santo; sem overflow e 0 erros de página. **Não testado:** o bloco "Hoje" da home em 10/11 (home gerada no build, data real é 06/11) e o clique em "Rezar". Houve um timeout isolado de `networkidle` em `/busca` numa segunda carga; refeita com `domcontentloaded`, sem problema.
- **Limitações:** sem imagem (`imagem: null`, placeholder). Texto e oração escritos de memória, vale revisão. Sem teste automatizado (o projeto não tem runner).

## 2026-11-05: São Martinho de Tours no site, ligado à memória de 11/11

- **Problema:** em 05/11 a home mostrava "Um dia comum" e a próxima celebração com santo era a de 11/11 (São Martinho de Tours), sem santo ligado, sem página e sem figurinha (22 santos no site).
- **Solução:** novo santo `sao-martinho-de-tours` (bispo de Tours, c. 316–397, padroeiro dos soldados e da França) ligado à celebração de 11/11. A figurinha entra sozinha no Álbum e a oração dele vira a oração do dia.
- **Arquivos:** `data/santos.json`, `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes` e `validate:imagens` sem erros; `lint` 0 erros (18 avisos preexistentes); `build` ok (gera `/santos/sao-martinho-de-tours`). Chromium (390px) após o build: `/santos/sao-martinho-de-tours` abre com "Festa: 11 de novembro" e a oração; a figurinha `santo:sao-martinho-de-tours` é registrada na visita; sem overflow e 0 erros de página. **Não testado:** o bloco "Hoje" da home em 11/11 (a home é gerada no build; simular a data quebrou o build, então só confirmei o dado do calendário) e o clique em "Rezar".
- **Limitações:** sem imagem (`imagem: null`, placeholder). Texto e oração escritos de memória, vale revisão. Sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-11-04: São Carlos Borromeu no site, ligado à memória de hoje

- **Problema:** em 04/11 (memória de São Carlos Borromeu) a home mostrava a celebração sem santo ligado e sem oração própria; ele não existia no site (21 santos).
- **Solução:** novo santo `sao-carlos-borromeu` (arcebispo de Milão, 1538–1584, padroeiro dos seminaristas e catequistas) ligado à celebração de 04/11. A figurinha entra sozinha no Álbum e a oração dele vira a oração do dia.
- **Arquivos:** `data/santos.json`, `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes` e `validate:imagens` sem erros; `lint` 0 erros (18 avisos preexistentes); `build` ok. Chromium (390px, data simulada em 04/11) após o build: a home mostra "São Carlos Borromeu, Bispo · Memória" e "Oração a São Carlos Borromeu"; `/santos/sao-carlos-borromeu` com "Festa"; `/santos-do-dia` e `/calendario` listam o santo; sem overflow e 0 erros de página. Não testado: clique em "Conhecer"/"Rezar" e o fluxo da figurinha.
- **Limitações:** sem imagem (`imagem: null`, placeholder). Texto e oração escritos de memória, vale revisão. Sem relações em `relacoes.json`. Sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-11-03: São Martinho de Porres no site, ligado à memória de hoje

- **Problema:** em 03/11 a home e `/santos-do-dia` mostravam "Um dia comum", embora seja a memória de São Martinho de Porres (padroeiro da justiça social e da fraternidade entre as raças, muito querido no Brasil). O santo não existia no site (20 santos) e a data não estava no calendário.
- **Solução:** novo santo `sao-martinho-de-porres` (irmão dominicano de Lima, 1579–1639) e celebração de 03/11 no calendário, ligada a ele. A figurinha entra sozinha no Álbum e a oração dele passa a ser a oração do dia.
- **Arquivos:** `data/santos.json`, `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes` e `validate:imagens` sem erros; `lint` 0 erros (18 avisos preexistentes); `build` ok. Chromium (390px) antes: home "Um dia comum"; depois do build: home mostra "São Martinho de Porres, Religioso · Memória" e oração dele, "Conhecer" leva a `/santos/sao-martinho-de-porres` ("Festa: 3 de novembro"), `/santos-do-dia` lista o santo com "Ver santo/Ver no Álbum/Rezar"; sem overflow e 0 erros de página.
- **Limitações:** sem imagem (`imagem: null`, placeholder; o Wikimedia não é acessível do sandbox). Texto e oração escritos de memória, vale revisão. Sem relações em `relacoes.json`. Sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-11-02: Finados com oração própria na home

- **Problema:** em 02/11 (Finados) o bloco "Hoje" mostrava a celebração, mas a oração do dia era sorteada por data (sem relação com o dia) e o site não tinha nenhuma oração pelos defuntos.
- **Solução:** nova oração `oracao-fieis-defuntos` (Eterno descanso + oração pelos fiéis defuntos) e campo opcional `oracao: <slug>` nas celebrações do calendário; `oracaoDoDia` (`lib/hoje.js`) usa a oração indicada pela celebração antes das demais regras. Finados (02/11) aponta para ela. `validate:album` dá erro se o slug da oração não existir.
- **Arquivos:** `data/oracoes.json`, `data/calendario-liturgico.json`, `lib/hoje.js`, `scripts/validate-album.mjs`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album` e `validate:relacoes` sem erros; slug inválido faz o validador falhar ("oração inexistente"); `lint` 0 erros (18 avisos preexistentes); `build` ok. Chromium (390px) após o build, com a data real de 02/11: a home mostra "Oração pelos Fiéis Defuntos" em "Uma oração para hoje", `/oracoes/oracao-fieis-defuntos` abre, sem overflow e 0 erros de página.
- **Limitações:** só Finados usa o campo (Todos os Santos e outras datas podem usar depois); texto da oração escrito de memória, vale revisão; sem imagem; sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-11-01: calendário: "Rezar" e "Novena" no painel do dia

- **Problema:** pendência da Etapa 5: o painel do dia em `/calendario` levava ao santo e à figurinha, mas não à oração nem à novena dele, mesmo existindo (ex.: São Francisco, Santo Antônio, São Bento).
- **Solução:** `getStaticProps` de `pages/calendario.js` resolve `rezarHrefs` por santo a partir de `santoRelacionado` em `oracoes.json`/`novenas.json`; `CalendarioMensal` mostra "Rezar →" e "Novena →" quando existem. Todos os links do painel passaram a `min-h-11` (44px).
- **Arquivos:** `pages/calendario.js`, `components/CalendarioMensal.js`, `docs/proximas-etapas.md`.
- **Testes:** `lint` 0 erros (18 avisos preexistentes), `build` e `validate:album` ok. Chromium (390px) após o build: 04/10 mostra São Francisco com "Rezar" (`/oracoes/oracao-sao-francisco`); 13/06 mostra Santo Antônio com "Rezar" e "Novena" (`/novenas/novena-santo-antonio`); os 4 links medem 44px; sem overflow e 0 erros de página.
- **Limitações:** só aparece para santos com oração/novena ligadas (hoje 7 santos); a lista "Celebrações do mês" segue com um link só; sem teste automatizado (o projeto não tem runner).

## 2026-10-31: links "Ver oração completa" e "Ver novena" com alvo de toque de 44px

- **Problema:** pendência registrada em 30/10: em `/oracoes` (16 links) e `/novenas` (5 links) os links dos cards mediam 20px de altura no celular, abaixo dos 24px do WCAG 2.5.8 e dos ~44px recomendados.
- **Solução:** `min-h-11` nos dois links (`OracaoCard`, lista de `/novenas`).
- **Arquivos:** `components/OracaoCard.js`, `pages/novenas/index.js`.
- **Testes:** `lint` 0 erros (18 avisos preexistentes) e `build` ok. Chromium (390px) após o build: os 16 links de `/oracoes` e os 5 de `/novenas` medem 44px; sem overflow horizontal. Sem revisão visual por captura de tela.
- **Limitações:** botões de favorito (32px) seguem abaixo de 44px; sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-10-30: alvos de toque maiores e placeholders de busca sem corte no celular

- **Problema:** rastreio no Chromium (390px) de 7 rotas: os placeholders da busca em `/santos` ("...ordem religiosa...", 364px num campo de 354px) e `/igrejas` (391px) ficavam cortados; o link "← Amigos do Céu" tinha 20px de altura, "Minha Jornada" 28px e os links do rodapé 17px (abaixo dos 24px do WCAG 2.5.8 e dos ~44px recomendados).
- **Solução:** placeholders curtos ("Buscar por nome, país, ordem..." / "...estilo..."); `min-h-11` (44px) nos dois links do `MinimalHeader` e nos links do rodapé (espaçamento vertical passou do `space-y-2` para a altura do próprio link).
- **Arquivos:** `components/MinimalHeader.js`, `components/Footer.js`, `pages/santos/index.js`, `pages/igrejas/index.js`.
- **Testes:** `build` ok. Chromium após o build: nas 7 rotas, os únicos alvos < 32px são o link "Pular para conteúdo" (oculto até receber foco) e, em `/oracoes` e `/novenas`, os links "Ver oração completa"/"Ver novena" (20px, não tratados); placeholders cabem (241px e 233px em 354px); sem overflow horizontal em 390px e 1280px; capturas conferidas em 390px e 1280px. `lint` 0 erros (18 avisos preexistentes) e `validate:album` sem erros.
- **Limitações:** os links "Ver oração completa"/"Ver novena" e os botões de favorito (32px) seguem abaixo de 44px; sem teste automatizado (o projeto não tem runner). Rodapé de desktop ficou um pouco mais alto. PR #52 (busca global) segue aberto.

## 2026-10-29: página de santo sem rolagem horizontal no celular

- **Problema:** rastreio no Chromium (390px) de 94 rotas: `/santos/sao-joao-paulo-ii` rolava na horizontal. Na seção "Conexões" (`RelacionamentosSanto`) o card de Santa Teresinha media 437px dentro de uma grade de 294px, porque o item da grade não podia encolher abaixo do conteúdo (`min-width: auto`).
- **Solução:** `grid-cols-1` na lista e `min-w-0` no item, no corpo do card e no chip da ordem religiosa.
- **Arquivos:** `components/RelacionamentosSanto.js`.
- **Testes:** `lint` 0 erros (18 avisos preexistentes) e `build` ok. Chromium após o build: `/santos/sao-joao-paulo-ii` sem overflow (antes 497px de largura); os 20 santos sem overflow em 390px e 320px.
- **Limitações:** imagens do Wikimedia não carregam no sandbox, então a validação visual de fotos não foi feita; sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-10-28: São Judas Tadeu no site, ligado à festa de hoje

- **Problema:** em 28/10 (festa de São Simão e São Judas Tadeu) a home e `/santos-do-dia` mostravam a celebração, mas sem santo ligado: "Conhecer" não tinha destino útil e o santo mais devoto do Brasil nas causas difíceis não existia no site (19 santos).
- **Solução:** novo santo `sao-judas-tadeu` (apóstolo, festa 28/10, padroeiro das causas impossíveis), ligado à celebração do dia no calendário e ao evento "Chamado dos Apóstolos" em `relacoes.json`. A figurinha #065 entra sozinha no Álbum.
- **Arquivos:** `data/santos.json`, `data/calendario-liturgico.json`, `data/relacoes.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes` e `validate:imagens` sem erros; `lint` 0 erros (18 avisos preexistentes); `build` ok. Chromium (390px) após o build: na home de 28/10, "Conhecer" leva a `/santos/sao-judas-tadeu`; a página mostra "Festa: 28 de outubro", oração e a figurinha colada; `/santos-do-dia` lista o santo com "Ver santo"/"Ver no Álbum"; sem overflow e 0 erros de página.
- **Limitações:** sem imagem (`imagem: null`, placeholder): o Wikimedia não é acessível do sandbox, falta salvar uma imagem em `public/images/santos/`. Texto e oração escritos de memória, vale revisão (a tradição sobre o martírio na Pérsia é incerta, por isso o texto diz "a tradição"). São Simão segue sem página. Sem teste automatizado (o projeto não tem runner). PR #52 (busca global) segue aberto.

## 2026-10-27: calendário: "Ver no Álbum" no painel do dia

- **Problema:** o painel do dia em `/calendario` só levava à biografia do santo; quem queria ver ou colar a figurinha dele tinha de passar pelo Álbum e procurar a página certa.
- **Solução:** `getStaticProps` de `pages/calendario.js` resolve o link da figurinha de cada santo (`resumoFigurinha`, catálogo fora do bundle) e `CalendarioMensal` mostra "Ver no Álbum →" ao lado do santo; o link abre o modal da figurinha.
- **Arquivos:** `pages/calendario.js`, `components/CalendarioMensal.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px): ao selecionar um dia com santo (Santa Teresinha), "Ver no Álbum" abre `/album-sagrado/doutores-da-igreja?figurinha=santo:santa-teresinha-do-menino-jesus` com o modal aberto, 0 erros de página. Resultados de lint e build abaixo no PR.
- **Pendências:** "Rezar" e "Novena" no painel seguem abertos (Etapa 5); imagens do Wikimedia não carregam no sandbox (500), então a validação visual de fotos não foi feita; sem teste automatizado (o projeto não tem runner).

## 2026-10-26: home: dia sem celebração aponta para a próxima

- **Problema:** em dias sem celebração (ex.: 26/10, Chromium 390px) o bloco "Hoje na Igreja" mostrava só "Um dia comum" e uma frase genérica, sem caminho a seguir.
- **Solução:** `montarDia` (`lib/hoje.js`) passa a devolver `proxima` (próxima celebração em até 30 dias, com `emDias`, data por extenso e santo cadastrado, se houver) quando o dia não tem celebração. `HojeNoCeu` mostra "Próxima celebração, em 2 dias (quarta-feira, 28 de outubro): São Simão e São Judas Tadeu, Apóstolos · Festa", com link para o santo ou para `/calendario`.
- **Arquivos:** `lib/hoje.js`, `components/HojeNoCeu.js`, `docs/proximas-etapas.md`.
- **Testes:** `lint` (0 erros, 18 avisos preexistentes), `build`, `validate:album` e `validate:relacoes` passaram. Chromium (390px e 1280px) após o build: texto da próxima celebração presente em 26/10, sem overflow horizontal, 0 erros de página; o link sem santo cadastrado leva a `/calendario`.
- **Limitações:** o ramo com link para santo cadastrado não foi exercitado no navegador (a próxima celebração do dia do teste não tem santo); sem teste automatizado (o projeto não tem runner). Observado e não tratado: o placeholder da busca em `/santos` fica cortado a 390px ("…nome, país, ord"). PR #52 (busca global) segue aberto.

## 2026-10-25: calendário litúrgico: 42 memórias obrigatórias que faltavam

- **Problema:** o calendário tinha 69 dias preenchidos; na maior parte do ano o "Hoje" da home e `/santos-do-dia` mostravam "Um dia comum" (ex.: 25/10 e novembro com só 5 dias), mesmo havendo memórias obrigatórias do calendário romano geral (Santa Cecília 22/11, São Martinho 11/11, Santa Mônica 27/08, São Bernardo, São João da Cruz etc.).
- **Solução:** +42 memórias obrigatórias de data fixa (de 69 para 111 dias), com cor litúrgica, `santos: []` (sem santo cadastrado ainda). Sem mudança de código.
- **Arquivos:** `data/calendario-liturgico.json`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album` e `validate:relacoes` sem erros, `lint` 0 erros, `build` ok. Chromium (390px) após o build: `/calendario` em novembro com 12 botões de dia (antes 5); clicar em 22/11 mostra "Santa Cecília, Virgem e Mártir · Memória"; sem overflow e 0 erros de página.
- **Limitações:** datas e títulos conferidos de memória, sem fonte oficial consultada: vale revisão. Memórias facultativas e próprias do Brasil (ex.: Cosme e Damião, 26/09) seguem em aberto; as de data móvel não entram. Sem teste automatizado (o projeto não tem runner).

## 2026-10-24: calendário: dias clicáveis com detalhe da celebração

- **Problema:** em `/calendario` (Chromium, 390px) os dias com celebração não eram clicáveis e o nome aparecia cortado dentro da célula ("Santa", "Sant", "São"); celebrações sem santo (Aparecida, Anjos da Guarda) não tinham nenhum detalhe além da lista longa no fim da página, e o link "Ver santo" na célula era um alvo minúsculo.
- **Solução:** dias com celebração viram `<button>` (`aria-pressed`, `aria-label` "4 de Outubro: São Francisco de Assis, Memória"). O toque abre um painel `aria-live` com data, tipo, nome completo, descrição e links para todos os santos do dia; o painel rola para a vista no celular. No celular a célula mostra só o número e a cor do tipo; a partir de `sm` mantém o nome. Selecionar de novo ou trocar de mês limpa a seleção.
- **Arquivos:** `components/CalendarioMensal.js`.
- **Testes:** Chromium (390px e 1280px) após `build`: 10 botões de dia em outubro; clicar em 4/10 mostra "São Francisco de Assis" com link para o santo e `aria-pressed=true`; clicar em 12/10 mostra Aparecida sem link de santo; "Próximo" limpa o painel; painel visível na viewport de 390px após o clique; sem overflow horizontal e 0 erros de página. `lint` (0 erros, 18 avisos preexistentes), `validate:album` e `build` passaram.
- **Limitações:** navegação por teclado conferida só pelo semântico (`button`), sem leitor de tela real; celebrações sem santo não têm link para orações/aparições relacionadas (próxima oportunidade: mini-hub do dia, Etapa 5); sem teste automatizado (o projeto não tem runner).

## 2026-10-23: campos de busca, filtro e texto com nome acessível

- **Problema:** rastreio no Chromium (390px e 1280px) de 18 rotas: `/santos`, `/igrejas` e `/oracoes` tinham um campo de busca sem rótulo (só `placeholder`), e o filtro de tipo em `RelacionamentosSanto`, os campos "Nome/Descrição da lista" em `/favoritos` e as caixas de intenção em `/novenas/[slug]` tinham `<label>` solto (sem `htmlFor`) ou nenhum. Leitores de tela anunciam "campo de edição" sem dizer para quê. Sem overflow horizontal, `h1` único em todas as rotas, nenhum botão/link sem nome e 0 erros de página.
- **Solução:** `aria-label` nos campos de busca (`SearchBar`, `/oracoes`) e no filtro de relacionamentos; `id` + `htmlFor` nos campos de `/favoritos` e `/novenas/[slug]`. Sem mudança visual.
- **Arquivos:** `components/SearchBar.js`, `components/RelacionamentosSanto.js`, `pages/oracoes/index.js`, `pages/favoritos/index.js`, `pages/novenas/[slug].js`.
- **Testes:** `lint` (0 erros, 18 avisos preexistentes), `build`, `validate:album` e `validate:imagens` passaram. Rastreio repetido após o build (18 rotas x 2 larguras): 0 campos sem nome acessível (antes 4 rotas com 1); `/novenas/novena-nossa-senhora-aparecida` com `<textarea>` associado ao rótulo (`labels` = 1).
- **Limitações:** inspeção por script (nome acessível dos campos), sem leitor de tela real nem axe; os formulários internos de `/favoritos` (criar lista) não foram abertos no navegador, só conferidos no código; modais e `FilterPanel` não foram auditados; sem teste automatizado (o projeto não tem runner). O PR #52 (busca global) segue aberto e não conflita com estes arquivos.

## 2026-10-22: oração com imagem de outra tradição e card sem fallback

- **Problema:** `/oracoes` tinha 1 imagem quebrada. O Pai Nosso apontava para uma pintura de um blog externo de outra tradição cristã (`ldsblogs.com`), fora do Wikimedia e sem licença conhecida; ao falhar, o `OracaoCard` só escondia a `<img>` e deixava um bloco de gradiente vazio. Reproduzido no Chromium (390px): 1 imagem quebrada em `/oracoes`.
- **Solução:** `imagem: null` no Pai Nosso (o card mostra o placeholder temático), `ldsblogs.com` removido de `remotePatterns` e `OracaoCard` passa a cair no `PlaceholderSagrado` quando uma imagem remota falha.
- **Arquivos:** `data/oracoes.json`, `next.config.js`, `components/OracaoCard.js`.
- **Testes:** `lint` (0 erros, 18 avisos preexistentes), `validate:imagens` e `build` passaram. Chromium (390px) após o build: 0 imagens quebradas em `/oracoes` (antes 1), 17 cards, sem `ldsblogs` no HTML, `/oracoes/pai-nosso` abre sem erro de página.
- **Limitações:** o Pai Nosso fica sem imagem própria; as páginas de detalhe de orações/novenas ainda usam `<img>` que apenas se oculta em caso de falha. Sem teste automatizado (o projeto não tem runner). PR: #53.

## 2026-10-21: busca global em `/busca`

- **Problema:** não havia como procurar nada fora das listas de cada seção (`/busca` caía no 404). Quem queria "Fátima" ou "Ave Maria" tinha de adivinhar a seção. Apontado como oportunidade na rodada do 404.
- **Solução:** nova página `/busca` (noindex) com campo de busca, filtro por tipo com contagem e resultados com ícone, tipo e resumo. Cobre santos, orações, novenas, aparições, igrejas, eventos da Vida de Cristo e conexões bíblicas (126 itens), sem acento e sem diferenciar maiúsculas; todos os termos precisam casar, título pesa mais. Estado em `?q=` (compartilhável). Ícone de lupa no header (celular e desktop) e link no 404.
- **Arquivos:** `lib/busca.js` (lógica pura), `pages/busca.js`, `components/MinimalHeader.js`, `pages/404.js`, `docs/proximas-etapas.md`.
- **Testes:** Playwright (Chromium, 390px e 1280px): lupa do header leva a `/busca`; "fátima" → 2 resultados (aparição e santuário), filtro "Igrejas" → 1; termo sem resultado mostra mensagem; `?q=ave maria` abre preenchido e o resultado leva a `/oracoes/ave-maria`; sem overflow, 0 erros de página. Lógica conferida em Node. `lint` 0 erros (18 avisos preexistentes) e `build` passaram. Captura conferida.
- **Limitações:** não busca o texto integral das orações; busca por substring (sem tolerância a erros de digitação); a home não tem header, então não mostra a lupa; sem teste automatizado (o projeto não tem runner). `validate:*` não rodados (sem mudança de dados). `package-lock.json` está fora de sincronia com `package.json` (`npm ci` falha; usei `npm install --no-save`).

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

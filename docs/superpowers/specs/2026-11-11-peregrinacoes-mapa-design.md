# Rotas de peregrinação + novo visual do mapa

## Contexto

O `/mapa` de hoje é um Leaflet padrão com bolinhas coloridas, e as "rotas de peregrinação" são duas linhas retas fixas no código (`components/MapaInterativo.js`, array `rotasPeregrinacao`), sem etapas nem página. O objetivo é que o mapa sirva a **quem vai peregrinar de verdade**, com um **roteiro etapa por etapa**, e que tenha a cara do site.

Este é o projeto 1 de 2. O projeto 2 (mais conteúdo no mapa: santuários, lugares de santos, mais Brasil) fica para depois e **não** entra aqui.

## Decidido pelo Eduardo

- Público: quem planeja fazer a peregrinação de verdade.
- Coração da funcionalidade: guiar etapa por etapa (origem, destino, km, o que há de sagrado em cada parada).
- Rotas de lançamento: **Caminho da Fé (ramal principal até Aparecida)** e **Caminho Francês de Santiago**, ambas completas.
- Cada etapa tem também: dificuldade e relevo, oração/meditação do trecho, "marcar como feita" (progresso na Minha Jornada), e abrir no celular (Google Maps + download GPX).
- Visual: **mapa antigo de peregrino** (pergaminho, sépia, rotas em tinta, ícones desenhados).
- Layout da página de rota: **mapa fixo à esquerda + roteiro rolando à direita**; a etapa em foco é destacada no mapa. No celular, mapa no topo e etapas abaixo.

## Decisões minhas (podem ser revistas)

- **URLs:** `/peregrinacoes` (lista das rotas) e `/peregrinacoes/[slug]`. Deep-link de etapa por `?etapa=<n>`.
- **Fora do escopo:** hospedagem, preços, telefones, horários (envelhecem rápido). Cada rota aponta para a fonte oficial. Também fora: figurinha de rota no Álbum, navegação GPS ao vivo, novos cadastros de igrejas (projeto 2).
- **Traçado:** extraído do OpenStreetMap (relações das rotas, via Overpass ou export GPX do Waymarked Trails), com atribuição ODbL na página. O executor confirma primeiro que a relação do Caminho da Fé existe e está completa; se não estiver, parar e avisar antes de improvisar traçado.
- **Divisão em etapas:** a tradicional de cada rota (Francês: Saint-Jean-Pied-de-Port → Santiago, ~33 etapas; Caminho da Fé: Águas da Prata → Aparecida, conforme o site oficial). Distâncias **calculadas do traçado**, não digitadas. Subida acumulada calculada uma vez por script a partir de dados abertos de elevação (SRTM) e gravada no JSON.
- **Estilo do mapa sem novo fornecedor nem chave:** tiles do OSM com filtro CSS sépia + moldura/textura de pergaminho; ícones SVG próprios (igreja, aparição, concha, cruz de etapa). Sem dependência nova.
- **Paradas sagradas:** referenciam o que o site já tem com refs `tipo:slug`; lugares ainda não cadastrados entram como parada simples (nome + coordenada + uma linha), sem página.
- **Oração do trecho:** ref a uma oração existente (`oracao:<slug>`) quando couber; senão, meditação curta escrita na própria etapa. Marcar etapa como feita não dá figurinha nem conta como "Rezei".

## Dados

- `data/peregrinacoes/rotas.json` — lista: `slug`, `nome`, `resumo`, `historia`, `pais(es)`, `distanciaKm`, `fonteOficial`, `imagem` (ou `null`).
- `data/peregrinacoes/<slug>.json` — etapas em ordem: `numero`, `origem`, `destino`, `distanciaKm`, `subidaM`, `dificuldade` (`facil|moderada|dificil`), `tempoAPeH`, `descricao`, `paradas[]` (`{ ref }` ou `{ nome, latitude, longitude, nota }`), `oracaoRef` ou `meditacao`, `inicio`/`fim` (coordenadas).
- `public/rotas/<slug>/trajeto.json` — traçado simplificado por etapa (`[[lat,lng],…]`), buscado no cliente pelo mapa (fica fora do bundle e das props).
- `public/rotas/<slug>/<slug>.gpx` e um GPX por etapa — para download.
- `lib/peregrinacoesData.js` — agregador no molde de `lib/conexoesData.js` (`getRotas()`, `getRota(slug)`); usado só em `getStaticProps`.
- `scripts/build-rota.mjs` — script único: GPX bruto → corta por etapa, simplifica, calcula km e subida, gera `trajeto.json` e os GPX.
- `scripts/validate-peregrinacoes.mjs` + `npm run validate:peregrinacoes` — etapas contíguas e numeradas, refs existentes, arquivos de traçado/GPX presentes, soma das etapas = total, oração ou meditação em toda etapa.

## Código

- `components/mapa/MapaBase.js` — **novo**, a base compartilhada: carrega Leaflet sem SSR (padrão atual de `MapaInterativo.js`), aplica o estilo antigo, expõe ícones. Usado pelo `/mapa` e pelas páginas de rota.
- `components/mapa/icones.js` — ícones SVG (`L.divIcon`) por tipo.
- `components/peregrinacoes/` — `RotaMapa.js` (traçado, etapa em foco em vermelho, etapas feitas em dourado, `fitBounds` na etapa ativa), `EtapaCard.js`, `RoteiroEtapas.js` (IntersectionObserver define a etapa em foco), `RotaCabecalho.js` (km, nº de etapas, x/N feitas), `RotaCard.js`.
- `pages/peregrinacoes/index.js` e `pages/peregrinacoes/[slug].js` — com `<SEO>` (JSON-LD `TouristTrip`), layout sticky `lg:grid-cols-2`.
- `hooks/usePeregrinacoes.js` — chave `amigos-do-ceu:peregrinacoes` (`{ [rotaSlug]: { feitas: { [numero]: 'YYYY-MM-DD' } } }`), leitura/escrita síncrona no molde de `hooks/useAlbum.js`, com `loaded`.
- `lib/jornada.js` — novo leitor `getPeregrinacoesResumo()` (tolerante a dado ausente/corrompido, como os outros); cartão novo em `pages/minha-jornada.js` levando à próxima etapa.
- `components/MapaInterativo.js` — passa a usar `MapaBase`; sai o array `rotasPeregrinacao` e o botão de rotas; as rotas reais aparecem como linhas clicáveis (popup com link para a página). Reaproveitar `calcularDistancia` (mover para `lib/geo.js`) e "minha localização"; trocar os `alert()` por mensagem na tela.
- `pages/mapa/index.js` — tira o bloco "Como usar" e os textos da "Rota Mariana Europeia" inventada; seção de rotas vira cards para `/peregrinacoes/*`.
- `pages/sitemap.xml.js` — `/peregrinacoes` em `staticPages` + URLs das rotas; `pages/index.js` e `components/Footer.js` — entrada para Peregrinações.
- Por último, pequeno: tipo `peregrinacao` em `lib/relacoesGrafo.js` (`TIPOS_REF`/`GRUPOS`), derivado das paradas com ref, para que a página da Basílica de Aparecida ou da Catedral de Santiago mostre a rota em "🔗 Conexões". Atualizar `scripts/validate-relacoes.mjs`.

O tema `cosmic` não entra em nenhuma dessas páginas (exceto o cartão dentro de Minha Jornada, que já usa esse tema).

## Ordem de execução

1. Branch `feature/rotas-peregrinacao`; salvar este desenho em `docs/superpowers/specs/2026-11-11-peregrinacoes-mapa-design.md`.
2. `MapaBase` + estilo antigo + ícones; migrar `/mapa` (visual já entregue aqui).
3. Script de traçado + dados do Caminho da Fé + validador.
4. Páginas `/peregrinacoes`, hook de progresso, GPX/Google Maps.
5. Caminho Francês de Santiago (só conteúdo, mesmo molde).
6. Minha Jornada, rotas no `/mapa`, sitemap, home/footer, Conexões.
7. Atualizar `CLAUDE.md` (rotas, dados, hook, validador).

## Ajustes feitos na execução

- Caminho da Fé ficou com **14 etapas** (a etapa Campos do Jordão → Pedrinhas media 42 km e foi dividida em Gomeral).
- Paradas sem página usam `coord: [lat, lng]` (não `latitude`/`longitude`), igual ao `fim` das etapas.
- `dificuldade` e tempo a pé são derivados de km e subida (`lib/peregrinacoesRegras.js`); a etapa pode sobrescrever a dificuldade.
- O site inteiro já usa o tema escuro: o mapa antigo entra como folha de pergaminho sobre a página escura.
- O traçado do Caminho da Fé no OpenStreetMap é uma rota de bicicleta (299 km medidos contra ~318 km oficiais); a página avisa isso ao peregrino.
- No mapa geral, cada rota ganhou também um selo com a concha, porque a linha some quando o mapa mostra o mundo inteiro.

## Verificação

- `npm run lint` (0 erros), `npm run build`, `npm run validate:peregrinacoes`, `validate:relacoes`, `validate:imagens`, `validate:album`.
- No navegador (`npm run dev`), em largura de computador e de celular: `/mapa` com visual antigo e rotas clicáveis; `/peregrinacoes/caminho-da-fe` e `/peregrinacoes/caminho-frances-de-santiago` — rolar o roteiro muda o trecho em foco; marcar etapa persiste após recarregar e aparece em `/minha-jornada`; link do Google Maps abre o trecho certo; GPX baixado abre num visualizador e bate com o mapa.
- Conferir por amostragem 3 etapas de cada rota contra a fonte oficial (cidades e km).

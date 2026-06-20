---
name: add-aparicao
description: Use when adding a new Marian apparition to the Amigos do Céu portal. Handles researching historical data and coordinates, fetching the image via the wikimedia-image skill, generating a URL-safe slug, and writing a complete entry to data/aparicoes.json.
---

# Add Aparição

Adiciona uma nova aparição mariana ao portal, do zero até a entrada completa em `data/aparicoes.json`.

## Quando usar
Sempre que o pedido for "adicione a aparição de X" ou equivalente — seja numa sessão única, seja dentro do fluxo de agentes paralelos (ver `.claude/rules/agent-aparicoes.md` para regras de ownership nesse segundo caso).

## Pré-requisitos
- Skill `wikimedia-image` disponível em `.claude/skill/wikimedia-image/skill.md`
- Schema de `data/aparicoes.json` documentado no `CLAUDE.md` raiz

## Workflow

### Passo 1 — Pesquisar dados históricos
Buscar informações confiáveis sobre a aparição:
- Nome da aparição (ex: "Nossa Senhora de Fátima")
- Local (cidade, país)
- Data ou ano da aparição
- História — relato resumido (2-4 frases): contexto, videntes, mensagem principal
- Coordenadas geográficas precisas (latitude/longitude) do santuário ou local
- Link do Google Maps, se disponível

Se alguma informação não for encontrada com confiança, usar `null` — nunca inventar dados, especialmente coordenadas, já que elas alimentam o mapa interativo em `/mapa`.

### Passo 2 — Buscar e salvar imagem
Invocar a skill `wikimedia-image` (`.claude/skill/wikimedia-image/skill.md`):
1. Buscar o nome do arquivo no Wikimedia Commons usando o nome da aparição/santuário
2. Obter a URL direta da imagem
3. Salvar em `public/images/aparicoes/<slug>.jpg` (ou extensão correspondente)

Se nenhuma imagem adequada for encontrada, sinalizar isso explicitamente ao final em vez de salvar um arquivo placeholder.

### Passo 3 — Gerar slug
- Remover acentos, converter para minúsculas, substituir espaços por hífens
- Exemplo: "Nossa Senhora de Fátima" → `nossa-senhora-de-fatima`
- Verificar em `data/aparicoes.json` que o slug não colide com nenhum existente
- Se colidir, adicionar sufixo numérico (`-2`, `-3`...)

### Passo 4 — Montar a entrada
Preencher todos os campos do schema. Campos sem informação disponível recebem `null`:

```json
{
  "nome": "",
  "slug": "",
  "imagem": "/images/aparicoes/<slug>.jpg",
  "local": "",
  "data": null,
  "historia": "",
  "latitude": null,
  "longitude": null,
  "linkGoogleMaps": null,
  "tags": []
}
```

### Passo 5 — Escrever em `data/aparicoes.json`
Adicionar a entrada ao final do array, preservando a formatação existente (indentação, ordem de chaves).

### Passo 6 — Confirmar
Reportar ao usuário:
- Nome e slug da aparição adicionada
- URL onde a página vai ficar disponível (`/aparicoes/<slug>`)
- Se as coordenadas foram encontradas (ela vai aparecer em `/mapa` apenas se `latitude`/`longitude` não forem `null`)
- Quaisquer campos deixados como `null` por falta de informação confiável
- Se a imagem não foi encontrada

## O que esta skill NÃO faz
- Não modifica aparições existentes (isso seria uma skill separada, ex. `edit-aparicao`)
- Não cria componentes, rotas ou páginas — a rota dinâmica já existe via `[slug]`
- Não toca em outros domínios (`santos.json`, `igrejas.json`)
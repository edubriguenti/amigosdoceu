---
name: add-santo
description: Use when adding a new saint to the Amigos do Céu portal. Handles researching biographical data, fetching the image via the wikimedia-image skill, generating a URL-safe slug, and writing a complete entry to data/santos.json.
---

# Add Santo

Adiciona um novo santo ao portal, do zero até a entrada completa em `data/santos.json`.

## Quando usar
Sempre que o pedido for "adicione o santo X" ou equivalente — seja numa sessão única, seja dentro do fluxo de agentes paralelos (ver `.claude/rules/agent-santos.md` para regras de ownership nesse segundo caso).

## Pré-requisitos
- Skill `wikimedia-image` disponível em `.claude/skill/wikimedia-image/skill.md`
- Schema de `data/santos.json` documentado no `CLAUDE.md` raiz

## Workflow

### Passo 1 — Pesquisar dados biográficos
Buscar informações confiáveis sobre o santo:
- Nome completo
- Datas: nascimento, falecimento, canonização (formato `AAAA-MM-DD`)
- País de origem
- Ordem religiosa (se houver)
- Padroeiro de quê (se houver)
- Período histórico
- Se é Doutor da Igreja
- Breve descrição (2-4 frases)
- Oração associada (se houver uma oração tradicional conhecida)

Se alguma informação não for encontrada com confiança, usar `null` — nunca inventar dados.

### Passo 2 — Buscar e salvar imagem
Invocar a skill `wikimedia-image` (`.claude/skill/wikimedia-image/skill.md`):
1. Buscar o nome do arquivo no Wikimedia Commons usando o nome do santo
2. Obter a URL direta da imagem
3. Salvar em `public/images/santos/<slug>.jpg` (ou extensão correspondente)

Se nenhuma imagem adequada for encontrada, sinalizar isso explicitamente ao final em vez de salvar um arquivo placeholder.

### Passo 3 — Gerar slug
- Remover acentos, converter para minúsculas, substituir espaços por hífens
- Exemplo: "São Francisco de Assis" → `sao-francisco-de-assis`
- Verificar em `data/santos.json` que o slug não colide com nenhum existente
- Se colidir, adicionar sufixo numérico (`-2`, `-3`...)

### Passo 4 — Montar a entrada
Preencher todos os campos do schema. Campos sem informação disponível recebem `null`:

```json
{
  "nome": "",
  "slug": "",
  "imagem": "/images/santos/<slug>.jpg",
  "descricao": "",
  "oracao": null,
  "tags": [],
  "dataNascimento": null,
  "dataFalecimento": null,
  "dataCanonizacao": null,
  "pais": "",
  "ordemReligiosa": null,
  "padroeiro": null,
  "periodo": "",
  "doutorIgreja": false,
  "popularidade": 0
}
```

### Passo 5 — Escrever em `data/santos.json`
Adicionar a entrada ao final do array, preservando a formatação existente (indentação, ordem de chaves).

### Passo 6 — Confirmar
Reportar ao usuário:
- Nome e slug do santo adicionado
- URL onde a página vai ficar disponível (`/santos/<slug>`)
- Quaisquer campos deixados como `null` por falta de informação confiável
- Se a imagem não foi encontrada

## O que esta skill NÃO faz
- Não modifica santos existentes (isso seria uma skill separada, ex. `edit-santo`)
- Não cria componentes, rotas ou páginas — a rota dinâmica já existe via `[slug]`
- Não toca em outros domínios (`igrejas.json`, `aparicoes.json`)
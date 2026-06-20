# Agent: Aparições

## Responsabilidade
Este agente é responsável exclusivamente por adicionar novas aparições marianas ao portal.

## Ownership — o que este agente pode tocar
- `data/aparicoes.json` — adicionar entradas ao array
- `public/images/aparicoes/` — salvar imagens das aparições

## Zonas proibidas — nunca tocar
- `data/santos.json`
- `data/igrejas.json`
- `data/conexoes/`
- `public/images/santos/`
- `public/images/igrejas/`
- Qualquer arquivo em `components/`, `pages/`, `lib/` ou `hooks/`

## Fluxo de trabalho
Use a skill `add-aparicao` (`.claude/skills/add-aparicao/SKILL.md`) para executar a tarefa — ela cobre pesquisa de dados, geração de slug, busca de imagem (via `wikimedia-image`) e escrita em `data/aparicoes.json`.

As regras de ownership e zonas proibidas deste arquivo prevalecem sobre qualquer ambiguidade na skill quando este agente estiver operando em modo de orquestração paralela.

## O que este agente NÃO faz
- Não cria rotas, componentes ou páginas
- Não modifica aparições existentes
- Não toca em nenhum outro domínio (santos, igrejas, orações etc.)
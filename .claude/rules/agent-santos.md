# Agent: Santos

## Responsabilidade
Este agente é responsável exclusivamente por adicionar novos santos ao portal.

## Ownership — o que este agente pode tocar
- `data/santos.json` — adicionar entradas ao array
- `public/images/santos/` — salvar imagens dos santos

## Zonas proibidas — nunca tocar
- `data/aparicoes.json`
- `data/igrejas.json`
- `data/conexoes/`
- `public/images/aparicoes/`
- `public/images/igrejas/`
- Qualquer arquivo em `components/`, `pages/`, `lib/` ou `hooks/`

## Fluxo de trabalho
Use a skill `add-santo` (`.claude/skills/add-santo/SKILL.md`) para executar a tarefa — ela cobre pesquisa de dados, geração de slug, busca de imagem (via `wikimedia-image`) e escrita em `data/santos.json`.

As regras de ownership e zonas proibidas deste arquivo prevalecem sobre qualquer ambiguidade na skill quando este agente estiver operando em modo de orquestração paralela.

## O que este agente NÃO faz
- Não cria rotas, componentes ou páginas
- Não modifica santos existentes
- Não toca em nenhum outro domínio (aparições, igrejas, orações etc.)
# Design: Adicionar 3 Novos Santos

**Data:** 2026-05-20  
**Status:** Aprovado

## Objetivo

Adicionar São Pedro, São Sebastião e São João Bosco ao banco de dados `data/santos.json`, com imagens do Wikimedia Commons.

## Santos a Adicionar

### 1. São Pedro
- **slug:** `sao-pedro`
- **Nascimento:** ~1 a.C.
- **Falecimento:** ~64–68 d.C.
- **Canonização:** Pré-Congregação (tradição apostólica)
- **País:** Israel / Itália
- **Ordem Religiosa:** nenhuma
- **Padroeiro:** Pescadores, Papas, Igreja Católica
- **Período:** Antiguidade
- **Doutor da Igreja:** false
- **Popularidade:** 97
- **Tags:** Apóstolos, Papa, Pescadores
- **Relacionamentos:** São Paulo da Cruz (apóstolo contemporâneo)
- **Imagem:** Wikimedia Commons (a buscar via skill `wikimedia-image`)

### 2. São Sebastião
- **slug:** `sao-sebastiao`
- **Nascimento:** ~256 d.C.
- **Falecimento:** ~288 d.C.
- **Canonização:** Pré-Congregação (mártir)
- **País:** França / Itália
- **Ordem Religiosa:** nenhuma
- **Padroeiro:** Rio de Janeiro, Soldados, Atletas
- **Período:** Antiguidade
- **Doutor da Igreja:** false
- **Popularidade:** 90
- **Tags:** Mártires, Militares, Brasil
- **Relacionamentos:** São Miguel Arcanjo (intercessores de proteção)
- **Imagem:** Wikimedia Commons

### 3. São João Bosco (Dom Bosco)
- **slug:** `sao-joao-bosco`
- **Nascimento:** 1815
- **Falecimento:** 1888
- **Canonização:** 1934
- **País:** Itália
- **Ordem Religiosa:** Salesianos
- **Padroeiro:** Jovens, Estudantes, Aprendizes
- **Período:** Contemporâneo
- **Doutor da Igreja:** false
- **Popularidade:** 85
- **Tags:** Educação, Juventude, Salesianos
- **Relacionamentos:** São Francisco de Assis (inspiração de humildade e serviço)
- **Imagem:** Wikimedia Commons

## Arquivos Afetados

- `data/santos.json` — adição de 3 novos objetos
- `public/images/` — 3 novas imagens baixadas do Wikimedia Commons

## Fluxo de Implementação

1. Criar branch `feature/novos-santos`
2. Buscar imagens via skill `wikimedia-image` para cada santo
3. Salvar imagens em `public/images/`
4. Adicionar entradas em `data/santos.json` com todos os campos obrigatórios
5. Verificar que as páginas `/santos/sao-pedro`, `/santos/sao-sebastiao` e `/santos/sao-joao-bosco` renderizam corretamente
6. Commitar e abrir PR

# Novos Santos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar São Pedro, São Sebastião e São João Bosco ao banco de dados `data/santos.json` com imagens do Wikimedia Commons.

**Architecture:** Adição pura de conteúdo — 3 objetos JSON em `data/santos.json` e 3 imagens em `public/images/`. As rotas dinâmicas `/santos/[slug]` já existem e renderizam qualquer santo do JSON automaticamente.

**Tech Stack:** Next.js 14, JSON estático, Wikimedia Commons (skill `wikimedia-image`)

---

### Task 1: Criar branch de feature

**Files:**
- Nenhum arquivo modificado — apenas operação git

- [ ] **Step 1: Criar e mudar para a nova branch**

```bash
git checkout -b feature/novos-santos
```

Expected output:
```
Switched to a new branch 'feature/novos-santos'
```

---

### Task 2: Buscar imagem de São Pedro

**Files:**
- Create: `public/images/sao-pedro.jpg` (ou `.webp`)

- [ ] **Step 1: Usar o skill `wikimedia-image`**

Invocar o skill `wikimedia-image` com o termo de busca **"Saint Peter apostle"** ou **"São Pedro apóstolo"**.

Buscar uma imagem clássica — idealmente a pintura de El Greco, Rubens, ou foto de estátua famosa (como a da Basílica de São Pedro no Vaticano).

- [ ] **Step 2: Salvar a imagem**

Salvar o arquivo em `public/images/sao-pedro.jpg` (ou `.webp`, conforme o formato retornado).

Anotar o caminho exato para usar no JSON: `/images/sao-pedro.jpg`

---

### Task 3: Buscar imagem de São Sebastião

**Files:**
- Create: `public/images/sao-sebastiao.jpg` (ou `.webp`)

- [ ] **Step 1: Usar o skill `wikimedia-image`**

Invocar o skill `wikimedia-image` com o termo de busca **"Saint Sebastian martyr"**.

Preferir a pintura clássica de Guido Reni ou Andrea Mantegna — obras bem conhecidas e de alta qualidade visual.

- [ ] **Step 2: Salvar a imagem**

Salvar o arquivo em `public/images/sao-sebastiao.jpg`.

Anotar o caminho exato: `/images/sao-sebastiao.jpg`

---

### Task 4: Buscar imagem de São João Bosco

**Files:**
- Create: `public/images/sao-joao-bosco.jpg` (ou `.webp`)

- [ ] **Step 1: Usar o skill `wikimedia-image`**

Invocar o skill `wikimedia-image` com o termo de busca **"John Bosco Don Bosco"**.

Preferir foto ou retrato oficial — Dom Bosco foi canonizado em 1934, então há fotografias reais disponíveis no Wikimedia.

- [ ] **Step 2: Salvar a imagem**

Salvar o arquivo em `public/images/sao-joao-bosco.jpg`.

Anotar o caminho exato: `/images/sao-joao-bosco.jpg`

---

### Task 5: Adicionar São Pedro ao santos.json

**Files:**
- Modify: `data/santos.json` — inserir objeto antes do `]` final

- [ ] **Step 1: Abrir `data/santos.json` e localizar o último objeto**

O arquivo termina com o objeto de São Miguel Arcanjo seguido de `]`.

- [ ] **Step 2: Adicionar vírgula após o último objeto e inserir o novo**

Após o `}` que fecha o objeto de São Miguel Arcanjo (linha com `"popularidade": 95`), adicionar uma vírgula e o seguinte objeto:

```json
  {
    "nome": "São Pedro",
    "slug": "sao-pedro",
    "imagem": "/images/sao-pedro.jpg",
    "descricao": "Simão Pedro, filho de Jonas, era pescador em Betsaida quando Jesus o chamou para ser 'pescador de homens'. Tornou-se o líder dos doze apóstolos e recebeu de Cristo as 'chaves do Reino dos Céus' (Mt 16,19), tornando-se o primeiro papa da Igreja Católica. Após negar Cristo três vezes durante a Paixão, arrependeu-se profundamente e foi reabilitado pelo Ressuscitado à beira do Mar da Galileia. Pregou em Jerusalém, Antioquia e Roma, onde fundou a comunidade cristã com São Paulo. Sofreu martírio crucificado de cabeça para baixo, por não se considerar digno de morrer como Cristo, por volta do ano 64-68 d.C. sob o imperador Nero. Sua tumba está sob a Basílica de São Pedro no Vaticano.",
    "oracao": "São Pedro, príncipe dos apóstolos e pedra sobre a qual Cristo edificou sua Igreja, intercedei por nós junto ao Senhor. Que possamos, como vós, reconhecer em Jesus o Cristo, o Filho de Deus vivo, e permanecer firmes na fé mesmo diante das tempestades da vida. Amém.",
    "tags": ["Apóstolos", "Papa", "Pescadores"],
    "dataNascimento": "~1 a.C.",
    "dataFalecimento": "~67",
    "dataCanonizacao": "Pré-Congregação",
    "pais": "Israel",
    "ordemReligiosa": null,
    "padroeiro": ["Pescadores", "Papas", "Igreja Católica"],
    "periodo": "Antiguidade",
    "doutorIgreja": false,
    "popularidade": 97,
    "relacionamentos": [
      {
        "santoSlug": "sao-paulo-da-cruz",
        "tipo": "contemporaneo",
        "descricao": "São Pedro e São Paulo foram os principais apóstolos e fundadores da Igreja em Roma, morrendo mártires durante a perseguição de Nero"
      }
    ]
  }
```

- [ ] **Step 3: Verificar que o JSON continua válido**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/santos.json','utf8')); console.log('JSON válido')"
```

Expected: `JSON válido`

---

### Task 6: Adicionar São Sebastião ao santos.json

**Files:**
- Modify: `data/santos.json`

- [ ] **Step 1: Inserir objeto após São Pedro**

Após o `}` que fecha o objeto de São Pedro, adicionar vírgula e o seguinte objeto:

```json
  {
    "nome": "São Sebastião",
    "slug": "sao-sebastiao",
    "imagem": "/images/sao-sebastiao.jpg",
    "descricao": "Sebastião nasceu por volta de 256 d.C. em Narbona, na Gália (atual França), e foi educado em Milão. Tornou-se oficial da Guarda Pretoriana do imperador Diocleciano sem revelar sua fé cristã, usando sua posição para confortar e converter prisioneiros cristãos. Descoberto, foi condenado à morte e crivado de flechas, mas sobreviveu graças ao cuidado de Santa Irene. Ao se apresentar novamente ao imperador para denunciar a perseguição, foi morto a pauladas em 288 d.C. e seu corpo lançado no esgoto de Roma. É um dos santos mais venerados no Brasil, padroeiro da cidade do Rio de Janeiro desde o período colonial. Sua festa é celebrada em 20 de janeiro.",
    "oracao": "São Sebastião, mártir corajoso que preferiu a morte a renegar a Cristo, intercedei por nós. Defendei-nos contra as epidemias, as perseguições e todos os males do corpo e da alma. Que possamos, como vós, permanecer fiéis a Deus em todas as provações da vida. Amém.",
    "tags": ["Mártires", "Militares", "Brasil"],
    "dataNascimento": "~256",
    "dataFalecimento": "~288",
    "dataCanonizacao": "Pré-Congregação",
    "pais": "França",
    "ordemReligiosa": null,
    "padroeiro": ["Rio de Janeiro", "Soldados", "Atletas"],
    "periodo": "Antiguidade",
    "doutorIgreja": false,
    "popularidade": 90,
    "relacionamentos": [
      {
        "santoSlug": "sao-miguel-arcanjo",
        "tipo": "contemporaneo",
        "descricao": "Ambos são intercessores da proteção divina — São Miguel no plano espiritual e São Sebastião como mártir militar que protegeu os cristãos com sua vida"
      }
    ]
  }
```

- [ ] **Step 2: Verificar JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/santos.json','utf8')); console.log('JSON válido')"
```

Expected: `JSON válido`

---

### Task 7: Adicionar São João Bosco ao santos.json

**Files:**
- Modify: `data/santos.json`

- [ ] **Step 1: Inserir objeto após São Sebastião**

Após o `}` que fecha o objeto de São Sebastião, adicionar vírgula e o seguinte objeto:

```json
  {
    "nome": "São João Bosco",
    "slug": "sao-joao-bosco",
    "imagem": "/images/sao-joao-bosco.jpg",
    "descricao": "João Bosco nasceu em 16 de agosto de 1815 em Becchi, no Piemonte, Itália, em uma família humilde. Desde criança sonhou com sua missão de educar jovens abandonados. Ordenado sacerdote em 1841, dedicou-se integralmente à juventude pobre e desamparada de Turim, fundando o Oratório de São Francisco de Sales. Em 1859, fundou a Congregação Salesiana, nomeada em homenagem a São Francisco de Sales, que hoje está presente em mais de 130 países. Criou um método educativo revolucionário baseado no amor, na razão e na religião — o Sistema Preventivo —, que influencia a pedagogia até hoje. Faleceu em 31 de janeiro de 1888 e foi canonizado pelo Papa Pio XI em 1934. É padroeiro dos jovens, dos aprendizes e dos editores.",
    "oracao": "São João Bosco, pai e mestre da juventude, intercedei por todos os jovens do mundo. Que possamos encontrar, como vós, a vocação que Deus preparou para cada um de nós e dedicar nossa vida com alegria ao serviço dos irmãos. Amém.",
    "tags": ["Educação", "Juventude", "Salesianos"],
    "dataNascimento": "1815",
    "dataFalecimento": "1888",
    "dataCanonizacao": "1934",
    "pais": "Itália",
    "ordemReligiosa": "Salesianos",
    "padroeiro": ["Jovens", "Estudantes", "Aprendizes"],
    "periodo": "Contemporâneo",
    "doutorIgreja": false,
    "popularidade": 85,
    "relacionamentos": [
      {
        "santoSlug": "sao-francisco-de-assis",
        "tipo": "inspiracao",
        "descricao": "Dom Bosco admirava profundamente São Francisco de Assis pela humildade e pelo amor aos pobres, valores que nortearam sua missão educativa"
      }
    ]
  }
```

- [ ] **Step 2: Verificar JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/santos.json','utf8')); console.log('JSON válido')"
```

Expected: `JSON válido`

---

### Task 8: Verificar as páginas no browser

**Files:**
- Nenhum arquivo modificado

- [ ] **Step 1: Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

- [ ] **Step 2: Verificar as 3 páginas**

Abrir no browser:
- `http://localhost:3000/santos/sao-pedro`
- `http://localhost:3000/santos/sao-sebastiao`
- `http://localhost:3000/santos/sao-joao-bosco`

Checklist para cada página:
- [ ] Nome do santo aparece no título
- [ ] Imagem carrega sem erro 404
- [ ] Descrição exibida corretamente
- [ ] Oração visível
- [ ] Tags e metadados (país, período, padroeiro) presentes

- [ ] **Step 3: Verificar galeria geral**

Abrir `http://localhost:3000/santos` e confirmar que os 3 novos santos aparecem na listagem.

---

### Task 9: Commitar e abrir PR

**Files:**
- Nenhum arquivo modificado — apenas operação git

- [ ] **Step 1: Adicionar arquivos ao stage**

```bash
git add data/santos.json public/images/sao-pedro.jpg public/images/sao-sebastiao.jpg public/images/sao-joao-bosco.jpg
```

(Ajustar extensões `.jpg`/`.webp` conforme o formato real das imagens baixadas.)

- [ ] **Step 2: Commitar**

```bash
git commit -m "feat: adicionar São Pedro, São Sebastião e São João Bosco"
```

- [ ] **Step 3: Enviar para o remote**

```bash
git push -u origin feature/novos-santos
```

- [ ] **Step 4: Abrir Pull Request**

```bash
gh pr create --title "feat: adicionar 3 novos santos (São Pedro, São Sebastião, Dom Bosco)" --body "$(cat <<'EOF'
## Resumo

- Adiciona São Pedro (apóstolo, primeiro papa, popularidade 97)
- Adiciona São Sebastião (mártir, padroeiro do Rio de Janeiro, popularidade 90)
- Adiciona São João Bosco (fundador dos Salesianos, padroeiro da juventude, popularidade 85)

## Arquivos alterados

- `data/santos.json` — 3 novos objetos
- `public/images/sao-pedro.jpg`
- `public/images/sao-sebastiao.jpg`
- `public/images/sao-joao-bosco.jpg`

## Como testar

- Acessar `/santos/sao-pedro`, `/santos/sao-sebastiao`, `/santos/sao-joao-bosco`
- Verificar que aparecem na galeria `/santos`
- Confirmar que imagens carregam sem erro 404

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

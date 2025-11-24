# Especificações Técnicas - Funcionalidades do Portal Amigos do Céu

Este documento detalha cada funcionalidade proposta com especificações técnicas completas para desenvolvimento.

---

## 1. Sistema de Busca e Filtros

### 1.1 Descrição
Sistema completo de busca e filtragem para santos e igrejas, permitindo encontrar conteúdo de forma rápida e eficiente.

### 1.2 Estrutura de Dados

#### Atualizar `data/santos.json`:
```json
{
  "nome": "São Francisco de Assis",
  "slug": "sao-francisco-de-assis",
  "imagem": "/images/francisco_de_assis.jpg",
  "descricao": "...",
  "oracao": "...",
  "tags": ["Pobreza", "Natureza"],
  "dataNascimento": "1181",
  "dataFalecimento": "1226",
  "dataCanonizacao": "1228",
  "pais": "Itália",
  "ordemReligiosa": "Franciscanos",
  "padroeiro": ["Ecologia", "Animais"],
  "periodo": "Idade Média",
  "doutorIgreja": false,
  "popularidade": 95
}
```

#### Atualizar `data/igrejas.json`:
```json
{
  "nome": "Basílica de São Pedro",
  "local": "Vaticano",
  "slug": "basilica-sao-pedro",
  "imagem": "...",
  "descricao": "...",
  "ano": "1506-1626",
  "arquiteto": "...",
  "importancia": "...",
  "pais": "Vaticano",
  "cidade": "Roma",
  "estiloArquitetonico": "Renascimento",
  "tipo": "Basílica",
  "capacidade": 60000,
  "latitude": 41.9022,
  "longitude": 12.4539,
  "tags": ["Papal", "Peregrinação", "Histórica"]
}
```

### 1.3 Componentes a Criar

#### `components/SearchBar.js`
- Input de busca com debounce (300ms)
- Ícone de busca
- Botão de limpar
- Sugestões de autocomplete (opcional)
- Estado: `searchQuery`, `isSearching`

#### `components/FilterPanel.js`
- Filtros por categoria (tags, país, período, etc.)
- Checkboxes ou multi-select
- Botão "Limpar filtros"
- Contador de resultados
- Estado: `activeFilters`

#### `components/SearchResults.js`
- Lista de resultados
- Mensagem "Nenhum resultado encontrado"
- Paginação (opcional)
- Ordenação (alfabética, data, popularidade)

### 1.4 Páginas a Criar/Modificar

#### `pages/santos/index.js` (modificar)
- Adicionar `SearchBar` e `FilterPanel`
- Implementar lógica de filtragem
- Passar dados filtrados para `Gallery`

#### `pages/igrejas/index.js` (modificar)
- Adicionar `SearchBar` e `FilterPanel`
- Implementar lógica de filtragem
- Passar dados filtrados para `ChurchGallery`

### 1.5 Lógica de Busca

#### `lib/searchUtils.js` (criar)
```javascript
// Função de busca fuzzy
export function searchSaints(saints, query) {
  if (!query) return saints;
  
  const lowerQuery = query.toLowerCase();
  return saints.filter(saint => 
    saint.nome.toLowerCase().includes(lowerQuery) ||
    saint.descricao.toLowerCase().includes(lowerQuery) ||
    saint.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    saint.pais?.toLowerCase().includes(lowerQuery)
  );
}

// Função de filtragem
export function filterSaints(saints, filters) {
  return saints.filter(saint => {
    if (filters.paises?.length && !filters.paises.includes(saint.pais)) return false;
    if (filters.tags?.length && !filters.tags.some(tag => saint.tags.includes(tag))) return false;
    if (filters.periodo && saint.periodo !== filters.periodo) return false;
    if (filters.doutorIgreja !== undefined && saint.doutorIgreja !== filters.doutorIgreja) return false;
    return true;
  });
}

// Função de ordenação
export function sortSaints(saints, sortBy) {
  const sorted = [...saints];
  switch(sortBy) {
    case 'nome':
      return sorted.sort((a, b) => a.nome.localeCompare(b.nome));
    case 'canonizacao':
      return sorted.sort((a, b) => (b.dataCanonizacao || 0) - (a.dataCanonizacao || 0));
    case 'popularidade':
      return sorted.sort((a, b) => (b.popularidade || 0) - (a.popularidade || 0));
    default:
      return sorted;
  }
}
```

### 1.6 Hooks Customizados

#### `hooks/useSearch.js` (criar)
```javascript
import { useState, useMemo } from 'react';
import { searchSaints, filterSaints, sortSaints } from '../lib/searchUtils';

export function useSearch(data, initialFilters = {}) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('nome');

  const results = useMemo(() => {
    let filtered = searchSaints(data, query);
    filtered = filterSaints(filtered, filters);
    filtered = sortSaints(filtered, sortBy);
    return filtered;
  }, [data, query, filters, sortBy]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    results,
    count: results.length
  };
}
```

### 1.7 Dependências
- Nenhuma adicional necessária (usar React hooks nativos)

### 1.8 Considerações UX
- Feedback visual durante busca
- Animações suaves ao filtrar
- Persistir filtros na URL (query params)
- Mobile-first design

---

## 2. Calendário Litúrgico

### 2.1 Descrição
Sistema de calendário mostrando santos do dia, datas importantes e eventos litúrgicos.

### 2.2 Estrutura de Dados

#### Criar `data/calendario-liturgico.json`:
```json
{
  "2024": {
    "01-03": {
      "santos": ["sao-francisco-de-assis"],
      "eventos": ["Epifania"],
      "cor": "branco"
    },
    "10-04": {
      "santos": ["sao-francisco-de-assis"],
      "eventos": [],
      "cor": "branco"
    }
  }
}
```

#### Atualizar `data/santos.json`:
Adicionar campo `dataFesta`:
```json
{
  "dataFesta": "10-04", // formato MM-DD
  "dataFestaAlternativa": "04-10" // para santos com múltiplas datas
}
```

### 2.3 Componentes a Criar

#### `components/Calendar.js`
- Calendário mensal visual
- Destaque para dias com santos
- Navegação entre meses
- Click em dia mostra detalhes

#### `components/SantoDoDia.js`
- Card destacado com santo do dia
- Imagem, nome, breve descrição
- Link para página completa
- Botão de compartilhamento

#### `components/EventosLiturgicos.js`
- Lista de eventos do mês
- Cores litúrgicas
- Feriados e solenidades

### 2.4 Páginas a Criar

#### `pages/calendario/index.js`
- Layout com calendário e santo do dia
- Filtro por mês/ano
- Lista de todos os santos do mês

#### `pages/calendario/[mes]/[dia].js`
- Página de detalhes do dia específico
- Todos os santos do dia
- Eventos litúrgicos
- Leitura do dia (opcional)

### 2.5 Utilitários

#### `lib/calendarioUtils.js` (criar)
```javascript
// Obter santo do dia
export function getSantoDoDia(santos, date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  return santos.filter(saint => 
    saint.dataFesta === dateKey || 
    saint.dataFestaAlternativa === dateKey
  );
}

// Obter santos do mês
export function getSantosDoMes(santos, month, year) {
  return santos.filter(saint => {
    if (!saint.dataFesta) return false;
    const [saintMonth] = saint.dataFesta.split('-');
    return saintMonth === String(month).padStart(2, '0');
  });
}

// Formatar data para exibição
export function formatDataFesta(dataFesta) {
  const [month, day] = dataFesta.split('-');
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return `${day} de ${months[parseInt(month) - 1]}`;
}
```

### 2.6 Dependências
- `date-fns` ou usar Date nativo do JavaScript

### 2.7 Considerações UX
- Destaque visual para o dia atual
- Tooltip ao passar mouse sobre dias
- Responsivo (calendário adaptável)
- Compartilhamento de santo do dia

---

## 3. Oração e Devoção

### 3.1 Descrição
Sistema para gerenciar orações, novenas, tríduos e intenções de oração.

### 3.2 Estrutura de Dados

#### Criar `data/oracoes.json`:
```json
[
  {
    "id": "oracao-francisco-1",
    "titulo": "Oração de São Francisco",
    "texto": "Senhor, fazei-me instrumento de vossa paz...",
    "santo": "sao-francisco-de-assis",
    "tipo": "oracao",
    "categoria": "Paz",
    "popularidade": 100
  }
]
```

#### Criar `data/novenas.json`:
```json
[
  {
    "id": "novena-francisco",
    "titulo": "Novena de São Francisco",
    "santo": "sao-francisco-de-assis",
    "duracao": 9,
    "dias": [
      {
        "dia": 1,
        "oracao": "...",
        "meditacao": "...",
        "intencao": "..."
      }
    ],
    "dataInicio": null, // null = pode começar a qualquer momento
    "imagem": "..."
  }
]
```

#### Criar `data/triduos.json`:
```json
[
  {
    "id": "triduo-francisco",
    "titulo": "Tríduo de São Francisco",
    "santo": "sao-francisco-de-assis",
    "duracao": 3,
    "dias": [...]
  }
]
```

### 3.3 Componentes a Criar

#### `components/OracaoCard.js`
- Card com oração
- Botão de copiar texto
- Botão de compartilhar
- Botão de favoritar
- Áudio (TTS opcional)

#### `components/NovenaTracker.js`
- Progresso da novena (X/9 dias)
- Dia atual destacado
- Botão "Marcar como concluído"
- Notificações (localStorage)

#### `components/IntencoesOracao.js`
- Formulário para adicionar intenção
- Lista de intenções (públicas ou privadas)
- Contador de pessoas orando
- Sistema de "estou orando por isso"

#### `components/ContadorOracoes.js`
- Contador visual (tipo rosário)
- Botão para incrementar
- Reset diário
- Estatísticas

### 3.4 Páginas a Criar

#### `pages/oracoes/index.js`
- Lista de todas as orações
- Filtros por santo, categoria
- Busca

#### `pages/oracoes/[id].js`
- Página individual da oração
- Texto completo
- Áudio
- Compartilhamento

#### `pages/novenas/index.js`
- Lista de novenas disponíveis
- Novenas em andamento do usuário
- Novenas concluídas

#### `pages/novenas/[id].js`
- Página da novena
- `NovenaTracker`
- Conteúdo do dia atual
- Navegação entre dias

#### `pages/intencoes/index.js`
- Lista de intenções públicas
- Formulário para criar
- Filtros

### 3.5 Hooks Customizados

#### `hooks/useNovena.js` (criar)
```javascript
import { useState, useEffect } from 'react';

export function useNovena(novenaId) {
  const [progresso, setProgresso] = useState(() => {
    const saved = localStorage.getItem(`novena-${novenaId}`);
    return saved ? JSON.parse(saved) : { diaAtual: 1, concluidos: [] };
  });

  const marcarDia = (dia) => {
    setProgresso(prev => {
      const novo = {
        ...prev,
        concluidos: [...prev.concluidos, dia],
        diaAtual: Math.max(prev.diaAtual, dia + 1)
      };
      localStorage.setItem(`novena-${novenaId}`, JSON.stringify(novo));
      return novo;
    });
  };

  return { progresso, marcarDia };
}
```

### 3.6 Dependências
- `react-speech-kit` (opcional, para TTS)
- `react-share` (compartilhamento)

### 3.7 Considerações UX
- Animações ao completar dia da novena
- Notificações diárias (Web Notifications API)
- Modo offline (localStorage)
- Compartilhamento social

---

## 4. Mapa Interativo

### 4.1 Descrição
Mapa mostrando localização de igrejas, rotas de peregrinação e funcionalidade de geolocalização.

### 4.2 Estrutura de Dados

#### Atualizar `data/igrejas.json`:
Garantir que todas tenham:
```json
{
  "latitude": 41.9022,
  "longitude": 12.4539,
  "endereco": "Piazza San Pietro, 00120 Città del Vaticano",
  "telefone": "+39 06 6982",
  "horarios": {
    "segunda": "07:00-19:00",
    "terca": "07:00-19:00",
    ...
  },
  "site": "https://...",
  "rotasPeregrinacao": ["caminho-roma"]
}
```

#### Criar `data/rotas-peregrinacao.json`:
```json
[
  {
    "id": "caminho-roma",
    "nome": "Caminho de Roma",
    "descricao": "...",
    "igrejas": ["basilica-sao-pedro", "sao-joao-laterano"],
    "distancia": 5.2,
    "duracao": "2 horas",
    "dificuldade": "fácil",
    "coordenadas": [
      {"lat": 41.9022, "lng": 12.4539},
      {"lat": 41.8859, "lng": 12.5057}
    ]
  }
]
```

### 4.3 Componentes a Criar

#### `components/Mapa.js`
- Integração com Google Maps ou Leaflet
- Marcadores para cada igreja
- Clusters quando zoom out
- InfoWindow ao clicar

#### `components/IgrejaMarker.js`
- Marcador customizado
- Badge com tipo (Basílica, Catedral, etc.)
- Tooltip com nome

#### `components/RotaPeregrinacao.js`
- Linha no mapa mostrando rota
- Informações da rota
- Botão "Começar rota"

#### `components/IgrejasProximas.js`
- Lista de igrejas próximas ao usuário
- Distância calculada
- Botão de navegação (Google Maps/Waze)

### 4.4 Páginas a Criar

#### `pages/mapa/index.js`
- Mapa principal
- Filtros (tipo, país, etc.)
- Toggle de rotas de peregrinação
- Botão "Encontrar igrejas próximas"

#### `pages/rotas/[id].js`
- Página da rota de peregrinação
- Mapa com rota destacada
- Lista de igrejas na rota
- Informações práticas

### 4.5 Utilitários

#### `lib/mapUtils.js` (criar)
```javascript
// Calcular distância entre dois pontos (Haversine)
export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Encontrar igrejas próximas
export function encontrarIgrejasProximas(igrejas, userLat, userLng, raioKm = 50) {
  return igrejas
    .filter(igreja => igreja.latitude && igreja.longitude)
    .map(igreja => ({
      ...igreja,
      distancia: calcularDistancia(userLat, userLng, igreja.latitude, igreja.longitude)
    }))
    .filter(igreja => igreja.distancia <= raioKm)
    .sort((a, b) => a.distancia - b.distancia);
}
```

### 4.6 Dependências
- `react-leaflet` ou `@react-google-maps/api`
- `leaflet` (se usar Leaflet)
- `@types/leaflet` (TypeScript, opcional)

### 4.7 Considerações UX
- Loading state durante carregamento do mapa
- Permissão de geolocalização (tratar erro)
- Modo offline (cache de mapas)
- Acessibilidade (navegação por teclado)

---

## 5. Relacionamentos e Conexões

### 5.1 Descrição
Sistema para mostrar relacionamentos entre santos, igrejas dedicadas e relíquias.

### 5.2 Estrutura de Dados

#### Atualizar `data/santos.json`:
```json
{
  "relacionamentos": {
    "mentor": "santo-antonio-de-padua",
    "discipulos": ["santa-clara"],
    "ordemReligiosa": "Franciscanos",
    "contemporaneos": ["santo-domingos"],
    "influenciadoPor": ["sao-bento-de-nursia"]
  },
  "igrejasDedicadas": ["basilica-sao-pedro"],
  "reliquias": [
    {
      "tipo": "corpo",
      "local": "Basílica de São Francisco, Assis",
      "descricao": "..."
    }
  ]
}
```

#### Criar `data/reliquias.json`:
```json
[
  {
    "id": "reliquia-francisco-1",
    "santo": "sao-francisco-de-assis",
    "tipo": "corpo",
    "local": "Basílica de São Francisco",
    "igreja": "basilica-sao-francisco-assis",
    "descricao": "...",
    "latitude": 43.0703,
    "longitude": 12.6193
  }
]
```

### 5.3 Componentes a Criar

#### `components/RelacionamentosSanto.js`
- Grafo visual de relacionamentos
- Cards de santos relacionados
- Links clicáveis

#### `components/IgrejasDedicadas.js`
- Lista de igrejas dedicadas ao santo
- Cards com preview
- Link para página da igreja

#### `components/Reliquias.js`
- Lista de relíquias
- Localização no mapa
- Informações históricas

#### `components/GrafoRelacionamentos.js`
- Visualização em grafo (usando biblioteca de grafos)
- Nós = santos
- Arestas = relacionamentos
- Interativo (zoom, pan)

### 5.4 Páginas a Modificar

#### `pages/santos/[slug].js` (modificar)
- Adicionar seção "Relacionamentos"
- Adicionar seção "Igrejas Dedicadas"
- Adicionar seção "Relíquias"

### 5.5 Utilitários

#### `lib/relacionamentosUtils.js` (criar)
```javascript
// Encontrar todos os relacionamentos de um santo
export function getRelacionamentos(santo, todosSantos) {
  const relacionamentos = {
    mentor: null,
    discipulos: [],
    contemporaneos: [],
    influenciados: []
  };

  if (santo.relacionamentos?.mentor) {
    relacionamentos.mentor = todosSantos.find(
      s => s.slug === santo.relacionamentos.mentor
    );
  }

  // Buscar discípulos
  todosSantos.forEach(s => {
    if (s.relacionamentos?.mentor === santo.slug) {
      relacionamentos.discipulos.push(s);
    }
  });

  return relacionamentos;
}

// Encontrar igrejas dedicadas a um santo
export function getIgrejasDedicadas(santoSlug, todasIgrejas) {
  return todasIgrejas.filter(igreja => 
    igreja.santoDedicado === santoSlug ||
    igreja.santosDedicados?.includes(santoSlug)
  );
}
```

### 5.6 Dependências
- `react-force-graph` ou `vis-network` (para visualização de grafos)
- `d3` (opcional, para visualizações customizadas)

### 5.7 Considerações UX
- Animações ao expandir relacionamentos
- Tooltips informativos
- Navegação intuitiva
- Performance (lazy loading de grafos grandes)

---

## 6. Conteúdo Multimídia

### 6.1 Descrição
Sistema para gerenciar galerias de imagens, vídeos, áudios e tours virtuais.

### 6.2 Estrutura de Dados

#### Criar `data/multimidia.json`:
```json
{
  "santos": {
    "sao-francisco-de-assis": {
      "imagens": [
        {
          "url": "...",
          "titulo": "São Francisco pregando aos pássaros",
          "autor": "Giotto",
          "ano": "1295",
          "local": "Basílica de Assis",
          "tipo": "afresco"
        }
      ],
      "videos": [
        {
          "id": "video-1",
          "titulo": "Documentário sobre São Francisco",
          "url": "https://youtube.com/...",
          "tipo": "youtube",
          "duracao": "45:00"
        }
      ],
      "audios": [
        {
          "id": "audio-1",
          "titulo": "Oração de São Francisco (canto)",
          "url": "/audio/oracao-francisco.mp3",
          "duracao": "3:25"
        }
      ]
    }
  },
  "igrejas": {
    "basilica-sao-pedro": {
      "imagens": [...],
      "videos": [...],
      "toursVirtuais": [
        {
          "id": "tour-1",
          "titulo": "Tour 360° da Basílica",
          "tipo": "360",
          "url": "...",
          "pontos": [
            {"nome": "Nave Central", "url": "..."},
            {"nome": "Altar Principal", "url": "..."}
          ]
        }
      ]
    }
  }
}
```

### 6.3 Componentes a Criar

#### `components/GaleriaImagens.js`
- Grid de imagens
- Lightbox ao clicar
- Navegação (anterior/próxima)
- Zoom
- Informações da imagem

#### `components/VideoPlayer.js`
- Player de vídeo (YouTube/Vimeo)
- Controles customizados
- Lista de vídeos relacionados

#### `components/AudioPlayer.js`
- Player de áudio HTML5
- Controles (play, pause, volume)
- Lista de reprodução
- Progresso

#### `components/TourVirtual.js`
- Visualizador 360°
- Navegação entre pontos
- Controles de movimento
- Informações sobre cada ponto

#### `components/Lightbox.js`
- Modal fullscreen
- Imagem grande
- Navegação
- Fechar com ESC
- Informações

### 6.4 Páginas a Modificar

#### `pages/santos/[slug].js` (modificar)
- Adicionar seção "Galeria"
- Adicionar seção "Vídeos"
- Adicionar seção "Áudios"

#### `pages/igrejas/[slug].js` (modificar)
- Adicionar seção "Galeria"
- Adicionar seção "Tour Virtual"
- Adicionar seção "Vídeos"

### 6.5 Hooks Customizados

#### `hooks/useLightbox.js` (criar)
```javascript
import { useState } from 'react';

export function useLightbox(imagens) {
  const [indexAtual, setIndexAtual] = useState(null);
  const [estaAberto, setEstaAberto] = useState(false);

  const abrir = (index) => {
    setIndexAtual(index);
    setEstaAberto(true);
  };

  const fechar = () => {
    setEstaAberto(false);
    setIndexAtual(null);
  };

  const proxima = () => {
    setIndexAtual((prev) => (prev + 1) % imagens.length);
  };

  const anterior = () => {
    setIndexAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  return {
    indexAtual,
    estaAberto,
    imagemAtual: indexAtual !== null ? imagens[indexAtual] : null,
    abrir,
    fechar,
    proxima,
    anterior
  };
}
```

### 6.6 Dependências
- `react-image-gallery` (galeria de imagens)
- `react-player` (vídeos YouTube/Vimeo)
- `react-360` ou `@react-three/fiber` (tours 360°)
- `framer-motion` (já existe, para animações)

### 6.7 Considerações UX
- Lazy loading de imagens
- Placeholder durante carregamento
- Otimização de imagens (next/image)
- Acessibilidade (alt text, ARIA labels)

---

## 7. Conteúdo Educacional

### 7.1 Descrição
Seção educacional com artigos, linha do tempo, glossário e biografias expandidas.

### 7.2 Estrutura de Dados

#### Criar `data/artigos.json`:
```json
[
  {
    "id": "artigo-1",
    "titulo": "A História do Monaquismo",
    "slug": "historia-monaquismo",
    "autor": "Equipe Amigos do Céu",
    "dataPublicacao": "2024-01-15",
    "categoria": "História",
    "tags": ["Monaquismo", "São Bento", "Idade Média"],
    "resumo": "...",
    "conteudo": "...",
    "imagem": "...",
    "tempoLeitura": 8,
    "relacionados": ["sao-bento-de-nursia"]
  }
]
```

#### Criar `data/glossario.json`:
```json
[
  {
    "termo": "Canonização",
    "definicao": "Processo pelo qual a Igreja declara oficialmente que uma pessoa é santa...",
    "categoria": "Processos",
    "relacionados": ["Beatificação", "Santidade"]
  }
]
```

#### Criar `data/linha-tempo.json`:
```json
[
  {
    "ano": 1226,
    "evento": "Morte de São Francisco de Assis",
    "tipo": "morte",
    "santo": "sao-francisco-de-assis",
    "importancia": "alta",
    "descricao": "..."
  }
]
```

### 7.3 Componentes a Criar

#### `components/ArtigoCard.js`
- Card de artigo
- Imagem, título, resumo
- Tempo de leitura
- Tags
- Data

#### `components/LinhaTempo.js`
- Timeline vertical/horizontal
- Eventos marcados
- Filtros por período
- Zoom in/out
- Interativo

#### `components/Glossario.js`
- Lista alfabética
- Busca
- Cards expansíveis
- Links para termos relacionados

#### `components/BiografiaExpandida.js`
- Biografia completa formatada
- Seções (infância, conversão, obras, etc.)
- Citações destacadas
- Referências

### 7.4 Páginas a Criar

#### `pages/artigos/index.js`
- Lista de artigos
- Filtros por categoria
- Busca
- Paginação

#### `pages/artigos/[slug].js`
- Artigo completo
- Formatação markdown
- Tabela de conteúdos
- Artigos relacionados
- Compartilhamento

#### `pages/glossario/index.js`
- Lista completa do glossário
- Busca alfabética
- Filtros

#### `pages/linha-tempo/index.js`
- Timeline interativa
- Filtros (santos, eventos, período)
- Zoom

### 7.5 Utilitários

#### `lib/markdownUtils.js` (criar)
```javascript
// Converter markdown para HTML (se usar markdown)
import { remark } from 'remark';
import html from 'remark-html';

export async function processMarkdown(markdown) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}
```

### 7.6 Dependências
- `react-markdown` (renderizar markdown)
- `react-timeline` ou `react-chrono` (timeline)
- `remark` e `remark-html` (processar markdown)

### 7.7 Considerações UX
- Tabela de conteúdos fixa (sticky)
- Progresso de leitura
- Modo de leitura (foco)
- Imprimir artigo

---

## 8. Interatividade e Comunidade

### 8.1 Descrição
Sistema de favoritos, comentários, compartilhamento e avaliações.

### 8.2 Estrutura de Dados

#### Criar `lib/favoritos.js` (localStorage):
```javascript
// Estrutura no localStorage:
{
  "favoritos": {
    "santos": ["sao-francisco-de-assis", "santa-teresa-de-avila"],
    "igrejas": ["basilica-sao-pedro"],
    "oracoes": ["oracao-francisco-1"]
  }
}
```

#### Criar `data/comentarios.json` (ou usar API):
```json
[
  {
    "id": "comentario-1",
    "tipo": "santo",
    "slug": "sao-francisco-de-assis",
    "usuario": "Maria Silva",
    "texto": "...",
    "data": "2024-01-15T10:30:00Z",
    "aprovado": true,
    "likes": 5
  }
]
```

### 8.3 Componentes a Criar

#### `components/FavoritoButton.js`
- Botão de favoritar
- Ícone (coração vazio/cheio)
- Animação ao favoritar
- Persistência (localStorage)

#### `components/Comentarios.js`
- Lista de comentários
- Formulário para adicionar
- Moderação (aprovado/pendente)
- Likes em comentários
- Respostas (threading)

#### `components/Compartilhar.js`
- Botões de compartilhamento
- Facebook, Twitter, WhatsApp
- Copiar link
- Modal com opções

#### `components/Avaliacao.js`
- Sistema de estrelas (1-5)
- Média de avaliações
- Número de avaliações
- Gráfico de distribuição

#### `components/Testemunhos.js`
- Cards de testemunhos
- Formulário para enviar
- Moderação
- Filtros

### 8.4 Páginas a Criar

#### `pages/favoritos/index.js`
- Lista de favoritos do usuário
- Organização por categoria
- Remover favoritos
- Compartilhar lista

### 8.5 Hooks Customizados

#### `hooks/useFavoritos.js` (criar)
```javascript
import { useState, useEffect } from 'react';

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(() => {
    if (typeof window === 'undefined') return { santos: [], igrejas: [], oracoes: [] };
    const saved = localStorage.getItem('favoritos');
    return saved ? JSON.parse(saved) : { santos: [], igrejas: [], oracoes: [] };
  });

  const adicionarFavorito = (tipo, slug) => {
    setFavoritos(prev => {
      const novo = {
        ...prev,
        [tipo]: [...prev[tipo], slug]
      };
      localStorage.setItem('favoritos', JSON.stringify(novo));
      return novo;
    });
  };

  const removerFavorito = (tipo, slug) => {
    setFavoritos(prev => {
      const novo = {
        ...prev,
        [tipo]: prev[tipo].filter(s => s !== slug)
      };
      localStorage.setItem('favoritos', JSON.stringify(novo));
      return novo;
    });
  };

  const isFavorito = (tipo, slug) => {
    return favoritos[tipo]?.includes(slug);
  };

  return { favoritos, adicionarFavorito, removerFavorito, isFavorito };
}
```

### 8.6 Dependências
- `react-share` (compartilhamento)
- `react-rating` (avaliações)
- `react-hook-form` (formulários)

### 8.7 Considerações UX
- Feedback visual imediato
- Animações suaves
- Validação de formulários
- Moderação de conteúdo

---

## 9. Personalização

### 9.1 Descrição
Sistema de perfil de usuário, preferências e customização.

### 9.2 Estrutura de Dados

#### Criar `lib/userPreferences.js`:
```javascript
// Estrutura no localStorage:
{
  "preferencias": {
    "tema": "claro", // claro, escuro, auto
    "idioma": "pt-BR",
    "notificacoes": {
      "santoDoDia": true,
      "novenas": true,
      "artigos": false
    },
    "santosPadroeiros": ["sao-francisco-de-assis"],
    "configuracoes": {
      "tamanhoFonte": "medio",
      "animacoes": true
    }
  }
}
```

### 9.3 Componentes a Criar

#### `components/PerfilUsuario.js`
- Informações do usuário
- Avatar
- Estatísticas (favoritos, orações, etc.)
- Configurações

#### `components/SeletorTema.js`
- Toggle claro/escuro
- Preview
- Persistência

#### `components/Configuracoes.js`
- Painel de configurações
- Tamanho de fonte
- Animações on/off
- Notificações
- Idioma

#### `components/SantosPadroeiros.js`
- Seleção de santos padroeiros
- Cards dos santos escolhidos
- Remover/adicionar

### 9.4 Páginas a Criar

#### `pages/perfil/index.js`
- Página de perfil
- Editar informações
- Configurações
- Estatísticas

### 9.5 Hooks Customizados

#### `hooks/useTema.js` (criar)
```javascript
import { useState, useEffect } from 'react';

export function useTema() {
  const [tema, setTema] = useState(() => {
    if (typeof window === 'undefined') return 'claro';
    const saved = localStorage.getItem('tema');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'escuro') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tema', tema);
  }, [tema]);

  return [tema, setTema];
}
```

### 9.6 Dependências
- `next-themes` (gerenciamento de tema)
- Nenhuma adicional (usar CSS variables)

### 9.7 Considerações UX
- Transição suave entre temas
- Respeitar preferência do sistema
- Persistência de preferências
- Acessibilidade

---

## 10. Recursos Técnicos (SEO, PWA, i18n)

### 10.1 SEO Otimizado

#### Modificar `pages/_app.js`:
```javascript
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Portal católico sobre santos e igrejas" />
        <meta name="keywords" content="santos, igrejas, catolicismo, fé" />
        <meta property="og:title" content="Amigos do Céu" />
        <meta property="og:description" content="..." />
        <meta property="og:image" content="..." />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
```

#### Criar `lib/seo.js`:
```javascript
export function generateSEOMetadata({ title, description, image, slug, type = 'website' }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amigosdoceu.com';
  
  return {
    title: `${title} | Amigos do Céu`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${slug}`,
      type,
      images: [{ url: image }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}
```

#### Criar `pages/sitemap.xml.js`:
```javascript
export default function Sitemap() {
  // Gerar sitemap dinamicamente
}
```

### 10.2 PWA (Progressive Web App)

#### Criar `public/manifest.json`:
```json
{
  "name": "Amigos do Céu",
  "short_name": "Amigos do Céu",
  "description": "Portal católico sobre santos e igrejas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Criar `public/sw.js` (Service Worker):
```javascript
// Service Worker para cache offline
```

#### Modificar `next.config.js`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public'
});

module.exports = withPWA({
  // ... configurações existentes
});
```

### 10.3 Internacionalização (i18n)

#### Criar `locales/pt-BR.json`:
```json
{
  "common": {
    "buscar": "Buscar",
    "favoritos": "Favoritos",
    "compartilhar": "Compartilhar"
  },
  "santos": {
    "titulo": "Santos",
    "descricao": "Conheça as vidas inspiradoras dos santos"
  }
}
```

#### Criar `locales/en-US.json`:
```json
{
  "common": {
    "buscar": "Search",
    "favoritos": "Favorites",
    "compartilhar": "Share"
  },
  "santos": {
    "titulo": "Saints",
    "descricao": "Discover the inspiring lives of saints"
  }
}
```

#### Instalar e configurar `next-i18next`:
```javascript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en-US', 'es-ES']
  }
};
```

### 10.4 Dependências
- `next-pwa` (PWA)
- `next-i18next` (i18n)
- `next-seo` (SEO helpers, opcional)

---

## 11. Conteúdo Adicional

### 11.1 Milagres e Relatos

#### Criar `data/milagres.json`:
```json
[
  {
    "id": "milagre-1",
    "santo": "sao-francisco-de-assis",
    "titulo": "Estigmas de São Francisco",
    "data": "1224-09-14",
    "local": "Monte Alverne",
    "descricao": "...",
    "testemunhas": ["Frei Leão"],
    "reconhecido": true,
    "fonte": "..."
  }
]
```

### 11.2 Arte Sacra

#### Criar `data/arte-sacra.json`:
```json
[
  {
    "id": "arte-1",
    "titulo": "São Francisco pregando aos pássaros",
    "artista": "Giotto",
    "ano": "1295",
    "tipo": "afresco",
    "local": "Basílica de Assis",
    "santo": "sao-francisco-de-assis",
    "imagem": "...",
    "descricao": "..."
  }
]
```

### 11.3 Música Sacra

#### Criar `data/musica-sacra.json`:
```json
[
  {
    "id": "musica-1",
    "titulo": "Cântico das Criaturas",
    "compositor": "São Francisco de Assis",
    "santo": "sao-francisco-de-assis",
    "tipo": "canto",
    "audio": "...",
    "letra": "...",
    "traducao": "..."
  }
]
```

---

## 12. Recursos Devocionais

### 12.1 Contador de Rosário Virtual

#### Criar `components/RosarioVirtual.js`:
- Visualização das contas do rosário
- Navegação entre mistérios
- Oração atual destacada
- Progresso visual
- Áudio guiado (opcional)

#### Criar `data/rosario.json`:
```json
{
  "mistérios": {
    "gozosos": {
      "dias": ["segunda", "sabado"],
      "misterios": [
        {
          "numero": 1,
          "nome": "Anunciação",
          "oracao": "...",
          "meditacao": "..."
        }
      ]
    }
  },
  "oracoes": {
    "paiNosso": "...",
    "aveMaria": "...",
    "gloria": "..."
  }
}
```

### 12.2 Leituras Bíblicas do Dia

#### Integração com API:
- Usar API do Vaticano ou criar dados próprios
- Criar `data/leituras-diarias.json`

### 12.3 Citações Diárias

#### Criar `data/citacoes.json`:
```json
[
  {
    "texto": "Senhor, fazei-me instrumento de vossa paz...",
    "autor": "São Francisco de Assis",
    "santo": "sao-francisco-de-assis",
    "data": "10-04"
  }
]
```

---

## 13. Integração com APIs Externas

### 13.1 API do Vaticano
- Calendário litúrgico oficial
- Leituras do dia
- Documentos papais

### 13.2 Wikipedia
- Buscar informações adicionais
- Imagens
- Links relacionados

### 13.3 Google Maps
- Localização de igrejas
- Rotas
- Street View

### 13.4 APIs de Clima
- Previsão para peregrinações
- Condições ideais

---

## 14. Analytics e Insights

### 14.1 Estatísticas
- Santos mais visitados
- Igrejas mais populares
- Buscas mais comuns
- Tempo médio de visita

### 14.2 Implementação
- Google Analytics
- Plausible Analytics (privacy-friendly)
- Dashboard interno

---

## 15. Acessibilidade

### 15.1 Recursos
- ARIA labels
- Navegação por teclado
- Alto contraste
- Tamanho de fonte ajustável
- Suporte a leitores de tela

### 15.2 Testes
- Lighthouse
- axe DevTools
- WAVE

---

## Priorização de Implementação

### Fase 1 (Essencial)
1. Sistema de Busca e Filtros
2. Calendário Litúrgico (básico)
3. Favoritos
4. SEO básico

### Fase 2 (Importante)
5. Mapa Interativo
6. Oração e Devoção (básico)
7. Relacionamentos
8. Conteúdo Multimídia

### Fase 3 (Melhorias)
9. Conteúdo Educacional
10. Interatividade e Comunidade
11. Personalização
12. PWA

### Fase 4 (Avançado)
13. i18n
14. Analytics
15. Integrações externas

---

## Notas Finais

- Todas as funcionalidades devem ser mobile-first
- Usar TypeScript (opcional, mas recomendado)
- Implementar testes (Jest, React Testing Library)
- Documentar código
- Versionar API (se criar backend)
- Considerar performance (lazy loading, code splitting)
- Segurança (validação de inputs, sanitização)







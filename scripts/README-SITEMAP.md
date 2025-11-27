# Geração de Sitemap

Este diretório contém o script para geração automática do sitemap.xml da aplicação Amigos do Céu.

## Como funciona

O script `generate-sitemap.js` lê todos os arquivos JSON da pasta `data/` e gera um sitemap.xml completo com todas as URLs do site, incluindo:

### Páginas Estáticas
- Home (/)
- Santos (/santos)
- Igrejas (/igrejas)
- Aparições (/aparicoes)
- Calendário Litúrgico (/calendario)
- Santos do Dia (/santos-do-dia)
- Mapa Interativo (/mapa)
- Rosário (/rosario)
- Vida de Cristo (/vida-de-cristo)
- Novenas (/novenas)
- Orações (/oracoes)
- Álbum Sagrado (/album-sagrado)
- Favoritos (/favoritos)
- Intenções (/intencoes)

### Páginas Dinâmicas
- Páginas individuais de santos (/santos/[slug])
- Páginas individuais de igrejas (/igrejas/[slug])
- Páginas individuais de aparições (/aparicoes/[slug])
- Páginas individuais de novenas (/novenas/[slug])
- Páginas individuais de orações (/oracoes/[slug])
- Páginas de coleções do álbum (/album-sagrado/[slug])

## Uso

### Geração manual
```bash
npm run sitemap
```

### Geração automática no build
O sitemap é gerado automaticamente antes de cada build através do script `prebuild`:
```bash
npm run build
```

## Configuração

### Alterar o domínio do site
Por padrão, o sitemap usa `https://amigosdoceu.com.br`. Para alterar:

1. Defina a variável de ambiente `NEXT_PUBLIC_SITE_URL`:
```bash
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br npm run sitemap
```

2. Ou edite o arquivo `scripts/generate-sitemap.js` e altere a constante `SITE_URL`

### Alterar prioridades e frequências
Edite o arquivo `scripts/generate-sitemap.js` e modifique os arrays `staticPages` ou as configurações nas seções de URLs dinâmicas.

## Arquivos gerados

- `/public/sitemap.xml` - Sitemap principal
- `/public/robots.txt` - Arquivo robots.txt com referência ao sitemap

## Validação

Após gerar o sitemap, você pode validá-lo usando:
- [Google Search Console](https://search.google.com/search-console)
- [Validador de Sitemap XML](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## Submissão aos motores de busca

1. Google Search Console: https://search.google.com/search-console
2. Bing Webmaster Tools: https://www.bing.com/webmasters

Submeta a URL: `https://amigosdoceu.com.br/sitemap.xml`

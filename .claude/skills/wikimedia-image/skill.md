---
name: wikimedia-image
description: Use when you need to find and download images from Wikimedia Commons for saints, churches, artworks, or religious subjects. Use this skill to discover file names, fetch direct image URLs, and save images locally to the project.
---

# Wikimedia Image Fetcher

Busca e baixa imagens do Wikimedia Commons via API oficial.

## Problemas comuns (e por que o curl simples falha)

- **Wikimedia bloqueia requests sem User-Agent** — sempre inclua `-H "User-Agent: Mozilla/5.0"`
- **Nomes de arquivo com acentos/espaços quebram a URL** — use Python com `urllib.parse.quote`
- **Você raramente sabe o nome exato do arquivo** — faça uma busca primeiro

## Workflow completo

### Passo 1 — Buscar nomes de arquivo

```bash
python3 -c "
import urllib.request, json, urllib.parse

query = 'TERMOS DE BUSCA'  # ex: 'Murillo Inmaculada Concepcion'
encoded = urllib.parse.quote(query)
url = f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={encoded}&srnamespace=6&srlimit=5&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.load(r)
for result in data['query']['search']:
    print(result['title'])
"
```

### Passo 2 — Obter URL direta do arquivo

```bash
python3 -c "
import urllib.request, json, urllib.parse

filename = 'NOME_DO_ARQUIVO_AQUI.jpg'  # exato, incluindo extensão
title = urllib.parse.quote('File:' + filename)
url = f'https://commons.wikimedia.org/w/api.php?action=query&titles={title}&prop=imageinfo&iiprop=url&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.load(r)
page = list(data['query']['pages'].values())[0]
if 'imageinfo' in page:
    print(page['imageinfo'][0]['url'])
else:
    print('Arquivo não encontrado:', page.get('title'))
"
```

### Passo 3 — Baixar e salvar

```bash
python3 -c "
import urllib.request

url = 'URL_OBTIDA_NO_PASSO_2'
destino = '/caminho/para/public/images/nome.jpg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=30) as r:
    data = r.read()
with open(destino, 'wb') as f:
    f.write(data)
print(f'Salvo: {destino} ({len(data)//1024} KB)')
"
```

## Notas importantes

- **Sempre use User-Agent** — sem ele, a API retorna resposta vazia ou erro
- **Nomes de arquivo são case-sensitive** — `Duomo_di_Milano.JPG` ≠ `duomo_di_milano.jpg`
- **Prefira arquivos `.jpg` e `.png`** — evite `.svg` para fotos (qualidade variável)
- **Evite URLs com `/thumb/`** — são versões redimensionadas; use a URL principal
- **Para este projeto** — salve em `public/images/` e use o caminho relativo `/images/nome.jpg` no JSON

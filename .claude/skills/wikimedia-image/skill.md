# Wikimedia Image Fetcher

Busca URLs de imagens em alta resolução do Wikimedia Commons usando a API oficial.

## Como usar

Quando precisar buscar uma imagem do Wikimedia Commons:

1. **Encontre o nome do arquivo** na página do Commons (geralmente no formato "File:Nome_do_arquivo.jpg")
2. **Use a API do Wikimedia** para obter a URL direta da imagem

## Método

Use este comando Bash para buscar a URL da imagem:

```bash
curl -s "https://commons.wikimedia.org/w/api.php?action=query&titles=File:NOME_DO_ARQUIVO&prop=imageinfo&iiprop=url&format=json" | python3 -c "import sys, json; data = json.load(sys.stdin); pages = data['query']['pages']; print(list(pages.values())[0]['imageinfo'][0]['url'])"
```

**Substitua `NOME_DO_ARQUIVO`** pelo nome real do arquivo (ex: `Duomo_di_Milano.JPG`)

## Exemplo

Para buscar a imagem da Catedral de Milão:

```bash
curl -s "https://commons.wikimedia.org/w/api.php?action=query&titles=File:Duomo_di_Milano.JPG&prop=imageinfo&iiprop=url&format=json" | python3 -c "import sys, json; data = json.load(sys.stdin); pages = data['query']['pages']; print(list(pages.values())[0]['imageinfo'][0]['url'])"
```

Retorna:
```
https://upload.wikimedia.org/wikipedia/commons/5/57/Duomo_di_Milano.JPG
```

## Workflow completo

1. Usuário fornece o nome da igreja/monumento
2. Busque no Wikimedia Commons a página correspondente (ex: `https://commons.wikimedia.org/wiki/Category:Nome_da_Igreja`)
3. Identifique o nome do arquivo de uma boa imagem (ex: `File:Nome.jpg`)
4. Use o comando acima para obter a URL direta
5. Use a URL no projeto

## Notas importantes

- A API do Wikimedia é pública e não tem bloqueios como o site principal
- Sempre use URLs do tipo `https://upload.wikimedia.org/wikipedia/commons/...`
- Evite URLs com `/thumb/` pois são versões redimensionadas
- Certifique-se de usar o nome correto do arquivo (case-sensitive)

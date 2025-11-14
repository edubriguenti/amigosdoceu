#!/usr/bin/env node

/**
 * Script para buscar URLs de imagens do Wikimedia Commons
 *
 * Uso: node scripts/get-wikimedia-image.js "File:Nome_do_arquivo.jpg"
 *
 * Exemplo:
 *   node scripts/get-wikimedia-image.js "File:Duomo_di_Milano.JPG"
 *
 * Retorna a URL completa da imagem em alta resolução
 */

const https = require('https');

const filename = process.argv[2];

if (!filename) {
  console.error('Erro: Forneça o nome do arquivo como argumento');
  console.error('Uso: node scripts/get-wikimedia-image.js "File:Nome_do_arquivo.jpg"');
  process.exit(1);
}

const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;

https.get(apiUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const pages = json.query.pages;
      const page = Object.values(pages)[0];

      if (page.imageinfo && page.imageinfo[0]) {
        console.log(page.imageinfo[0].url);
      } else {
        console.error('Erro: Imagem não encontrada');
        process.exit(1);
      }
    } catch (error) {
      console.error('Erro ao processar resposta:', error.message);
      process.exit(1);
    }
  });

}).on('error', (error) => {
  console.error('Erro na requisição:', error.message);
  process.exit(1);
});

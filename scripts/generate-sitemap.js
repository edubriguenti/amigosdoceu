const fs = require('fs');
const path = require('path');

// Domínio do site (altere para o domínio real em produção)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amigosdoceu.vercel.app';

// Páginas estáticas
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/santos', changefreq: 'daily', priority: '0.9' },
  { url: '/igrejas', changefreq: 'weekly', priority: '0.9' },
  { url: '/aparicoes', changefreq: 'weekly', priority: '0.9' },
  { url: '/calendario', changefreq: 'daily', priority: '0.8' },
  { url: '/santos-do-dia', changefreq: 'daily', priority: '0.8' },
  { url: '/mapa', changefreq: 'monthly', priority: '0.7' },
  { url: '/rosario', changefreq: 'monthly', priority: '0.7' },
  { url: '/vida-de-cristo', changefreq: 'monthly', priority: '0.7' },
  { url: '/novenas', changefreq: 'weekly', priority: '0.7' },
  { url: '/oracoes', changefreq: 'weekly', priority: '0.7' },
  { url: '/album-sagrado', changefreq: 'weekly', priority: '0.7' },
  { url: '/favoritos', changefreq: 'monthly', priority: '0.5' },
  { url: '/intencoes', changefreq: 'monthly', priority: '0.6' },
];

// Função para ler arquivos JSON
function readJsonFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erro ao ler ${filePath}:`, error.message);
    return [];
  }
}

// Função para formatar data no formato ISO
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Gerar URLs dinâmicas
function generateDynamicUrls() {
  const urls = [];
  const today = formatDate(new Date());

  // Santos
  const santos = readJsonFile('data/santos.json');
  santos.forEach(santo => {
    if (santo.slug) {
      urls.push({
        url: `/santos/${santo.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: today
      });
    }
  });

  // Igrejas
  const igrejas = readJsonFile('data/igrejas.json');
  igrejas.forEach(igreja => {
    if (igreja.slug) {
      urls.push({
        url: `/igrejas/${igreja.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: today
      });
    }
  });

  // Aparições
  const aparicoes = readJsonFile('data/aparicoes.json');
  aparicoes.forEach(aparicao => {
    if (aparicao.slug) {
      urls.push({
        url: `/aparicoes/${aparicao.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: today
      });
    }
  });

  // Novenas
  const novenas = readJsonFile('data/novenas.json');
  novenas.forEach(novena => {
    if (novena.slug) {
      urls.push({
        url: `/novenas/${novena.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: today
      });
    }
  });

  // Orações
  const oracoes = readJsonFile('data/oracoes.json');
  oracoes.forEach(oracao => {
    if (oracao.slug) {
      urls.push({
        url: `/oracoes/${oracao.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: today
      });
    }
  });

  // Coleções do Álbum Sagrado
  const colecoes = readJsonFile('data/album-colecoes.json');
  colecoes.forEach(colecao => {
    if (colecao.slug) {
      urls.push({
        url: `/album-sagrado/${colecao.slug}`,
        changefreq: 'weekly',
        priority: '0.6',
        lastmod: today
      });
    }
  });

  return urls;
}

// Gerar XML do sitemap
function generateSitemapXml() {
  const today = formatDate(new Date());
  const dynamicUrls = generateDynamicUrls();
  const allUrls = [...staticPages, ...dynamicUrls];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allUrls.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

// Salvar sitemap
function saveSitemap() {
  const sitemapXml = generateSitemapXml();
  const publicDir = path.join(__dirname, '..', 'public');

  // Criar diretório public se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

  console.log('✅ Sitemap gerado com sucesso em /public/sitemap.xml');
  console.log(`📊 Total de URLs: ${generateDynamicUrls().length + staticPages.length}`);
}

// Executar
try {
  saveSitemap();
} catch (error) {
  console.error('❌ Erro ao gerar sitemap:', error);
  process.exit(1);
}

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

// Gerar URLs dinâmicas por categoria
function generateDynamicUrls() {
  const urls = {
    santos: [],
    igrejas: [],
    aparicoes: [],
    novenas: [],
    oracoes: [],
    album: []
  };
  const today = formatDate(new Date());

  // Santos
  const santos = readJsonFile('data/santos.json');
  santos.forEach(santo => {
    if (santo.slug) {
      urls.santos.push({
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
      urls.igrejas.push({
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
      urls.aparicoes.push({
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
      urls.novenas.push({
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
      urls.oracoes.push({
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
      urls.album.push({
        url: `/album-sagrado/${colecao.slug}`,
        changefreq: 'weekly',
        priority: '0.6',
        lastmod: today
      });
    }
  });

  return urls;
}

// Gerar XML de um sitemap individual
function generateSitemapXml(urls) {
  const today = formatDate(new Date());

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(page => {
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

// Gerar sitemap index XML
function generateSitemapIndex(sitemaps) {
  const today = formatDate(new Date());

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/${sitemap.filename}</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod || today}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';

  return xml;
}

// Salvar sitemaps
function saveSitemaps() {
  const publicDir = path.join(__dirname, '..', 'public');

  // Criar diretório public se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const today = formatDate(new Date());
  const dynamicUrls = generateDynamicUrls();
  const sitemaps = [];

  // Páginas principais
  if (staticPages.length > 0) {
    const pagesXml = generateSitemapXml(staticPages);
    const pagesPath = path.join(publicDir, 'pages-sitemap.xml');
    fs.writeFileSync(pagesPath, pagesXml, 'utf8');
    sitemaps.push({ filename: 'pages-sitemap.xml', lastmod: today });
    console.log('✅ pages-sitemap.xml gerado');
  }

  // Santos
  if (dynamicUrls.santos.length > 0) {
    const santosXml = generateSitemapXml(dynamicUrls.santos);
    const santosPath = path.join(publicDir, 'santos-sitemap.xml');
    fs.writeFileSync(santosPath, santosXml, 'utf8');
    sitemaps.push({ filename: 'santos-sitemap.xml', lastmod: today });
    console.log('✅ santos-sitemap.xml gerado');
  }

  // Igrejas
  if (dynamicUrls.igrejas.length > 0) {
    const igrejasXml = generateSitemapXml(dynamicUrls.igrejas);
    const igrejasPath = path.join(publicDir, 'igrejas-sitemap.xml');
    fs.writeFileSync(igrejasPath, igrejasXml, 'utf8');
    sitemaps.push({ filename: 'igrejas-sitemap.xml', lastmod: today });
    console.log('✅ igrejas-sitemap.xml gerado');
  }

  // Aparições
  if (dynamicUrls.aparicoes.length > 0) {
    const aparicoesXml = generateSitemapXml(dynamicUrls.aparicoes);
    const aparicoesPath = path.join(publicDir, 'aparicoes-sitemap.xml');
    fs.writeFileSync(aparicoesPath, aparicoesXml, 'utf8');
    sitemaps.push({ filename: 'aparicoes-sitemap.xml', lastmod: today });
    console.log('✅ aparicoes-sitemap.xml gerado');
  }

  // Novenas
  if (dynamicUrls.novenas.length > 0) {
    const novenasXml = generateSitemapXml(dynamicUrls.novenas);
    const novenasPath = path.join(publicDir, 'novenas-sitemap.xml');
    fs.writeFileSync(novenasPath, novenasXml, 'utf8');
    sitemaps.push({ filename: 'novenas-sitemap.xml', lastmod: today });
    console.log('✅ novenas-sitemap.xml gerado');
  }

  // Orações
  if (dynamicUrls.oracoes.length > 0) {
    const oracoesXml = generateSitemapXml(dynamicUrls.oracoes);
    const oracoesPath = path.join(publicDir, 'oracoes-sitemap.xml');
    fs.writeFileSync(oracoesPath, oracoesXml, 'utf8');
    sitemaps.push({ filename: 'oracoes-sitemap.xml', lastmod: today });
    console.log('✅ oracoes-sitemap.xml gerado');
  }

  // Álbum Sagrado
  if (dynamicUrls.album.length > 0) {
    const albumXml = generateSitemapXml(dynamicUrls.album);
    const albumPath = path.join(publicDir, 'album-sitemap.xml');
    fs.writeFileSync(albumPath, albumXml, 'utf8');
    sitemaps.push({ filename: 'album-sitemap.xml', lastmod: today });
    console.log('✅ album-sitemap.xml gerado');
  }

  // Gerar sitemap index
  const sitemapIndexXml = generateSitemapIndex(sitemaps);
  const sitemapIndexPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapIndexPath, sitemapIndexXml, 'utf8');

  const totalUrls = staticPages.length + 
    dynamicUrls.santos.length + 
    dynamicUrls.igrejas.length + 
    dynamicUrls.aparicoes.length + 
    dynamicUrls.novenas.length + 
    dynamicUrls.oracoes.length + 
    dynamicUrls.album.length;

  console.log('\n✅ Sitemap index gerado com sucesso em /public/sitemap.xml');
  console.log(`📊 Total de URLs: ${totalUrls}`);
  console.log(`📁 Total de sitemaps: ${sitemaps.length}`);
}

// Executar
try {
  saveSitemaps();
} catch (error) {
  console.error('❌ Erro ao gerar sitemap:', error);
  process.exit(1);
}

import fs from 'fs';
import path from 'path';

// Função para ler arquivos JSON
function readJsonFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
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
function generateSitemapXml(urls, siteUrl) {
  const today = formatDate(new Date());

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${siteUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

// Gerar sitemap index XML
function generateSitemapIndex(sitemaps, siteUrl) {
  const today = formatDate(new Date());

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${siteUrl}/${sitemap.filename}</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod || today}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';

  return xml;
}

// Função para obter a URL do site dinamicamente
function getSiteUrl(req) {
  // Priorizar variável de ambiente
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Usar VERCEL_URL em produção
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Usar host do request como fallback
  const host = req.headers.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function getServerSideProps({ req, res, query }) {
  // Obter URL do site dinamicamente
  const siteUrl = getSiteUrl(req);
  const today = formatDate(new Date());

  // Verificar se é uma requisição para um sub-sitemap específico
  const { type } = query;

  if (type) {
    // Gerar sub-sitemap específico
    const dynamicUrls = generateDynamicUrls();
    let urls = [];

    switch (type) {
      case 'pages':
        urls = staticPages;
        break;
      case 'santos':
        urls = dynamicUrls.santos;
        break;
      case 'igrejas':
        urls = dynamicUrls.igrejas;
        break;
      case 'aparicoes':
        urls = dynamicUrls.aparicoes;
        break;
      case 'novenas':
        urls = dynamicUrls.novenas;
        break;
      case 'oracoes':
        urls = dynamicUrls.oracoes;
        break;
      case 'album':
        urls = dynamicUrls.album;
        break;
      default:
        res.statusCode = 404;
        return { props: {} };
    }

    const xml = generateSitemapXml(urls, siteUrl);
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    res.write(xml);
    res.end();

    return { props: {} };
  }

  // Gerar sitemap index (principal)
  const dynamicUrls = generateDynamicUrls();
  const sitemaps = [];

  // Adicionar sitemaps apenas se houver URLs
  if (staticPages.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=pages', lastmod: today });
  }
  if (dynamicUrls.santos.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=santos', lastmod: today });
  }
  if (dynamicUrls.igrejas.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=igrejas', lastmod: today });
  }
  if (dynamicUrls.aparicoes.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=aparicoes', lastmod: today });
  }
  if (dynamicUrls.novenas.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=novenas', lastmod: today });
  }
  if (dynamicUrls.oracoes.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=oracoes', lastmod: today });
  }
  if (dynamicUrls.album.length > 0) {
    sitemaps.push({ filename: 'sitemap.xml?type=album', lastmod: today });
  }

  const xml = generateSitemapIndex(sitemaps, siteUrl);

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
}

// Componente vazio (não renderiza nada, apenas retorna XML via getServerSideProps)
export default function Sitemap() {
  return null;
}

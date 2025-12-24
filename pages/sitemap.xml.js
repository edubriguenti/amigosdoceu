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

// Gerar todas as URLs dinâmicas
function generateAllUrls() {
  const urls = [];
  const today = formatDate(new Date());

  // Adicionar páginas estáticas
  staticPages.forEach(page => {
    urls.push({
      url: page.url,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: today
    });
  });

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

// Função para escapar caracteres especiais em XML
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Gerar XML do sitemap
function generateSitemapXml(urls, siteUrl) {
  const today = formatDate(new Date());

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(page => {
    // Construir URL completa e escapar para XML
    const fullUrl = `${siteUrl}${page.url}`;
    const escapedUrl = escapeXml(fullUrl);
    
    xml += '  <url>\n';
    xml += `    <loc>${escapedUrl}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

// Função para obter a URL do site dinamicamente
function getSiteUrl(req) {
  // Priorizar variável de ambiente personalizada (use esta no Vercel!)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  }

  // Detectar produção Vercel pela URL principal
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Para preview/development, usar VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback específico para o domínio de produção
  const host = req?.headers?.host || '';
  if (host.includes('amigosdoceu.vercel.app') || host.includes('amigosdoceu.com')) {
    return 'https://amigosdoceu.vercel.app';
  }

  // Fallback para localhost
  const fallbackHost = host || 'localhost:3000';
  const protocol = fallbackHost.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${fallbackHost}`;
}

export async function getServerSideProps({ req, res }) {
  try {
    // Obter URL do site dinamicamente
    const siteUrl = getSiteUrl(req);
    
    // Gerar todas as URLs
    const allUrls = generateAllUrls();
    
    // Gerar XML
    const xml = generateSitemapXml(allUrls, siteUrl);

    // Configurar headers corretos para XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, must-revalidate');
    res.setHeader('ETag', `"${Date.now()}"`);
    
    // Escrever resposta
    res.write(xml);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write('<?xml version="1.0" encoding="UTF-8"?><error>Erro ao gerar sitemap</error>');
    res.end();
    return { props: {} };
  }
}

// Componente vazio (não renderiza nada, apenas retorna XML via getServerSideProps)
export default function Sitemap() {
  return null;
}

import Head from 'next/head';

/**
 * Componente SEO
 * Gerencia meta tags dinâmicas, Open Graph, Twitter Cards e Structured Data
 * Uso: <SEO title="Página" description="..." structuredData={{...}} />
 */
export default function SEO({
  title = 'Amigos do Céu',
  description = 'Galeria contemplativa de santos católicos, igrejas históricas e aparições marianas. Explore vidas que inspiram fé e devoção através dos séculos.',
  image = '/images/og-image.jpg',
  url = 'https://amigosdoceu.vercel.app',
  type = 'website',
  author = null,
  publishedTime = null,
  modifiedTime = null,
  keywords = null,
  structuredData = null,
  noindex = false
}) {
  // Título completo (adiciona " | Amigos do Céu" se não for homepage)
  const fullTitle = title === 'Amigos do Céu'
    ? title
    : `${title} | Amigos do Céu`;

  // URL absoluta da imagem
  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `https://amigosdoceu.vercel.app${image}`;

  // Keywords padrão + adicionais
  const defaultKeywords = 'santos católicos, igreja católica, santos, fé católica, devoção, orações, calendário litúrgico';
  const allKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;

  return (
    <Head>
      {/* Meta Tags Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Amigos do Céu" />
      <meta property="og:locale" content="pt_BR" />

      {/* Article-specific Open Graph */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* Structured Data (Schema.org JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Structured Data Padrão - Organization */}
      {!structuredData && type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Amigos do Céu",
              "description": description,
              "url": "https://amigosdoceu.vercel.app",
              "inLanguage": "pt-BR",
              "publisher": {
                "@type": "Organization",
                "name": "Amigos do Céu",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://amigosdoceu.vercel.app/images/rosario_icon2.png"
                }
              }
            })
          }}
        />
      )}
    </Head>
  );
}

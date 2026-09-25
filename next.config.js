/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: ['upload.wikimedia.org', 'ldsblogs.com', 'www.turismoroma.it'].map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    // Obras de arte não mudam: 30 dias de cache evitam voltar ao Wikimedia a cada acesso (429).
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    // Coleções do álbum antigo (substituídas pelas páginas do Álbum Sagrado v2)
    return ['santos-modernos', 'fundadores-doutores'].map((slug) => ({
      source: `/album-sagrado/${slug}`,
      destination: '/album-sagrado',
      permanent: true,
    }))
  }
}
module.exports = nextConfig

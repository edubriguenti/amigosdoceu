/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', 'ldsblogs.com', 'www.turismoroma.it']
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

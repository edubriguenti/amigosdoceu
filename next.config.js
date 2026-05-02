/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', 'ldsblogs.com', 'www.turismoroma.it']
  }
}
module.exports = nextConfig

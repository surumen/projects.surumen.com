/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  //zbasePath: '/projects.surumen.com',
  webpack(config) {
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
}

module.exports = nextConfig

const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // basePath: '/projects.surumen.com',

  // Tell the Sass compiler where to look for your partials
  sassOptions: {
    includePaths: [path.join(__dirname, 'style')],
  },

  webpack: (config) => {
    // raw-loader for your Markdown imports
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = nextConfig;


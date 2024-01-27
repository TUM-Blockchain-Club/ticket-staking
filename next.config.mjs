/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  i18n: {
    locales: ['en-US', 'du-DE'],
    defaultLocale: 'en-US',
  },
}

export default nextConfig

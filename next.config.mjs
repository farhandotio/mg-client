/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, 
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'], 
    qualities: [25, 50, 75, 100], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'mg-server.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // টাইপস্ক্রিপ্ট এরর থাকলেও বিল্ড হবে
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;

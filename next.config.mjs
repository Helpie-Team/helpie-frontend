/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kr.object.ncloudstorage.com',
        pathname: '/helpie-bucket/**',
      },
      {
        protocol: 'https',
        hostname: 'helpie-main.vercel.app',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://49.50.132.119:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;

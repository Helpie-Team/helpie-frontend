/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kr.object.ncloudstorage.com',
        pathname: '/helpie-bucket/**',
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
      },
    ],
  },
};

export default nextConfig;

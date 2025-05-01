import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Add Pexels image domain
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
       { // Add Pexels video domain (might be needed if API returns video previews)
        protocol: 'https',
        hostname: 'videos.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

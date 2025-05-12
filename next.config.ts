
import type {NextConfig} from 'next';

const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === 'true';
const REPO_NAME = 'Wallify'; // Your repository name

const nextConfig: NextConfig = {
  output: 'export', // Ensure static export is configured
  basePath: IS_GITHUB_ACTIONS ? `/${REPO_NAME}` : undefined, // Set basePath for GitHub Pages
  assetPrefix: IS_GITHUB_ACTIONS ? `/${REPO_NAME}/` : undefined, // Set assetPrefix for GitHub Pages

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Crucial for `output: 'export'` and static hosts like GitHub Pages
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

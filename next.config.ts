import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  // The site has one route and fragment navigation. Prefix its exported assets
  // without changing the route used by Vinext's static prerenderer.
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
};
export default nextConfig;

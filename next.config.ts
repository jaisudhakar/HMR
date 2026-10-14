import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Pexels serves resized images from its own CDN, so we hand it the width directly.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

/**
 * Next.js Configuration
 *
 * Optimized for performance following Prompt 21 guidelines.
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    // Modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for next/image with sizes prop
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Remote image domains (add as needed)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
    // Minimize image processing in development
    minimumCacheTTL: 60,
  },

  // Webpack configuration for bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Production-only optimizations
    if (!dev && !isServer) {
      // Tree shaking for Three.js - only import what we use
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use the minimal Three.js entry for smaller bundles
        // Note: This may need adjustment based on actual imports
      };

      // Optimize chunks
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate Three.js into its own chunk
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three-vendor',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate React/Next.js framework code
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              name: 'framework',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Separate animation libraries
            animation: {
              test: /[\\/]node_modules[\\/](framer-motion|gsap)[\\/]/,
              name: 'animation-vendor',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Other vendor code
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Handle GLSL shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'framer-motion',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
    ],
  },

  // Turbopack configuration (empty to acknowledge webpack config)
  turbopack: {},

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects (if needed)
  async redirects() {
    return [];
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression is handled by Vercel/server
  compress: true,
};

export default nextConfig;
